import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useIsFocused } from '@react-navigation/native';


const ManageStolenBike = () => {
  const navigation = useNavigation();
  const [bikes, setBikes] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [searchPlate, setSearchPlate] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const isFocused = useIsFocused();


useEffect(() => {
  if (isFocused) {
    fetchBikes();
  }
}, [isFocused]);

  useEffect(() => {
    filterBikes();
  }, [searchPlate, searchCity, searchStatus, bikes]);

  const fetchBikes = async () => {
    try {
      const response = await fetch(`${global.furl}stolenbike`);
      const data = await response.json();
      if (response.ok) {
        setBikes(data);
      } else {
        Alert.alert('Error', 'Failed to fetch stolen bikes');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching stolen bikes');
    }
  };

  const filterBikes = () => {
    const filtered = bikes.filter((bike) => {
      const matchesPlate = bike.NumberPlate.toLowerCase().includes(searchPlate.toLowerCase());
      const matchesCity = bike.City?.toLowerCase().includes(searchCity.toLowerCase());
      const matchesStatus = searchStatus === '' || bike.Status === searchStatus;
      return matchesPlate && matchesCity && matchesStatus;
    });
    setFilteredBikes(filtered);
  };

  const handleDelete = (plate) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete bike with plate "${plate}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const res = await fetch(
                `${global.furl}deletestolenbikebyplate?NumberPlate=${plate}`,
                { method: 'DELETE' }
              );
              const result = await res.json();
              if (res.ok) {
                Alert.alert('Success', result.Successfully || 'Deleted');
                fetchBikes();
              } else {
                Alert.alert('Error', result.error || 'Failed to delete');
              }
            } catch (err) {
              Alert.alert('Error', 'Network error');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const toggleStatus = async (plate, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Recovered' : 'Active';
    try {
      const res = await fetch(`${global.furl}changestolenbikestatus`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ NumberPlate: plate, new_status: newStatus }),
      });
      const result = await res.json();
      if (res.ok) {
        Alert.alert('Success', result.message);
        fetchBikes();
      } else {
        Alert.alert('Error', result.error || 'Failed to change status');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Stolen Bikes</Text>
        <Text style={styles.headerSubtitle}>Add, Edit or Remove Stolen Bikes</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddStolenBike')}
        >
          <Text style={styles.buttonText}>Add Stolen Bike</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Search by Plate"
          value={searchPlate}
          onChangeText={setSearchPlate}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Search by City"
          value={searchCity}
          onChangeText={setSearchCity}
        />
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={searchStatus}
          style={styles.picker}
          onValueChange={(value) => setSearchStatus(value)}
        >
          <Picker.Item label="All Statuses" value="" />
          <Picker.Item label="Active" value="Active" />
          <Picker.Item label="Recovered" value="Recovered" />
        </Picker>
      </View>

      <Text style={styles.cityListHeading}>All Reported Bikes:</Text>

      <ScrollView contentContainerStyle={styles.cityList}>
        {filteredBikes.length === 0 ? (
          <Text style={{ color: '#777' }}>No matching stolen bikes found.</Text>
        ) : (
          filteredBikes.map((bike) => (
            <View key={bike.id} style={styles.cityItem}>
              <Text style={styles.cityName}>Plate: {bike.NumberPlate}</Text>
              <Text>Owner: {bike.OwnerName || 'N/A'}</Text>
              <Text>City: {bike.City || 'N/A'}</Text>
              <Text>Status: {bike.Status}</Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    navigation.navigate('EditStolenBike', { bike })
                  }
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() =>
                    toggleStatus(bike.NumberPlate, bike.Status)
                  }
                >
                  <Text style={styles.actionText}>
                    Set {bike.Status === 'Active' ? 'Recovered' : 'Active'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(bike.NumberPlate)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
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
  buttonContainer: { padding: 20 },
  button: {
    backgroundColor: '#2AB9A8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    gap: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  cityListHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 5,
  },
  cityList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cityItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#DDD',
    borderWidth: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#1976D2',
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#FBC02D',
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#E53935',
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#CCC',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManageStolenBike;
