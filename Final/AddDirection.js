import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddDirection = () => {
  const navigation = useNavigation();

  const [directionName, setDirectionName] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [isCityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [isPlaceDropdownOpen, setPlaceDropdownOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);

  // Fetch cities from API on component mount
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

  // Fetch places based on selected city
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
  
  // Save direction to API
  const saveDirection = async () => {
    if (!directionName.trim()) {
      alert('Direction name cannot be empty!');
      return;
    }
    if (!selectedCity) {
      alert('Please select a city!');
      return;
    }
    if (!selectedPlace) {
      alert('Please select a place!');
      return;
    }

    try {
      const response = await fetch(`${global.furl}adddirection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placename: selectedPlace,
          directionname: directionName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Direction "${directionName}" added for place "${selectedPlace}"`);
        // Optionally, reset the form after a successful submission
        setDirectionName('');
        setSelectedCity('');
        setSelectedPlace('');
        navigation.goBack();
      } else {
        alert(`Error: ${data.error || 'Failed to add direction'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the direction.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Direction</Text>
        <Text style={styles.headerSubtitle}>
          Set up and manage a new traffic control direction
        </Text>
      </View>

      {/* Input Field for Direction */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter Direction Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., IJP Road"
          value={directionName}
          onChangeText={setDirectionName}
        />
      </View>

      {/* Dropdown for City */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select City:</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setCityDropdownOpen(!isCityDropdownOpen)}
        >
          <Text style={styles.dropdownText}>{selectedCity || 'Select a city'}</Text>
        </TouchableOpacity>

        {isCityDropdownOpen && (
          <Modal
            transparent={true}
            animationType="fade"
            onRequestClose={() => setCityDropdownOpen(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setCityDropdownOpen(false)}
            >
              <View style={styles.modalContainer}>
                <FlatList
                  data={cities}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedCity(item.name);
                        setCityDropdownOpen(false);
                        fetchPlaces(item.name); // Fetch places for the selected city
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>

      {/* Dropdown for Place */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Place:</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setPlaceDropdownOpen(!isPlaceDropdownOpen)}
        >
          <Text style={styles.dropdownText}>{selectedPlace || 'Select a place'}</Text>
        </TouchableOpacity>

        {isPlaceDropdownOpen && (
          <Modal
            transparent={true}
            animationType="fade"
            onRequestClose={() => setPlaceDropdownOpen(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setPlaceDropdownOpen(false)}
            >
              <View style={styles.modalContainer}>
                <FlatList
                  data={places}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedPlace(item.name);
                        setPlaceDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveDirection}>
          <Text style={styles.buttonText}>Save Direction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      {/* <View style={styles.footer}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🔔</Text>
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
  dropdownContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 3,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#F9F9F9',
  },
  dropdownText: {
    fontSize: 16,
    color: '#555',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    flex: 1, // This ensures the button container takes available space
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

export default AddDirection;
