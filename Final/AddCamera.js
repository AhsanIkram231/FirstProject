import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const AddCamera = () => {
  const navigation = useNavigation();
  const [cameraName, setCameraName] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('');
  const [cameraType, setCameraType] = useState('');
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [directions, setDirections] = useState([]);
  const cameraTypes = ['Front', 'Side'];

  useEffect(() => {
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

    fetchCities();
  }, []);

  const fetchPlaces = async (cityName) => {
    try {
      const response = await fetch(`${global.furl}place?name=${encodeURIComponent(cityName)}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setPlaces(data);
      } else {
        console.error('Error fetching places:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchDirections = async (placeName) => {
    try {
      const response = await fetch(`${global.furl}directions?name=${encodeURIComponent(placeName)}`, {
        method: 'GET', // ✅ Corrected to GET
        headers: {
          'Content-Type': 'application/json', // Not required for GET, but safe to include
        },
      });
  
      const data = await response.json();
  
      if (Array.isArray(data)) {
        setDirections(data);
      } else {
        console.error('Error fetching directions:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  

  const handleSaveCamera = async () => {
    if (!cameraName || !selectedCity || !selectedPlace || !selectedDirection || !cameraType) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
  
    try {
      const response = await fetch(`${global.furl}addcamera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cameraName,            // Use 'name' instead of 'cameraName'
          directionname: selectedDirection, // Use 'directionname' instead of 'selectedDirection'
          type: cameraType,            // Use 'type' instead of 'cameraType'
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', 'Camera added successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.error || 'Failed to add camera.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving the camera.');
      console.error('Error:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Camera</Text>
        <Text style={styles.headerSubtitle}>
          Set up and manage a new traffic control post location
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter Camera Name"
          value={cameraName}
          onChangeText={setCameraName}
        />

        <Picker
          selectedValue={selectedCity}
          style={styles.input}
          onValueChange={(itemValue) => {
            setSelectedCity(itemValue);
            setPlaces([]); // Clear places when city changes
            setSelectedPlace('');
            setDirections([]); // Clear directions
            setSelectedDirection('');
            fetchPlaces(itemValue);
          }}
        >
          <Picker.Item label="Select City" value="" />
          {cities.map((city, index) => (
            <Picker.Item key={index} label={city.name} value={city.name} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedPlace}
          style={styles.input}
          onValueChange={(itemValue) => {
            setSelectedPlace(itemValue);
            setDirections([]); // Clear directions when place changes
            setSelectedDirection('');
            fetchDirections(itemValue);
          }}
          enabled={places.length > 0} // Disable if no places are available
        >
          <Picker.Item label="Select Place" value="" />
          {places.map((place, index) => (
            <Picker.Item key={index} label={place.name} value={place.name} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedDirection}
          style={styles.input}
          onValueChange={(itemValue) => setSelectedDirection(itemValue)}
          enabled={directions.length > 0} // Disable if no directions available
        >
          <Picker.Item label="Select Direction" value="" />
          {directions.map((direction, index) => (
            <Picker.Item key={index} label={direction.name} value={direction.name} />
          ))}
        </Picker>

        <Picker
          selectedValue={cameraType}
          style={styles.input}
          onValueChange={(itemValue) => setCameraType(itemValue)}
        >
          <Picker.Item label="Select Camera Type" value="" />
          {cameraTypes.map((type, index) => (
            <Picker.Item key={index} label={type} value={type} />
          ))}
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleSaveCamera}>
          <Text style={styles.buttonText}>Save Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  backButton: { backgroundColor: "#ddd", padding: 12, borderRadius: 5, marginTop: 5 },
  backButtonText: { textAlign: "center", color: "black" },
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
});

export default AddCamera;
