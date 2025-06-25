import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import React, { useState } from 'react';

const SignInLAb = () => {
  const initialUsers = [
    { name: 'AhsanIkram', email: 'ahsanikram231@gamil.com', gender: 'Male', password: '123' },
  ];



  const [name, setname] = useState('');
  const [password, setPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleLogin = () => {
    if (name == correctname && password == correctPassword) {
      setValidationMessage('Successfully logged in');
      setIsValid(true);
    }
    else {
      setValidationMessage('Invalid name or password');
      setIsValid(false);
    }
  };

  return (
    <View style={styles.background}>
      <Text style={styles.headingText}>Login</Text>
      <View style={styles.viewInput}>
        <TextInput
          style={styles.txtInput}
          placeholder="Enter name"
          placeholderTextColor="#7f8c8d"
          value={name}
          onChangeText={setname}
        />
        <TextInput
          style={styles.txtInput}
          placeholder="Enter Password"
          placeholderTextColor="#7f8c8d"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View>
        {validationMessage ? (
          <Text style={[styles.validation, { color: isValid ? 'green' : 'red' }]}>
            {validationMessage}
          </Text>
        ) : null}
      </View >
      <View style={styles.button}>
        <Button onPress={handleLogin} title="Login" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFFF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  headingText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  viewInput: {
    width: '80%',
  },
  txtInput: {
    backgroundColor: '#dcdde1',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
    color: '#000000',
  },
  validation: {
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    width: '30%',
    marginTop: 10,

  },
});

export default SignInLAb;
