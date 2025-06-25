import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';

const Task2 = () => {
  const [firstNumber, setFirstNumber] = useState('');
  const [secondNumber, setSecondNumber] = useState('');

  
  const handleAddition = () => {
    const result = parseFloat(firstNumber) + parseFloat(secondNumber);
    Alert.alert('Result', `Sum: ${result}`);
  };

  
  const handleSubtraction = () => {
    const result = parseFloat(firstNumber) - parseFloat(secondNumber);
    Alert.alert('Result', `Difference: ${result}`);
  };

  
  const handleMultiplication = () => {
    const result = parseFloat(firstNumber) * parseFloat(secondNumber);
    Alert.alert('Result', `Product: ${result}`);
  };

  
  const handleDivision = () => {
    if (parseFloat(secondNumber) === 0) {
      Alert.alert('Error', 'Cannot divide by zero');
    } else {
      const result = parseFloat(firstNumber) / parseFloat(secondNumber);
      Alert.alert('Result', `Quotient: ${result}`);
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.viewInput}>
        <TextInput
          style={styles.txtInput}
          placeholder="Enter 1st Number"
          placeholderTextColor="#7f8c8d"
          keyboardType="numeric"
          value={firstNumber}
          onChangeText={setFirstNumber}
        />
        <TextInput
          style={styles.txtInput}
          placeholder="Enter 2nd Number"
          placeholderTextColor="#7f8c8d"
          keyboardType="numeric"
          value={secondNumber}
          onChangeText={setSecondNumber}
        />
      </View>

      <View style={styles.buttonRow}>
        <Button title="Add" onPress={handleAddition} />
        <Button title="Subtract" onPress={handleSubtraction} />
      </View>
      <View style={styles.buttonRow}>
        <Button title="Multiply" onPress={handleMultiplication} />
        <Button title="Divide" onPress={handleDivision} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFFF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  viewInput: {
    width: '80%',
  },
  txtInput: {
    backgroundColor: '#dcdde1',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
    color: '#000000',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 15,
  },
});

export default Task2;
