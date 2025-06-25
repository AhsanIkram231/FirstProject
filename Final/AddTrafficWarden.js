import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const AddTrafficWarden = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cityName, setCityName] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch(`${global.furl}city`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setCities(data);
      } else {
        console.error('Error fetching cities:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    if (!name || !address || !cnic || !email || !mobileNumber || !cityName) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    const payload = {
      name,
      address,
      cnic,
      email,
      mobilenumber: mobileNumber,
      cityname: cityName,
    };

    try {
      const response = await fetch(`${global.furl}addtrafficwarden`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Traffic warden added successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.error || 'Failed to add traffic warden.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving the traffic warden.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Traffic Warden</Text>
        <Text style={styles.headerSubtitle}>
          Set up and manage a new traffic control post location
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter CNIC"
          keyboardType="numeric"
          value={cnic}
          onChangeText={setCnic}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Mobile Number"
          keyboardType="numeric"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />

        <Picker
          selectedValue={cityName}
          style={styles.input}
          onValueChange={(itemValue) => setCityName(itemValue)}
        >
          <Picker.Item label="Select City" value="" />
          {cities.map((city) => (
            <Picker.Item key={city.id} label={city.name} value={city.name} />
          ))}
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F0' },
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
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    borderColor: '#CCC',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#2AB9A8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    marginTop: 5,
  },
  backButtonText: {
    textAlign: 'center',
    color: 'black',
  },
});

export default AddTrafficWarden;
