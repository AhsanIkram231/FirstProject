import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddStolenBike = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    NumberPlate: '',
    OwnerName: '',
    ContactNumber: '',
    FIRNumber: '',
    FIRDate: '',
    City: '',
    Place: '',
    Status: 'Active',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const submitForm = async () => {
    if (!form.NumberPlate) {
      Alert.alert('Validation', 'Number Plate is required.');
      return;
    }

    try {
      const res = await fetch(`${global.furl}addstolenbike`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', data.Successfully, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', data.error || 'Failed to add stolen bike.');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Stolen Bike</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Number Plate *"
          value={form.NumberPlate}
          onChangeText={text => onChange('NumberPlate', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Owner Name"
          value={form.OwnerName}
          onChangeText={text => onChange('OwnerName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          keyboardType="phone-pad"
          value={form.ContactNumber}
          onChangeText={text => onChange('ContactNumber', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="FIR Number"
          value={form.FIRNumber}
          onChangeText={text => onChange('FIRNumber', text)}
        />

        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerText}>
            {form.FIRDate ? `FIR Date: ${form.FIRDate}` : 'Select FIR Date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(e, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const dateStr = selectedDate.toISOString().split('T')[0];
                onChange('FIRDate', dateStr);
              }
            }}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="City"
          value={form.City}
          onChangeText={text => onChange('City', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Place"
          value={form.Place}
          onChangeText={text => onChange('Place', text)}
        />

        <TouchableOpacity style={styles.submitButton} onPress={submitForm}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2AB9A8',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: { marginRight: 10 },
  backArrow: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  content: { padding: 15 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  datePickerButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
  },
  datePickerText: { color: '#555' },
  submitButton: {
    backgroundColor: '#2AB9A8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default AddStolenBike;
