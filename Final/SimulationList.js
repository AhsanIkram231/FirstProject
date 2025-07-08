import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const SimulationList = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (isFocused) {
      setSubmissions([...global.simulations]); // ✅ refresh from global
    }
  }, [isFocused]);

  const handleSubmitAll = async () => {
  if (global.simulations.length === 0) {
    Alert.alert('No Submissions', 'There is nothing to submit.');
    return;
  }

  global.simulations.forEach(async (submission) => {
    const formData = new FormData();

    // Front image
    formData.append('images', {
      uri: submission.frontImageUri,
      name: `image_${submission.frontCamera.id}.jpg`,
      type: 'image/jpeg',
    });

    // Side image
    formData.append('images', {
      uri: submission.sideImageUri,
      name: `image_${submission.sideCamera.id}.jpg`,
      type: 'image/jpeg',
    });

    // Image indices
    const indices = [submission.frontCamera.id, submission.sideCamera.id];
    formData.append('image_indices', indices.join(','));

    try {
      const response = await fetch(`${global.furl}upload-multicameraimages`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        console.warn(`Error submitting simulation ${submission.id}: ${result.message}`);
      }
    } catch (error) {
      console.error(`Exception for submission ${submission.id}:`, error);
    }
  });

  // Clear global list immediately (don’t wait for requests)
  global.simulations = [];
  setSubmissions([]); // update UI

  Alert.alert('Submitted', 'All simulations are being submitted.');
};


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('AdminDashboard')} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Simulation List</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {submissions.length === 0 ? (
          <Text style={styles.noDataText}>No submissions yet.</Text>
        ) : (
          submissions.map((sub, index) => (
            <View key={sub.id} style={styles.submissionCard}>
              <Text style={styles.submissionTitle}>Submission #{index + 1}</Text>
              <Text>Front Camera ID: {sub.frontCamera?.id}</Text>
              <Text>Side Camera ID: {sub.sideCamera?.id}</Text>
              <Image source={{ uri: sub.frontImageUri }} style={styles.previewImage} />
              <Image source={{ uri: sub.sideImageUri }} style={styles.previewImage} />
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('SimulationListUpload')}
      >
        <Text style={styles.addButtonText}>+ Add Simulation</Text>
      </TouchableOpacity>
      <TouchableOpacity
  style={[styles.addButton, { backgroundColor: '#f57c00', bottom: 80 }]}
  onPress={handleSubmitAll}
>
  <Text style={styles.addButtonText}>Submit All</Text>
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2AB9A8',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: { marginRight: 10 },
  backArrow: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  scrollContent: { padding: 15, paddingBottom: 100 },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 30,
  },
  submissionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  submissionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: 'cover',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2AB9A8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SimulationList;
