import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, RadioButton, Checkbox, Button } from 'react-native-paper';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male'); 
  const [isMarried, setIsMarried] = useState(false);
  const [userCount, setUserCount] = useState(0); 

  const handleSubmit = () => {
    
    setUserCount(prevCount => prevCount + 1);

    
    console.log('User Information:', { name, email, age, gender, isMarried });
    
    
    setEmail('');
    setAge('');
    setGender('male');
    setIsMarried(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SignUpScreen</Text>
      
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        
      />
      
      <TextInput
        label="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />
      
      <Text style={styles.label}>Gender</Text>
      <RadioButton.Group onValueChange={setGender} value={gender}>
        <View style={styles.radioButtonContainer}>
          <RadioButton value="male" />
          <Text>Male</Text>
          <RadioButton value="female" />
          <Text>Female</Text>
        </View>
      </RadioButton.Group>
      
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={isMarried ? 'checked' : 'unchecked'}
          onPress={() => setIsMarried(!isMarried)}
        />
        <Text>Married</Text>
      </View>
      
      <Button mode="contained" rippleColor={"white"} onPress={handleSubmit} style={styles.button}>
        Submit
      </Button>
      
      <Text style={styles.counter}>Total Submissions: {userCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  button: {
    
    marginTop: 20,
  },
  counter: {
    marginTop: 30,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Signup;
