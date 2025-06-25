import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ route, navigation }) {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Gender: {user.gender}</Text>
      <Button title="Log Out" onPress={() => navigation.navigate('SignIn')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
});
