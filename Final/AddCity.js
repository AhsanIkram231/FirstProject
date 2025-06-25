import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddCity = () => {
  const navigation = useNavigation();
  const [cityName, setCityName] = useState('');

  const saveCity = async () => {
    if (!cityName.trim()) {
      Alert.alert('Error', 'City name cannot be empty!');
      return;
    }

    try {
      const response = await fetch(`${global.furl}addcity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: cityName }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', result.Successfully || 'City added successfully!');
        setCityName('');
        navigation.goBack();
      } else if (response.status === 409) {
        Alert.alert('Error', result.error || 'City already exists!');
      } else if (response.status === 400) {
        Alert.alert('Error', result.error || 'City name is required!');
      } else {
        Alert.alert('Error', result.error || 'Failed to add city!');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to the server. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add City</Text>
          <Text style={styles.headerSubtitle}>
            Set up and manage a new traffic control post location
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter City Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Islamabad"
            value={cityName}
            onChangeText={setCityName}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={saveCity}>
            <Text style={styles.buttonText}>Save City</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* <View style={styles.footer}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.navIcon}>🔔</Text>
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backButtonText:
  { textAlign: "center",
     color: "black" 
  },
  content: {
    flex: 1,
    padding: 5,
    backgroundColor: '#F0F0F0',
  },
  header: {
    backgroundColor: '#2AB9A8',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5,
  },
  inputContainer: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2AB9A8',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#CCC',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#006666',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
    color: '#fff',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
});

export default AddCity;
