import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const DeletePlace = () => {
  const navigation = useNavigation();
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(''); // initially no city is selected
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity !== '') {
      fetchPlaces(selectedCity);
    }
  }, [selectedCity]);

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
      setLoading(true);
      let allPlaces = [];

      if (cityName === 'All') {
        for (const city of cities) {
          const url = `${global.furl}place?name=${encodeURIComponent(city.name)}`;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            allPlaces = [...allPlaces, ...data];
          }
        }
      } else {
        const url = `${global.furl}place?name=${encodeURIComponent(cityName)}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          allPlaces = data;
        } else {
          Alert.alert('Error', 'Failed to fetch places');
        }
      }

      setPlaces(allPlaces);
      setFilteredPlaces(allPlaces);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching places');
    } finally {
      setLoading(false);
    }
  };

  const searchPlace = (text) => {
    setSearch(text);
    const filtered = places.filter((place) =>
      place.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPlaces(filtered);
  };

  const deletePlace = async (placeName) => {
    if (selectedCity === 'All' || selectedCity === '') {
      Alert.alert('Error', 'Please select a specific city to delete a place.');
      return;
    }

    try {
      const response = await fetch(`${global.furl}deleteplace`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placename: placeName,
          cityname: selectedCity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `${placeName} deleted successfully`);
        fetchPlaces(selectedCity);
        setSearch('');
      } else {
        Alert.alert('Error', data.error || 'Failed to delete place');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the place');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Delete Place</Text>
        <Text style={styles.headerSubtitle}>Select City to View Places</Text>
      </View>

      <View style={styles.form}>
        <Picker
          selectedValue={selectedCity}
          onValueChange={(value) => setSelectedCity(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select City" value="" />
          <Picker.Item label="All Cities" value="All" />
          {cities.map((city) => (
            <Picker.Item key={city.id} label={city.name} value={city.name} />
          ))}
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Search Place by Name"
          value={search}
          onChangeText={searchPlace}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#2AB9A8" style={{ marginTop: 20 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.cityList}>
            {selectedCity === '' ? (
              <Text style={styles.noPlacesText}>Please select a city to view places.</Text>
            ) : filteredPlaces.length === 0 ? (
              <Text style={styles.noPlacesText}>No places found.</Text>
            ) : (
              filteredPlaces.map((place) => (
                <View key={place.id} style={styles.cityItem}>
                  <Text style={styles.cityName}>{place.name}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deletePlace(place.name)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        )}

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

export default DeletePlace;
