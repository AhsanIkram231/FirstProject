import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const DeleteCamera = () => {
  const navigation = useNavigation();
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [directions, setDirections] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [search, setSearch] = useState('');

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchPlaces(selectedCity);
      setSelectedPlace('');
      setDirections([]);
      setCameras([]);
      setFilteredCameras([]);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedPlace) {
      fetchDirections(selectedPlace);
      setSelectedDirection('');
      setCameras([]);
      setFilteredCameras([]);
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (selectedPlace && selectedDirection) {
      fetchCameras(selectedPlace, selectedDirection);
    }
  }, [selectedDirection]);

  const fetchCities = async () => {
    try {
      const response = await fetch(`${global.furl}city`);
      const data = await response.json();
      if (Array.isArray(data)) setCities(data);
      else Alert.alert('Error', 'Failed to fetch cities.');
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching cities.');
    }
  };

  const fetchPlaces = async (cityName) => {
    try {
      const response = await fetch(`${global.furl}place?name=${encodeURIComponent(cityName)}`);
      const data = await response.json();
      if (Array.isArray(data)) setPlaces(data);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching places.');
    }
  };

  const fetchDirections = async (placeName) => {
    try {
      const response = await fetch(`${global.furl}directions?name=${encodeURIComponent(placeName)}`);
      const data = await response.json();
      if (Array.isArray(data)) setDirections(data);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching directions.');
    }
  };

  const fetchCameras = async (placeName, directionName) => {
    try {
      const response = await fetch(`${global.furl}camera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placename: placeName, directionname: directionName }),
      });
      const text = await response.text();
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        setCameras(data);
        setFilteredCameras(data);
      } else {
        Alert.alert('Error', data.error || 'No cameras found.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching cameras.');
    }
  };

  const searchCamera = (text) => {
    setSearch(text);
    const filtered = cameras.filter((cam) =>
      cam.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCameras(filtered);
  };

  const deleteCamera = async (camera) => {
    try {
      const response = await fetch(`${global.furl}deletecamera`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: camera.name,
          placename: selectedPlace,
          directionname: camera.direction,
          cameratype: camera.Type,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', `${camera.name} deleted successfully`);
        fetchCameras(selectedPlace, selectedDirection);
        setSearch('');
      } else {
        Alert.alert('Error', data.error || 'Failed to delete camera');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the camera.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Delete Camera</Text>
        <Text style={styles.headerSubtitle}>Select City, Place, and Direction</Text>
      </View>

      <View style={styles.form}>
        <Picker
          selectedValue={selectedCity}
          onValueChange={(value) => setSelectedCity(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select a City" value="" />
          {cities.map((city) => (
            <Picker.Item key={city.id} label={city.name} value={city.name} />
          ))}
        </Picker>

        {selectedCity !== '' && (
          <Picker
            selectedValue={selectedPlace}
            onValueChange={(value) => setSelectedPlace(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select a Place" value="" />
            {places.map((place) => (
              <Picker.Item key={place.id} label={place.name} value={place.name} />
            ))}
          </Picker>
        )}

        {selectedPlace !== '' && (
          <Picker
            selectedValue={selectedDirection}
            onValueChange={(value) => setSelectedDirection(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select a Direction" value="" />
            {directions.map((dir) => (
              <Picker.Item key={dir.id} label={dir.name} value={dir.name} />
            ))}
          </Picker>
        )}

        <TextInput
          style={styles.input}
          placeholder="Search Camera by Name"
          value={search}
          onChangeText={searchCamera}
        />

        <ScrollView contentContainerStyle={styles.cameraList}>
          {selectedPlace === '' || selectedDirection === '' ? (
            <Text style={styles.noCamerasText}>Please select both place and direction to view cameras.</Text>
          ) : filteredCameras.length === 0 ? (
            <Text style={styles.noCamerasText}>No cameras found.</Text>
          ) : (
            filteredCameras.map((camera) => (
              <View key={camera.id} style={styles.cameraItem}>
                <Text style={styles.cameraName}>
                  {camera.name} ({camera.Type})
                </Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteCamera(camera)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  headerSubtitle: { fontSize: 14, color: '#FFF', marginTop: 5 },
  form: { flex: 1, padding: 20 },
  picker: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    marginBottom: 15,
  },
  cameraList: {
    paddingBottom: 20,
  },
  cameraItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#DDD',
    borderWidth: 1,
  },
  cameraName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#E53935',
    padding: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  noCamerasText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#CCC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DeleteCamera;
