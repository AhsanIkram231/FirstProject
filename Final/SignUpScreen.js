import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');



  const Signup = async () => {
  if (!fullName || !email || !cnic || !mobileNumber || !password || !confirmPassword) {
    alert("Please fill all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const obj = {
    name: fullName,
    email: email,
    cnic: cnic,
    mobilenumber: mobileNumber,
    password:password
  };

  try {
    const response = await fetch(`${global.furl}adduser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj)
    });

    const data = await response.json();

    if (response.ok) {
      if (data?.Successfully) {
        alert(data.Successfully);
        navigation.navigate('SignInScreen');
      } else {
        alert("Signup successful!");
      }
    } else {
      alert(data?.error || "Signup failed.");
    }

  } catch (error) {
    alert("An error occurred. Please try again later.");
    console.error("Signup error:", error);
  }
};



  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.icon} />
      <Text style={styles.title}>Create Your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Your Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Your Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Your Mobile Number"
        keyboardType="phone-pad"
        value={mobileNumber}
        onChangeText={setMobileNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your CNIC Number"
        keyboardType="numeric"
        value={cnic}
        onChangeText={setCnic}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity onPress={Signup} style={styles.button}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an Account?{' '}
        <Text style={styles.signInText} onPress={() => navigation.navigate('SignInScreen')}>
          Sign in
        </Text>
      </Text>
    </View>
  );
}

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
    borderRadius: 20
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
  signInText: {
    color: '#00bfa5',
    fontWeight: 'bold',
  },
});
export default SignUpScreen;