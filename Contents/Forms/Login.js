import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import React, { useState } from 'react';

const Login = () => {

  const correctUsername = 'Ahsan';
  const correctPassword = '1234';




  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleLogin = () => {
    if (username == correctUsername && password == correctPassword) {
      setValidationMessage('Successfully logged in');
      setIsValid(true);
    }
    else {
      setValidationMessage('Invalid username or password');
      setIsValid(false);
    }
  };

  return (
    <View style={styles.background}>
      <Text style={styles.headingText}>Login</Text>
      <View style={styles.viewInput}>
        <TextInput
          style={styles.txtInput}
          placeholder="Enter Username"
          placeholderTextColor="#7f8c8d"
          value={username}
          onChangeText={setUsername}
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

export default Login;
