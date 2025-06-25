import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const WardenSignInScreen = () => {

  const navigation = useNavigation();
  const [badge, setBadge] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    try {
      const response = await fetch(`${global.furl}wardenlogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          badge: badge,
          password: password,
        }),
      });
  
      const data = await response.json();
      console.log("Login response:", data);
  
      if (response.ok) {
        if (data.PermissionType === 0) {
          navigation.navigate('AdminDashboard', { warden: data });
        } else {
          navigation.navigate('WardenDashboard', { warden: data });
        }
      } else {
        alert(data.message || "Invalid Badge or Password");
      }
    } catch (error) {
      alert('Login failed. Please try again.');
      console.error(error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.icon} />
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Badge Number"
        // keyboardType="number-pad"
        value={badge}
        onChangeText={setBadge}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>





      {/* <Text style={styles.footerText}>
        Don't have an account?{' '}
        <Text onPress={() => navigation.navigate('SignUpScreen')} style={styles.signUpText}>
          Sign Up
        </Text>
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00bfa5',
    paddingVertical: 15,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  signUpText: {
    color: '#00bfa5',
    fontWeight: 'bold',
  },
});

export default WardenSignInScreen;
