import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';

const AddContact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const selectImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = async () => {
    if (!name || !email || !phone1 || !city || !gender || !imageUri) {
      alert('Please fill all fields and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('Contacts', JSON.stringify({ name, email, phone1, phone2, city, gender }));
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg', // Change this if you're allowing other formats
      name: `${email}.jpg`
    });

    try {
      const response = await axios.post('http://your-api-url/api/contact/addcontact', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Contact added successfully');
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Failed to add contact');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Phone 1" style={styles.input} value={phone1} onChangeText={setPhone1} />
      <TextInput placeholder="Phone 2" style={styles.input} value={phone2} onChangeText={setPhone2} />
      <TextInput placeholder="City" style={styles.input} value={city} onChangeText={setCity} />
      <TextInput placeholder="Gender" style={styles.input} value={gender} onChangeText={setGender} />
      <Button title="Select Image" onPress={selectImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default AddContact


