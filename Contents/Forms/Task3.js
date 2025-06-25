import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Checkbox, RadioButton, Button } from 'react-native-paper';

const Task3 = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [isJuniorLecturer, setIsJuniorLecturer] = useState(false);
  const [isSeniorLecturer, setIsSeniorLecturer] = useState(false);
  const [isBS, setIsBS] = useState(false);
  const [isMS, setIsMS] = useState(false);
  const [gender, setGender] = useState(''); // State to store selected gender

  return (
    <View style={styles.background}>
      <Text style={styles.header}>Employee Form</Text>

      <TextInput
        label="Enter Your Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        label="Enter Mobile Number"
        value={number}
        onChangeText={setNumber}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Select Job</Text>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxItem}>
          <Checkbox
            status={isJuniorLecturer ? 'checked' : 'unchecked'}
            onPress={() => setIsJuniorLecturer(!isJuniorLecturer)}
          />
          <Text style={styles.checkboxLabel}>Junior Lecturer</Text>
        </View>
        <View style={styles.checkboxItem}>
          <Checkbox
            status={isSeniorLecturer ? 'checked' : 'unchecked'}
            onPress={() => setIsSeniorLecturer(!isSeniorLecturer)}
          />
          <Text style={styles.checkboxLabel}>Senior Lecturer</Text>
        </View>
      </View>

      <Text style={styles.label}>Select Qualification</Text>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxItem}>
          <Checkbox
            status={isBS ? 'checked' : 'unchecked'}
            onPress={() => setIsBS(!isBS)}
          />
          <Text style={styles.checkboxLabel}>BS</Text>
        </View>
        <View style={styles.checkboxItem}>
          <Checkbox
            status={isMS ? 'checked' : 'unchecked'}
            onPress={() => setIsMS(!isMS)}
          />
          <Text style={styles.checkboxLabel}>MS</Text>
        </View>
      </View>

      <Text style={styles.label}>Choose Gender</Text>
      <RadioButton.Group onValueChange={newValue => setGender(newValue)} value={gender}>
        <View style={styles.radioButtonContainer}>
          <RadioButton value="male" />
          <Text style={styles.radioLabel}>Male</Text>
          <RadioButton value="female" />
          <Text style={styles.radioLabel}>Female</Text>
        </View>
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={() =>
          console.log({
            name,
            number,
            job: {
              juniorLecturer: isJuniorLecturer,
              seniorLecturer: isSeniorLecturer,
            },
            qualification: {
              BS: isBS,
              MS: isMS,
            },
            gender,
          })
        }
      >
        Submit
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioLabel: {
    fontSize: 16,
    marginRight: 20,
  },
});

export default Task3;
