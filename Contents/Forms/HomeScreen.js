import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome Ahsan!</Text>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardText}>Card 1</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>Card 2</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>Card 3</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardContainer: {
    width: '90%',
    alignItems: 'center',
  },
  card: {
    width: '80%',
    padding: 20,
    backgroundColor: '#74b9ff',
    borderRadius: 10,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginVertical: 10,
    
  },
  cardText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});

export default HomeScreen;
