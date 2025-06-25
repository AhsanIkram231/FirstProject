import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const ManageCity = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();  // 👈 Add this
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    if (isFocused) {
      fetchShifts();  // 👈 Refetch when screen is focused
    }
  }, [isFocused]);

  const fetchShifts = async () => {
    try {
      const response = await fetch(`${global.furl}shift`);
      const data = await response.json();
      if (response.ok) {
        setShifts(data);
      } else {
        Alert.alert('Error', 'Failed to fetch shifts');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching shifts');
    }
  };

  const confirmDelete = (shiftName) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${shiftName}" shift?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => deleteShift(shiftName),
          style: 'destructive',
        },
      ]
    );
  };

  const deleteShift = async (shiftName) => {
    try {
      const response = await fetch(`${global.furl}deleteshift`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shiftname: shiftName,
          starttime: "00:00:00",  // Optional placeholders
          endtime: "23:59:59",
        }),
      });

      const data = await response.json();
      if (response.ok || response.status === 201) {
        Alert.alert('Success', `${shiftName} deleted successfully`);
        fetchShifts(); // Refresh list
      } else {
        Alert.alert('Error', data.error || 'Failed to delete shift');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting shift');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Shift</Text>
        <Text style={styles.headerSubtitle}>View and Update Shift</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddShift')}
        >
          <Text style={styles.buttonText}>Add Or Update Shift</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.shiftListHeading}>All Shifts:</Text>

      <ScrollView contentContainerStyle={styles.shiftList}>
        {shifts.map((shift) => (
          <View key={shift.id} style={styles.shiftItem}>
            <Text style={styles.shiftName}>{shift.name}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmDelete(shift.name)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
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
  buttonContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#2AB9A8',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shiftListHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  shiftList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  shiftItem: {
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
  shiftName: {
    fontSize: 16,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#E53935',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteText: {
    color: '#FFF',
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

export default ManageCity;
