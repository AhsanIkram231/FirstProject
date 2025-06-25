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

const AddPlace = () => {
  const navigation = useNavigation();

  const [placeName, setPlaceName] = useState('');
  const [selectedCity, setSelectedCity] = useState('Islamabad');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [cities, setCities] = useState([]);

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

  const savePlace = async () => {
    if (!placeName.trim()) {
      alert('Place name cannot be empty!');
      return;
    }
    if (!selectedCity) {
      alert('Please select a city!');
      return;
    }

    try {
      const response = await fetch(`${global.furl}addplace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cityname: selectedCity,
          placename: placeName,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Place "${placeName}" added successfully in city "${selectedCity}"`);
        setPlaceName('');
        navigation.goBack();
      } else {
        alert(`Error: ${result.error || 'Failed to add place!'}`);
      }
    } catch (error) {
      alert('Unable to connect to the server. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Place</Text>
          <Text style={styles.headerSubtitle}>
            Set up and manage a new traffic control post location
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter Place Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Faizabad"
            value={placeName}
            onChangeText={setPlaceName}
          />
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Select City:</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownOpen(!isDropdownOpen)}
          >
            <Text style={styles.dropdownText}>{selectedCity}</Text>
          </TouchableOpacity>

          {isDropdownOpen && (
            <Modal
              transparent={true}
              animationType="fade"
              onRequestClose={() => setDropdownOpen(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setDropdownOpen(false)}
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
                          setDropdownOpen(false);
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={savePlace}>
            <Text style={styles.buttonText}>Save Place</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
          
            <Text style={styles.buttonText}>Back</Text>
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

export default AddPlace;
