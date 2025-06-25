import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/hassan.png')} style={styles.image} />

      </View>

      <Text style={styles.welcomeText}>Welcome</Text>

      <Text style={styles.description}>
        Hello, thank you for downloading our App! Follow our guide for helping you to use this application.
      </Text>
      <Text style={styles.description}>
        If this is not the first time, you can skip this guide. But if you want to follow our guide again, it's no problem.
      </Text>

      <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate('Hassan1')}
      >
        <Text style={styles.buttonText}>Get Started →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8FBF8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 350,
    height: 350,
    marginRight: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4BB543',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#50C9C3',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#50C9C3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
