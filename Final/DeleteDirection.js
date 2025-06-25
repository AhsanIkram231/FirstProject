import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const DeleteDirection = () => {
  const navigation = useNavigation();
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [directions, setDirections] = useState([]);
  const [filteredDirections, setFilteredDirections] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchPlaces(selectedCity);
      setSelectedPlace('');
      setDirections([]);
      setFilteredDirections([]);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedPlace) {
      fetchDirections(selectedPlace);
    }
  }, [selectedPlace]);

  const fetchCities = async () => {
    try {
      const response = await fetch(`${global.furl}city`);
      const data = await response.json();
      if (response.ok) {
        setCities(data);
      } else {
        Alert.alert('Error', 'Failed to fetch cities');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching cities');
    }
  };

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
      const url = `${global.furl}directions?name=${encodeURIComponent(placeName)}`;
      const response = await fetch(url);
  
      // Try parsing JSON regardless of status
      const data = await response.json();
  
      if (response.ok) {
        setDirections(data);
        setFilteredDirections(data);
      } else if (response.status === 404 || data.error?.toLowerCase().includes('no direction')) {
        // No directions — valid case, clear the list
        setDirections([]);
        setFilteredDirections([]);
      } else {
        Alert.alert('Error', data.error || 'Error fetching directions');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching directions');
    }
  };
  

  const searchDirection = (text) => {
    setSearch(text);
    const filtered = directions.filter((direction) =>
      direction.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDirections(filtered);
  };

  const deleteDirection = async (directionName) => {
    if (!selectedPlace || !selectedCity) {
      Alert.alert('Error', 'Please select a city and place to delete a direction.');
      return;
    }

    try {
      const response = await fetch(`${global.furl}deletedirection`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placename: selectedPlace,
          directionname: directionName,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', `${directionName} deleted successfully`);
        fetchDirections(selectedPlace);
        setSearch('');
      } else {
        Alert.alert('Error', data.error || 'Failed to delete direction');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the direction');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Delete Direction</Text>
        <Text style={styles.headerSubtitle}>Select City and Place</Text>
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

        <TextInput
          style={styles.input}
          placeholder="Search Direction by Name"
          value={search}
          onChangeText={searchDirection}
        />

        <ScrollView contentContainerStyle={styles.cityList}>
          {selectedCity === '' || selectedPlace === '' ? (
            <Text style={styles.noPlacesText}>Please select both city and place to view directions.</Text>
          ) : filteredDirections.length === 0 ? (
            <Text style={styles.noPlacesText}>No directions found.</Text>
          ) : (
            filteredDirections.map((direction) => (
              <View key={direction.id} style={styles.cityItem}>
                <Text style={styles.cityName}>{direction.name}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteDirection(direction.name)}
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
    flex: 1,
    padding: 20,
  },
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
  cityList: {
    paddingBottom: 20,
  },
  cityItem: {
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
  cityName: {
    fontSize: 16,
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
  noPlacesText: {
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

export default DeleteDirection;
