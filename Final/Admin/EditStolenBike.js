import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const EditStolenBike = ({ route, navigation }) => {
  const { bike } = route.params;

  const [numberPlate, setNumberPlate] = useState(bike.NumberPlate);
  const [ownerName, setOwnerName] = useState(bike.OwnerName || '');
  const [contactNumber, setContactNumber] = useState(bike.ContactNumber || '');
  const [firNumber, setFirNumber] = useState(bike.FIRNumber || '');
  const [firDate, setFirDate] = useState(bike.FIRDate || '');
  const [city, setCity] = useState(bike.City || '');
  const [place, setPlace] = useState(bike.Place || '');
  const [status, setStatus] = useState(bike.Status || 'Active');

  const handleSubmit = async () => {
    if (!numberPlate) {
      Alert.alert('Validation Error', 'Number Plate is required.');
      return;
    }

    try {
      const response = await fetch(`${global.furl}updatestolenbike`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          NumberPlate: numberPlate,
          OwnerName: ownerName,
          ContactNumber: contactNumber,
          FIRNumber: firNumber,
          FIRDate: firDate,
          City: city,
          Place: place,
          Status: status,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.Successfully || 'Updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.error || 'Failed to update');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Stolen Bike</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Number Plate"
          value={numberPlate}
          editable={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Owner Name"
          value={ownerName}
          onChangeText={setOwnerName}
        />

        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="FIR Number"
          value={firNumber}
          onChangeText={setFirNumber}
        />

        <TextInput
          style={styles.input}
          placeholder="FIR Date (YYYY-MM-DD)"
          value={firDate}
          onChangeText={setFirDate}
        />

        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />

        <TextInput
          style={styles.input}
          placeholder="Place"
          value={place}
          onChangeText={setPlace}
        />

        {/* Status Dropdown */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Active" value="Active" />
            <Picker.Item label="Recovered" value="Recovered" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
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
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#DDD',
    borderWidth: 1,
  },
  pickerWrapper: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderColor: '#DDD',
    borderWidth: 1,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#2AB9A8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#CCC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditStolenBike;
