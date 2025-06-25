import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const DeleteTrafficWarden = () => {
  const navigation = useNavigation();
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [wardens, setWardens] = useState([]);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchWardensByCity(selectedCity);
    } else {
      fetchAllWardens();
    }
  }, [selectedCity]);

  const fetchCities = async () => {
    try {
      const response = await fetch(`${global.furl}city`);
      const data = await response.json();
      if (response.ok) {
        setCities(data);
      } else {
        Alert.alert('Error', 'Failed to fetch cities.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching cities.');
    }
  };

  const fetchAllWardens = async () => {
    try {
      const response = await fetch(`${global.furl}trafficwarden`);
      const data = await response.json();
      if (response.ok) {
        const filteredWardens = data.filter(
          (w) => Number(w.PermissionType) !== 0 && w.badge_number !== 'WR-0001'
        );
        setWardens(filteredWardens);
      } else {
        setWardens([]);
      }
    } catch (error) {
      setWardens([]);
    }
  };
  

  const fetchWardensByCity = async (cityName) => {
    try {
      const response = await fetch(`${global.furl}wardensincity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cityname: cityName }),
      });
      const data = await response.json();
      if (response.ok) {
        const filteredWardens = data.filter(
          (w) => Number(w.PermissionType) !== 0
        );
        setWardens(filteredWardens);
      } else {
        setWardens([]);
      }
    } catch (error) {
      setWardens([]);
    }
  };

  const handleDelete = async (badgeNumber) => {
    try {
      const response = await fetch(`${global.furl}deleteTrafficWarden`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badgeNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `Warden ${badgeNumber} deleted successfully.`);
        setWardens(wardens.filter((w) => w.badge_number !== badgeNumber));
      } else {
        Alert.alert('Error', data.error || 'Failed to delete traffic warden.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the traffic warden.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Delete Traffic Warden</Text>
      </View>

      <View style={styles.form}>
        <Picker
          selectedValue={selectedCity}
          onValueChange={(value) => setSelectedCity(value)}
          style={styles.input}
        >
          <Picker.Item label="All Cities" value="" />
          {cities.map((city) => (
            <Picker.Item key={city.id} label={city.name} value={city.name} />
          ))}
        </Picker>

        {wardens.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>
            No traffic warden found.
          </Text>
        ) : (
          <ScrollView style={{ marginTop: 10 }}>
            {wardens.map((warden) => (
              <View key={warden.badge_number} style={styles.wardenCard}>
                <View>
                  <Text style={styles.wardenText}>Name: {warden.name}</Text>
                  <Text style={styles.wardenText}>Badge #: {warden.badge_number}</Text>
                  <Text style={styles.wardenText}>City: {warden.city_Name}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(warden.badge_number)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
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
  },
  wardenCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#DDD',
    borderWidth: 1,
  },
  wardenText: {
    fontSize: 14,
    marginBottom: 2,
  },
  deleteButton: {
    backgroundColor: '#E53935',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
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

export default DeleteTrafficWarden;
