import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'MapDB.db' });

const UseEffect = () => {
    const [customID, setCustomID] = useState('');
    const [name, setName] = useState('');
    const [searchID, setSearchID] = useState('');
    const [data, setData] = useState([]);
    const [showData, setShowData] = useState(false);

    useEffect(() => {
        createTable();
    }, []);

    const createTable = () => {
        db.transaction((txn) => {
            txn.executeSql(
                'CREATE TABLE IF NOT EXISTS Person(ID INTEGER PRIMARY KEY, name TEXT)',
                [],
                () => console.log('Table created successfully'),
                (txn, error) => console.error('Error creating table: ', error.message)
            );
        });
    };

    const addData = () => {
        if (!customID.trim() || !name.trim()) {
            Alert.alert('Validation', 'Please enter both ID and Name');
            return;
        }
        db.transaction((txn) => {
            txn.executeSql(
                'INSERT INTO Person (ID, name) VALUES (?, ?)',
                [parseInt(customID), name],
                () => {
                    Alert.alert('Success', 'Data added successfully');
                    setCustomID('');
                    setName('');
                },
                (txn, error) => {
                    console.error('Error adding data: ', error.message);
                    Alert.alert('Error', 'Unable to add data. Ensure the ID is unique.');
                }
            );
        });
    };

    const fetchData = (query, params = []) => {
        return new Promise((resolve, reject) => {
            db.transaction((txn) => {
                txn.executeSql(
                    query,
                    params,
                    (txn, results) => {
                        const rows = results.rows;
                        const fetchedData = [];
                        for (let i = 0; i < rows.length; i++) {
                            fetchedData.push(rows.item(i));
                        }
                        resolve(fetchedData);
                    },
                    (txn, error) => reject(error)
                );
            });
        });
    };

    const toggleDataVisibility = async () => {
        try {
            if (showData) {
                setShowData(false);
            } else {
                const fetchedData = await fetchData('SELECT * FROM Person');
                setData(fetchedData);
                setShowData(true);
            }
        } catch (error) {
            console.error('Error fetching data: ', error.message);
        }
    };

    const searchByID = async () => {
        if (!searchID.trim()) {
            Alert.alert('Validation', 'Please enter an ID');
            return;
        }
        try {
            const fetchedData = await fetchData('SELECT * FROM Person WHERE ID = ?', [parseInt(searchID)]);
            setData(fetchedData);
            setShowData(true);
        } catch (error) {
            console.error('Error searching by ID: ', error.message);
        }
    };

    const deleteData = () => {
        db.transaction((txn) => {
            txn.executeSql(
                'DELETE FROM Person',
                [],
                () => {
                    Alert.alert('Success', 'All data deleted successfully');
                    setData([]);
                    setShowData(false);
                },
                (txn, error) => console.error('Error deleting data: ', error.message)
            );
        });
    };

    const deleteById = () => {
        if (!searchID.trim()) {
            Alert.alert('Validation', 'Please enter an ID');
            return;
        }
        db.transaction((txn) => {
            txn.executeSql(
                'DELETE FROM Person WHERE ID = ?',
                [parseInt(searchID)],
                () => {
                    Alert.alert('Success', `Data deleted for ID: ${searchID}`);
                    setSearchID('');
                    toggleDataVisibility();
                },
                (txn, error) => console.error('Error deleting data: ', error.message)
            );
        });
    };

    const updatedata = () => {
        if (!searchID.trim() || !name.trim()) {
            Alert.alert('Validation', 'Please enter both ID and Name to update');
            return;
        }
        db.transaction((txn) => {
            txn.executeSql(
                'UPDATE Person SET name = ? WHERE ID = ?',
                [name, parseInt(searchID)],
                (txn, result) => {
                    if (result.rowsAffected > 0) {
                        Alert.alert('Success', 'Data updated successfully');
                        setName('');
                        setSearchID('');
                        toggleDataVisibility();
                    } else {
                        Alert.alert('Error', 'No record found with the given ID');
                    }
                },
                (txn, error) => console.error('Error updating data: ', error.message)
            );
        });
    };

    return (
        <View style={styles.background}>
            <TextInput
                style={styles.txtInput}
                placeholder="Enter Custom ID"
                value={customID}
                keyboardType="numeric"
                onChangeText={setCustomID}
            />
            <TextInput
                style={styles.txtInput}
                placeholder="Enter Name"
                value={name}
                onChangeText={setName}
            />
            <View style={styles.button}>
                <Button mode="contained" onPress={addData}>Add Data</Button>
                <TextInput
                    style={styles.txtInput}
                    placeholder="Enter ID to Search/Delete"
                    value={searchID}
                    keyboardType="numeric"
                    onChangeText={setSearchID}
                />
                <Button mode="contained" onPress={searchByID}>Search by ID</Button>
                <Button mode="contained" onPress={toggleDataVisibility}>Show All Data</Button>
                <Button mode="contained" onPress={deleteData}>Delete All Data</Button>
                <Button mode="contained" onPress={deleteById}>Delete By ID</Button>
                <Button mode="contained" onPress={updatedata}>Update Name</Button>
            </View>
            {showData && (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.ID.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Text>ID: {item.ID}, Name: {item.name}</Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text>No records found</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1, padding: 10, backgroundColor: '#fff' },
    txtInput: { backgroundColor: '#dcdde1', padding: 10, borderRadius: 50, marginBottom: 10, fontSize: 18 },
    button: { marginTop: 10 },
    listItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default UseEffect;
