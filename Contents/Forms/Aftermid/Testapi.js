import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert, FlatList, StyleSheet } from 'react-native';

const API_URL = 'http://192.168.246.34/First_API/api/adductionController';

const Testapi = () => {
    const [user, setUser] = useState({
        userID: '',
        name: '',
        email: '',
        CNIC: '',
        password: '',
    });
    const [users, setUsers] = useState([]);
    const [editing, setEditing] = useState(false);

    const handleInputChange = (key, value) => {
        setUser({ ...user, [key]: value });
    };

    // CREATE User
    const addUser = async () => {
        try {
            const response = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });
            if (response.ok) {
                const data = await response.json();
                Alert.alert('Success', `User added: ${JSON.stringify(data)}`);
                fetchUsers();
            } else {
                Alert.alert('Error', `Failed to add user. Status: ${response.status}`);
            }
        } catch (error) {
            Alert.alert('Error', `Something went wrong: ${error.message}`);
        }
    };

    // READ Users
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/getAll`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                Alert.alert('Error', `Failed to fetch users. Status: ${response.status}`);
            }
        } catch (error) {
            Alert.alert('Error', `Something went wrong: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // UPDATE User
    const updateUser = async () => {
        try {
            const response = await fetch(`${API_URL}/update/${user.userID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });
            if (response.ok) {
                Alert.alert('Success', 'User updated successfully');
                fetchUsers();
                setEditing(false);
                setUser({ userID: '', name: '', email: '', CNIC: '', password: '' });
            } else {
                Alert.alert('Error', `Failed to update user. Status: ${response.status}`);
            }
        } catch (error) {
            Alert.alert('Error', `Something went wrong: ${error.message}`);
        }
    };

    // DELETE User
    const deleteUser = async (userID) => {
        try {
            const response = await fetch(`${API_URL}/delete/${userID}`, { method: 'DELETE' });
            if (response.ok) {
                Alert.alert('Success', 'User deleted successfully');
                fetchUsers();
            } else {
                Alert.alert('Error', `Failed to delete user. Status: ${response.status}`);
            }
        } catch (error) {
            Alert.alert('Error', `Something went wrong: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="User ID" keyboardType="numeric" value={user.userID} onChangeText={(text) => handleInputChange('userID', text)} />
            <TextInput style={styles.input} placeholder="Name" value={user.name} onChangeText={(text) => handleInputChange('name', text)} />
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={user.email} onChangeText={(text) => handleInputChange('email', text)} />
            <TextInput style={styles.input} placeholder="CNIC" value={user.CNIC} onChangeText={(text) => handleInputChange('CNIC', text)} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={user.password} onChangeText={(text) => handleInputChange('password', text)} />
            <Button title={editing ? 'Update User' : 'Add User'} onPress={editing ? updateUser : addUser} />
            <FlatList
                data={users}
                keyExtractor={(item) => item.userID.toString()}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text>{item.name} - {item.email}</Text>
                        <Button title="Edit" onPress={() => { setUser(item); setEditing(true); }} />
                        <Button title="Delete" onPress={() => deleteUser(item.userID)} color="red" />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 },
    listItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }
});

export default Testapi;
