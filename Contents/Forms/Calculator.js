import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const Calculator = () => {
  const [inputValue, setInputValue] = useState('');

  const handleButtonPress = (value) => {
    // Update the input value based on the button pressed
    if (value == 'C') {
      setInputValue(''); // Clear the input
    } else if (value == '=') {
      try {
        setInputValue(eval(inputValue).toString()); // Evaluate the expression
      } catch (error) {
        setInputValue('Error');
      }
    } else {
      setInputValue(inputValue + value); // Append the value to the input
    }
  };

  const renderButton = (title) => (
    <TouchableOpacity style={styles.roundButton} onPress={() => handleButtonPress(title)}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.background}>
      <Text style={styles.headingText}>Calculator</Text>
      <View style={styles.viewInput}>
        <TextInput
          style={styles.txtInput}
          placeholder="0"
          placeholderTextColor="#7f8c8d"
          value={inputValue}
          editable={false} // Make TextInput read-only
        />
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          {renderButton('1')}
          {renderButton('2')}
          {renderButton('3')}
          {renderButton('+')}
        </View>
        <View style={styles.buttonRow}>
          {renderButton('4')}
          {renderButton('5')}
          {renderButton('6')}
          {renderButton('-')}
        </View>
        <View style={styles.buttonRow}>
          {renderButton('7')}
          {renderButton('8')}
          {renderButton('9')}
          {renderButton('*')}
        </View>
        <View style={styles.buttonRow}>
          {renderButton('0')}
          {renderButton('C')}
          {renderButton('=')}
          {renderButton('/')}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFFF',
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  headingText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  viewInput: {
    
    width: '80%',
    
  },
  txtInput: {
    backgroundColor: '#dcdde1',
    padding: 10,
    borderRadius: 50,
    marginBottom: 20,
    fontSize: 18,
    color: '#000000',
    textAlign: 'right',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  roundButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Calculator;
