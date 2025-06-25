import React, { useEffect, useState } from "react";
import {
  View, Text, TouchableOpacity, Alert,
  StyleSheet, ScrollView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const CameraNaka = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { chowkiName, selectedCameras } = route.params;

  const [cameraData, setCameraData] = useState([]); // [{directionName, cameras: [{id, name, selected}], placeName}]

  useEffect(() => {
    const fetchCamerasForAllDirections = async () => {
      const results = [];

      for (const direction of selectedCameras) {
        try {
          const response = await fetch(`${global.furl}camera`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              placename: direction.place_name,
              directionname: direction.name
            })
          });

          const data = await response.json();
          if (Array.isArray(data)) {
            results.push({
              directionName: direction.name,
              placeName: direction.place_name,
              cameras: data.map(cam => ({ ...cam, selected: true }))  // default selected
            });
          } else {
            results.push({
              directionName: direction.name,
              placeName: direction.place_name,
              cameras: []
            });
          }
        } catch (err) {
          console.error("Error fetching cameras:", err);
        }
      }

      setCameraData(results);
    };

    if (selectedCameras && selectedCameras.length > 0) {
      fetchCamerasForAllDirections();
    }
  }, [selectedCameras]);

  const toggleCameraSelection = (directionIndex, cameraIndex) => {
    setCameraData(prev => {
      const updated = [...prev];
      updated[directionIndex].cameras[cameraIndex].selected =
        !updated[directionIndex].cameras[cameraIndex].selected;
      return updated;
    });
  };

  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Camera Naka</Text>
        <Text style={styles.headerSubtitle}>Selected cameras for: {chowkiName}</Text>
      </View>

      <View style={styles.form}>
        {cameraData.map((direction, dIndex) => (
          <View key={dIndex} style={styles.directionBlock}>
            <Text style={styles.directionTitle}>
              📍 {direction.placeName} → {direction.directionName}
            </Text>

            {direction.cameras.length > 0 ? (
              direction.cameras.map((camera, cIndex) => (
                <TouchableOpacity
                  key={camera.id}
                  style={styles.cameraItem}
                  onPress={() => toggleCameraSelection(dIndex, cIndex)}
                >
                  <View style={[styles.checkbox, camera.selected && styles.checked]}>
                    {camera.selected && <Text style={styles.checkmark}>✔</Text>}
                  </View>
                  <Text style={styles.cameraText}>
                    {camera.name} ({camera.Type})
                  </Text>

                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noDataText}>No cameras found for this direction</Text>
            )}
          </View>
        ))}

        

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F0F0" },
  header: {
    backgroundColor: "#2AB9A8",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#FFF" },
  headerSubtitle: { fontSize: 14, color: "#FFF", marginTop: 5 },
  form: { padding: 20 },
  directionBlock: { marginBottom: 20 },
  directionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  cameraItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  cameraText: { marginLeft: 10, fontSize: 14 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center"
  },
  checked: {
    backgroundColor: "#008080",
    borderColor: "#008080"
  },
  checkmark: {
    color: "white",
    fontWeight: "bold"
  },
  noDataText: {
    fontStyle: "italic",
    color: "gray"
  },
  saveButton: {
    backgroundColor: "#008080",
    padding: 12,
    borderRadius: 5,
    marginTop: 10
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },
  backButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 5,
    marginTop: 5
  },
  backButtonText: {
    textAlign: "center",
    color: "black"
  }
});

export default CameraNaka;
