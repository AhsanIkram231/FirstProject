import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from '@react-navigation/native';

const AddNaka = () => {
  const navigation = useNavigation();
  const [nakaName, setNakaName] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [directions, setDirections] = useState([]);
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [chowkiId, setChowkiId] = useState(null); // for Link button

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${global.furl}city`);
        const data = await response.json();
        if (Array.isArray(data)) setCities(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchCities();
  }, []);

  const fetchPlaces = async (cityName) => {
    try {
      const response = await fetch(`${global.furl}place?name=${encodeURIComponent(cityName)}`);
      const data = await response.json();
      if (Array.isArray(data)) setPlaces(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchDirections = async (placeName) => {
    try {
      const response = await fetch(`${global.furl}directions?name=${encodeURIComponent(placeName)}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setDirections(data);
        setSelectedCameras(new Array(data.length).fill(true));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleCamera = (index) => {
    setSelectedCameras((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleNavigateToCameraNaka = (directionName) => {
    const selectedCameraData = directions
      .map((direction, index) => ({
        id: direction.id,
        name: direction.name,
        place_name: selectedPlace,
        selected: selectedCameras[index]
      }))
      .filter(cam => cam.selected);

    navigation.navigate("CameraNaka", {
      chowkiName: nakaName,
      selectedCameras: selectedCameraData
    });
  };

  const handleSaveNaka = async () => {
    if (!nakaName || !selectedPlace) {
      alert("Please enter Naka Name and select Place.");
      return;
    }

    try {
      const addResponse = await fetch(`${global.furl}addchowki`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nakaName,
          placename: selectedPlace
        })
      });

      const addResult = await addResponse.json();
      if (addResult.error) {
        alert("Error adding Chowki: " + addResult.error);
        return;
      }

      if (addResult.id) {
        setChowkiId(addResult.id); // store chowki ID for linking
      }

      const selectedCameraData = directions
        .map((direction, index) => ({
          id: direction.id,
          name: direction.name,
          place_name: selectedPlace,
          selected: selectedCameras[index]
        }))
        .filter(d => d.selected);

      const camerasToLink = [];

      for (const direction of selectedCameraData) {
        const camRes = await fetch(`${global.furl}camera`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            placename: direction.place_name,
            directionname: direction.name
          })
        });
        const camData = await camRes.json();
        if (Array.isArray(camData)) {
          camerasToLink.push(...camData.map(c => ({ id: c.id })));
        }
      }

      if (camerasToLink.length === 0) {
        alert("No cameras found for the selected directions.");
        return;
      }

      const linkRes = await fetch(`${global.furl}linkcamerachowki`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chowkiname: nakaName,
          cameraname: camerasToLink
        })
      });

      const linkResult = await linkRes.json();
      if (linkResult.error) {
        alert("Error linking cameras: " + linkResult.error);
        return;
      }

      alert("Naka and Cameras successfully added.");
    } catch (err) {
      console.error("Save Error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Naka</Text>
        <Text style={styles.headerSubtitle}>Set up and manage a new traffic control post location</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter Naka Name"
          value={nakaName}
          onChangeText={setNakaName}
        />

        <Picker
          selectedValue={selectedCity}
          style={styles.input}
          onValueChange={(itemValue) => {
            setSelectedCity(itemValue);
            setPlaces([]);
            setSelectedPlace('');
            setDirections([]);
            fetchPlaces(itemValue);
          }}
        >
          <Picker.Item label="Select City" value="" />
          {cities.map((city, index) => (
            <Picker.Item key={index} label={city.name} value={city.name} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedPlace}
          style={styles.input}
          onValueChange={(itemValue) => {
            setSelectedPlace(itemValue);
            fetchDirections(itemValue);
          }}
          enabled={places.length > 0}
        >
          <Picker.Item label="Select Place" value="" />
          {places.map((place, index) => (
            <Picker.Item key={index} label={place.name} value={place.name} />
          ))}
        </Picker>

        <View style={styles.cameraContainer}>
          <Text style={styles.cameraTitle}>Camera Locations:</Text>
          {directions.length > 0 ? (
            directions.map((direction, index) => (
              <View key={index} style={styles.cameraItem}>
                <TouchableOpacity
                  onPress={() => toggleCamera(index)}
                  style={[styles.checkbox, selectedCameras[index] && styles.checked]}
                >
                  {selectedCameras[index] && <Text style={styles.checkmark}>✔</Text>}
                </TouchableOpacity>

                <Text style={styles.cameraText}>{direction.name}</Text>

                <TouchableOpacity
                  style={styles.navigateButton}
                  onPress={() => handleNavigateToCameraNaka(direction.name)}
                >
                  <Text style={styles.navigateText}>📷</Text>
                </TouchableOpacity>

                {chowkiId && (
                  <TouchableOpacity
                    style={[styles.navigateButton, { marginLeft: 5, backgroundColor: '#ccc' }]}
                    onPress={() =>
                      navigation.navigate('LinkNakaWithNaka', {
                        chowkiId: chowkiId,
                        chowkiName: nakaName,
                        placeName: selectedPlace,
                        cityName: selectedCity,
                      })
                    }
                  >
                    <Text style={[styles.navigateText, { fontSize: 12 }]}>🔗 Link</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No cameras available</Text>
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveNaka}>
          <Text style={styles.buttonText}>Save Naka</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F0' },
  header: { backgroundColor: '#2AB9A8', padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  headerSubtitle: { fontSize: 14, color: '#FFF', marginTop: 5 },
  form: { padding: 20 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    borderColor: '#CCC',
    borderWidth: 1
  },
  cameraContainer: { marginTop: 10, backgroundColor: "#f0f0f0", padding: 10, borderRadius: 5 },
  cameraTitle: { fontWeight: "bold", fontSize: 16 },
  cameraItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5 },
  cameraText: { fontSize: 14, flex: 1, marginLeft: 10 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: "gray", justifyContent: "center", alignItems: "center", borderRadius: 3 },
  checked: { backgroundColor: "#008080", borderColor: "#008080" },
  checkmark: { color: "white", fontSize: 14, fontWeight: "bold" },
  navigateButton: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "#ddd", borderRadius: 5 },
  navigateText: { fontSize: 16, color: "#333", fontWeight: "bold" },
  noDataText: { color: "gray", fontStyle: "italic", marginTop: 5 },
  saveButton: { backgroundColor: "#008080", padding: 12, borderRadius: 5, marginTop: 10 },
  buttonText: { textAlign: "center", color: "white", fontWeight: "bold" },
  backButton: { backgroundColor: "#ddd", padding: 12, borderRadius: 5, marginTop: 5 },
  backButtonText: { textAlign: "center", color: "black" },
});

export default AddNaka;
