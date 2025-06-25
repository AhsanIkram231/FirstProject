import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Role = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.icon} />
      <Text style={styles.title}>Choose Your Role</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SignInScreen')}
      >
        <Text style={styles.buttonText}>Continue as User</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('WardenSignInScreen')}
      >
        <Text style={styles.buttonText}>Continue as Warden</Text>
      </TouchableOpacity>
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
});

export default Role;
