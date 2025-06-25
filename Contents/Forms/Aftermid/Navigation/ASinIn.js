import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

const initialUsers = [
  { name: 'John Doe', email: 'john@example.com', gender: 'Male', password: 'password123' },
  { name: 'Jane Smith', email: 'jane@example.com', gender: 'Female', password: 'password123' },
  // Add more users as needed
];

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const signIn = () => {
    const user = initialUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      navigation.navigate('Home', { user });
    } else {
      setError(true);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.error]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, error && styles.error]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={signIn} />
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 8 },
  error: { borderColor: 'red' },
});
