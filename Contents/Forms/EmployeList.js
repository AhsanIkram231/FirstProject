import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import React, { useState } from 'react';
import { Button } from 'react-native-paper';

const EmployeList = () => {
    const initialEmployees = [
        { ID: 1, Name: 'Ahsan', Age: 20, City: 'Islamabad' },
        { ID: 2, Name: 'Zainab', Age: 18, City: 'Rawalpindi' },
        { ID: 3, Name: 'Eman', Age: 20, City: 'Attok' },
        { ID: 4, Name: 'Hassan', Age: 20, City: 'Islamabad' },
        { ID: 5, Name: 'Mughees', Age: 20, City: 'Rajanpur' },
    ];

    const [employee, setEmployee] = useState(initialEmployees);

    const deleteEmployee = (id) => {
        console.log("Deleting Employee with ID:", id);
        const filteredEmployees = employee.filter(e => e.ID !== id);
        setEmployee([...filteredEmployees]);
    };

    const resetEmployee = () => {
        setEmployee([...initialEmployees]);
    };

    const showAllEmployees = ({ item }) => {
        return (
            <View style={{ margin: 10, backgroundColor: 'pink', borderRadius: 12, borderWidth: 2 }}>
                <Text style={{ fontSize: 30, textAlign: 'center', color: 'red' }}>
                    {item.Name}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ borderWidth: 1, borderRadius: 10, margin: 5, padding: 5 }}>
                        <Text>City: {item.City}</Text>
                        <Text>Age: {item.Age}</Text>
                    </View>
                    <View style={{ borderWidth: 1, borderRadius: 10, margin: 5 }}>
                        <Button
                            labelStyle={{ fontSize: 20 }}
                            style={{ borderRadius: 5, margin: 5, backgroundColor: 'blue' }}
                            mode='contained'
                            rippleColor='white'
                            onPress={() => { Alert.alert(`ID: ${item.ID}`); }}
                        >
                            Show ID
                        </Button>
                        <Button
                            labelStyle={{ fontSize: 20 }}
                            style={{ borderRadius: 5, margin: 5, backgroundColor: 'red' }}
                            mode='contained'
                            rippleColor='white'
                            onPress={() => { deleteEmployee(item.ID); }}
                        >
                            Delete
                        </Button>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.background}>
            <Button
                mode='contained'
                rippleColor='white'
                onPress={resetEmployee}
                labelStyle={{ fontSize: 20 }}
                style={{ borderRadius: 5, margin: 5, backgroundColor: 'red' }}
            >
                Restart
            </Button>
            <FlatList
                data={employee}
                keyExtractor={item => item.ID.toString()}
                renderItem={showAllEmployees}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
});

export default EmployeList;
