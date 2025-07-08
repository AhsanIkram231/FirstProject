import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditViolation = ({ route, navigation }) => {
  const { violationId } = route.params;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fine, setFine] = useState('');
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    fetch(`${global.furl}violationsbyid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ violation_id: violationId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          Alert.alert('Error', data.error);
        } else {
          setName(data.name);
          setDescription(data.description);
          setLimitEnabled(data.limitValue === 1);
          setFine(data.fines?.[0]?.fine?.toString() || '');
          if (data.start_date) setStartDate(new Date(data.start_date));
          if (data.end_date) setEndDate(new Date(data.end_date));
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch violation');
      });
  }, []);

  const handleUpdate = async () => {
    const payload = {
      violation_id: violationId,
      new_name: name,
      new_description: description,
      newlimitValue: limitEnabled ? 1 : null,
      newfine: fine,
      start_date: limitEnabled && startDate ? startDate.toISOString().split('T')[0] : null,
      end_date: limitEnabled && endDate ? endDate.toISOString().split('T')[0] : null,
    };

    try {
      const response = await fetch(`${global.furl}updateviolation`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
        navigation.goBack();
      } else {
        Alert.alert('Error', data.error || 'Update failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network or server issue');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
    <Text style={styles.backButtonText}>← Back</Text>
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Edit Violation</Text>
  <Text style={styles.headerSubtitle}>Update violation details and fine values</Text>
</View>


      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Violation Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Violation Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.textInput}
            placeholder="e.g., OverRiding"
          />
        </View>

        {/* Fine */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fine</Text>
          <TextInput
            value={fine}
            onChangeText={setFine}
            keyboardType="numeric"
            style={styles.textInput}
            placeholder="e.g., 500"
          />
        </View>

        {/* Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={[styles.textInput, { height: 80 }]}
            placeholder="Enter description"
          />
        </View>

        {/* Toggle Limit */}
        {/* <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Current sitting limit is 1. Turn OFF to allow 2 persons.
          </Text>
          <Switch value={limitEnabled} onValueChange={setLimitEnabled} />
        </View> */}

        {/* Date Pickers (Only if limit enabled) */}
        {limitEnabled && (
          <>
            <View style={styles.datePickerContainer}>
              <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateButton}>
                <Text style={styles.dateText}>
                  {startDate ? startDate.toDateString() : 'Tap to select Date & Time'}
                </Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowStartPicker(false);
                    if (date) setStartDate(date);
                  }}
                />
              )}
            </View>

            <View style={styles.datePickerContainer}>
              <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateButton}>
                <Text style={styles.dateText}>
                  {endDate ? endDate.toDateString() : 'Tap to select Date & Time'}
                </Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowEndPicker(false);
                    if (date) setEndDate(date);
                  }}
                />
              )}
            </View>
          </>
        )}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
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
  
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  headerSubtitle: { fontSize: 14, color: '#FFF', marginTop: 5 },
  formContainer: { padding: 20 },
  inputContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
  },
  label: { fontSize: 16, color: '#555', marginBottom: 5 },
  textInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  saveButton: {
    backgroundColor: '#2AB9A8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  datePickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#F9F9F9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  
});

export default EditViolation;
