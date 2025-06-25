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
import { useNavigation } from '@react-navigation/native';

const DeleteCity = () => {
  const navigation = useNavigation();
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch(`${global.furl}city`);
      const data = await response.json();
      if (response.ok) {
        setCities(data);
        setFilteredCities(data);
      } else {
        Alert.alert('Error', 'Failed to fetch cities');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching cities');
    }
  };

  const searchCity = (text) => {
    setSearch(text);
    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const confirmDelete = (cityName) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${cityName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteCity(cityName), style: 'destructive' },
      ]
    );
  };

  const deleteCity = async (cityName) => {
    try {
      const response = await fetch(`${global.furl}deletecity`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: cityName }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `${cityName} deleted successfully`);
        fetchCities();
        setSearch('');
      } else {
        Alert.alert('Error', data.error || 'Failed to delete city');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the city');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Delete City</Text>
        <Text style={styles.headerSubtitle}>Remove City by Name</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Search City by Name"
          value={search}
          onChangeText={searchCity}
        />

        <ScrollView contentContainerStyle={styles.cityList}>
          {filteredCities.map((city) => (
            <View key={city.id} style={styles.cityItem}>
              <Text style={styles.cityName}>{city.name}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(city.name)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
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
    flex:1,
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

export default DeleteCity;
