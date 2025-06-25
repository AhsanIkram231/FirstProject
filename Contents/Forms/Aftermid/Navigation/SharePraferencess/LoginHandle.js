import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const existingUser = await AsyncStorage.getItem(username);
    if (existingUser) {
      Alert.alert('Error', 'Username already exists');
      return;
    }

    await EncryptedStorage.setItem(username, JSON.stringify({ password }));
    Alert.alert('Success', 'Signup Successful');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const loadSavedCredentials = async () => {
      const savedUsername = await AsyncStorage.getItem('savedUsername');
      if (savedUsername) {
        setUsername(savedUsername);
        const savedData = await EncryptedStorage.getItem(savedUsername);
        if (savedData) {
          const { password: savedPassword } = JSON.parse(savedData);
          setPassword(savedPassword);
        }
      }
    };
    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const storedData = await EncryptedStorage.getItem(username);
    if (!storedData) {
      Alert.alert('Error', 'User not found');
      return;
    }

    const { password: storedPassword } = JSON.parse(storedData);
    if (storedPassword === password) {
      if (remember) {
        await AsyncStorage.setItem('savedUsername', username);
      }
      navigation.navigate('Home', { username });
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <View style={styles.switchContainer}>
        <Switch value={remember} onValueChange={setRemember} />
        <Text>Remember Me</Text>
      </View>
      <Button title="Login" onPress={handleLogin} />
      <Button title="Signup" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
};

const HomeScreen = ({ route, navigation }) => {
  const { username } = route.params;
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    const storedData = await EncryptedStorage.getItem(username);
    if (!storedData) {
      Alert.alert('Error', 'User not found');
      return;
    }

    const { password: storedPassword } = JSON.parse(storedData);
    if (storedPassword !== oldPassword) {
      Alert.alert('Error', 'Old password incorrect');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    await EncryptedStorage.setItem(username, JSON.stringify({ password: newPassword }));
    Alert.alert('Success', 'Password changed successfully');
  };

  const handleDeleteAccount = async () => {
    await EncryptedStorage.removeItem(username);
    await AsyncStorage.removeItem('savedUsername');
    Alert.alert('Success', 'Account deleted');
    navigation.navigate('Login');
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {username}</Text>
      <TextInput style={styles.input} placeholder="Old Password" secureTextEntry value={oldPassword} onChangeText={setOldPassword} />
      <TextInput style={styles.input} placeholder="New Password" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      <Button title="Change Password" onPress={handleChangePassword} />
      <Button title="Delete Account" onPress={handleDeleteAccount} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const MainScreen = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Basic Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export { SignupScreen, LoginScreen, HomeScreen, MainScreen };
