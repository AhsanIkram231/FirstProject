import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

const Hassan1 = () => {
  const navigation = useNavigation();
  const userName = "Hassan";
  const [imagePaths, setImagePaths] = useState([]); // Store fetched image paths
  const [showHistory, setShowHistory] = useState(false); // Toggle view history

  // Function to pick an image
  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    try {
      const response = await launchImageLibrary(options);
      if (!response.didCancel && !response.errorCode) {
        const imagePath = response.assets[0].uri;
        console.log("Image selected:", imagePath);

        // Send image path to Flask API
        const apiResponse = await fetch('http://192.168.145.34:4321/save-image-path', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imagePath }),
        });

        if (apiResponse.ok) {
          Alert.alert('Success', 'Image path saved successfully!');
        } else {
          console.error('Error saving image path:', apiResponse.status);
          Alert.alert('Error', 'Failed to save image path.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while selecting the image.');
    }
  };

  // Function to fetch saved image paths
  const fetchImagePaths = async () => {
    try {
      const response = await fetch('http://192.168.145.34:4321/get-image-paths');
      const data = await response.json();

      if (response.ok) {
        setImagePaths(data.images);
        setShowHistory(true); // Show the history section
      } else {
        console.error("Error fetching image paths:", data.error);
        Alert.alert("Error", "Failed to fetch image history.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Error", "An error occurred while fetching image history.");
    }
  };

  // Function to delete an image path
  const deleteImagePath = async (id) => {
    try {
      const response = await fetch(`http://192.168.145.34:4321/delete-image-path/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert("Deleted", "Image path deleted successfully.");
        setImagePaths(imagePaths.filter((item) => item.id !== id)); // Remove from state
      } else {
        console.error("Error deleting image path:", response.status);
        Alert.alert("Error", "Failed to delete image path.");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      Alert.alert("Error", "An error occurred while deleting the image.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={require('../../assets/images/hassan.png')} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Welcome, {userName}</Text>
        <Text style={styles.description}>Choose the type of file you have below:</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>IMAGE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>VIDEO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={fetchImagePaths}>
          <Text style={styles.buttonText}>VIEW HISTORY</Text>
        </TouchableOpacity>
      </View>

      {/* Image History (Shown when user clicks "View History") */}
      {showHistory && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Image History</Text>
          <FlatList
            data={imagePaths}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <Image source={{ uri: item.path }} style={styles.historyImage} />
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImagePath(item.id)}>
                  <Text style={styles.deleteButtonText}>DELETE</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8FBF8',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#50C9C3',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 5,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#50C9C3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Hassan1;
