// // React Native Code
// import React, { useState } from 'react';
// import { View, Button, Image, Text, StyleSheet } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';

// const Camera = () => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [result, setResult] = useState('');

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setSelectedImage(result.assets[0].uri);
//     }
//   };

//   const takePhoto = async () => {
//     let result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setSelectedImage(result.assets[0].uri);
//     }
//   };

//   const processImage = async () => {
//     if (!selectedImage) return;

//     const formData = new FormData();
//     formData.append('image', {
//       uri: selectedImage,
//       name: 'image.jpg',
//       type: 'image/jpeg',
//     });

//     try {
//       const response = await axios.post('http://<FLASK_SERVER_URL>/process-image', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setResult(response.data.result);
//     } catch (error) {
//       console.error(error);
//       setResult('Error processing the image');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Pick an Image" onPress={pickImage} />
//       <Button title="Take a Photo" onPress={takePhoto} />
//       {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
//       <Button title="Process Image" onPress={processImage} />
//       {result && <Text style={styles.result}>{result}</Text>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: 200,
//     height: 200,
//     marginVertical: 20,
//   },
//   result: {
//     marginTop: 20,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });
// export default Camera;