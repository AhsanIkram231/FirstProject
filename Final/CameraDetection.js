import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; // Import correct methods for v4.x

const CameraDetection = () => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [violations, setViolations] = useState(null);

  // Function to pick an image from the camera
  const handleCaptureImage = () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'back',
      includeBase64: false,
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to capture image.');
      } else if (response.assets) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  // Function to select an image from the gallery
  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to select image.');
      } else if (response.assets) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  // Function to upload the selected image to the server
  const handleUploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please capture or select an image.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await fetch(`${global.furl}upload-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setViolations(result.violations_and_plates);

        // Format the violations for display in the alert box
        const violationDetails = formatViolations(result.violations_and_plates);

        // Show the violations in an alert
        Alert.alert('Violations Detected', violationDetails);
      } else {
        Alert.alert('Error', result.message || 'Failed to upload image.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while uploading the image.');
    } finally {
      setUploading(false);
    }
  };

  // Function to format violation details into a string
  const formatViolations = (violations) => {
    let formattedViolations = '';
    
    if (violations) {
      // Iterate over the violation data and format it
      Object.entries(violations).forEach(([key, value]) => {
        // If the value is an object, we need to handle it accordingly
        if (typeof value === 'object' && value !== null) {
          // If it's an array or nested object, stringify it
          formattedViolations += `${key}: ${JSON.stringify(value)}\n`;
        } else {
          formattedViolations += `${key}: ${value}\n`;
        }
      });
    } else {
      formattedViolations = 'No violations detected.';
    }
    
    return formattedViolations;
  };

  // Function to handle form submission
  const handleSubmit = () => {
    handleUploadImage(); // Call the handleUploadImage function when the submit button is clicked
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Camera Detection</Text>
      </View>

      <View style={styles.body}>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}

        <TouchableOpacity style={styles.button} onPress={handleCaptureImage}>
          <Text style={styles.buttonText}>Capture Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
          <Text style={styles.buttonText}>Select Image from Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={uploading}>
          <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Submit'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
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
  },
  body: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#2AB9A8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#2AB9A8',
    borderRadius: 10,
  },
});

export default CameraDetection;
