import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Checkbox, RadioButton, TextInput } from 'react-native-paper';

const Task3p = () => {
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [job, setJob] = useState('');
  const [expectedSalary, setExpectedSalary] = useState(null);

  const handleSalaryCalculation = () => {
    let baseSalary = 0;
    let bonus = 0;

    if (job === 'junior') {
      baseSalary = 50000;
      if (maritalStatus === 'married') {
        bonus = baseSalary * 0.1;
      }
    } else if (job === 'senior') {
      baseSalary = 100000;
      if (maritalStatus === 'married') {
        bonus = baseSalary * 0.15;
      }
    }

    const totalSalary = baseSalary + bonus;
    setExpectedSalary(totalSalary);
  };

  return (
    <View style={styles.background}>
      <Text style={styles.header}>Employee Form</Text>

      <TextInput
        label="Enter Your Name"
        style={styles.input}
      />

      <TextInput
        placeholder='Enter Phone Number'
        keyboardType='numeric'
        style={styles.input}
      />

      <Text style={styles.label}>Select Job</Text>
      <View style={styles.checkboxcontent}>
        <View style={styles.checkboxitem}>
          <Checkbox
            status={job === 'junior' ? 'checked' : 'unchecked'}
            onPress={() => setJob('junior')}
          />
          <Text>Junior Lecturer</Text>
        </View>

        <View style={styles.checkboxitem}>
          <Checkbox
            status={job === 'senior' ? 'checked' : 'unchecked'}
            onPress={() => setJob('senior')}
          />
          <Text>Senior Lecturer</Text>
        </View>
      </View>

      <Text style={styles.label}>Choose Gender</Text>
      <RadioButton.Group onValueChange={newValue => setGender(newValue)} value={gender}>
        <View style={styles.radioButtonContainer}>
          <View style={styles.radioButtonItem}>
            <RadioButton value="male" />
            <Text style={styles.radioLabel}>Male</Text>
          </View>
          <View style={styles.radioButtonItem}>
            <RadioButton value="female" />
            <Text style={styles.radioLabel}>Female</Text>
          </View>
        </View>
      </RadioButton.Group>

      <Text style={styles.label}>Marital Status</Text>
      <RadioButton.Group onValueChange={newValue => setMaritalStatus(newValue)} value={maritalStatus}>
        <View style={styles.radioButtonContainer}>
          <View style={styles.radioButtonItem}>
            <RadioButton value="married" />
            <Text style={styles.radioLabel}>Married</Text>
          </View>
          <View style={styles.radioButtonItem}>
            <RadioButton value="unmarried" />
            <Text style={styles.radioLabel}>Unmarried</Text>
          </View>
        </View>
      </RadioButton.Group>

      <Button
        mode="contained"
        buttonColor="#6200ee"
        onPress={handleSalaryCalculation}
        style={styles.button}
      >
        Calculate Expected Salary
      </Button>

      {expectedSalary !== null && (
        <Text style={styles.salaryText}>
          Your expected salary is: {expectedSalary}
        </Text>
      )}
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
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  checkboxitem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  checkboxcontent: {
    flexDirection: 'row',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: 16,
    marginRight: 20,
  },
  radioButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 15,
    paddingVertical: 5,
  },
  salaryText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
  },
});

export default Task3p;