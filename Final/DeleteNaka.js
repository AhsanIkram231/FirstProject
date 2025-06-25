import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const DeleteNaka = () => {
  const navigation = useNavigation();
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [chowkis, setChowkis] = useState([]);
  const [chowkiData, setChowkiData] = useState([]);

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');

  useEffect(() => {
    fetch(`${global.furl}city`)
      .then(res => res.json())
      .then(setCities)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetch(`${global.furl}place?name=${selectedCity}`)
        .then(res => res.json())
        .then(setPlaces)
        .catch(console.error);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedPlace) {
      fetch(`${global.furl}chowki`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placename: selectedPlace }),
      })
        .then(res => res.json())
        .then(async (data) => {
          if (Array.isArray(data)) {
            setChowkis(data);
            await fetchCameraInfoForChowkis(data);
          } else {
            setChowkis([]);
            setChowkiData([]);
          }
        })
        .catch(() => {
          setChowkis([]);
          setChowkiData([]);
        });
    }
  }, [selectedPlace]);

  const fetchCameraInfoForChowkis = async (chowkis) => {
    const cameraData = [];

    for (const chowki of chowkis) {
      try {
        const response = await fetch(`${global.furl}linkcamerawithchowki`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chowkiname: chowki.name }),
        });

        const data = await response.json();
        if (Array.isArray(data)) {
          cameraData.push({ chowkiName: chowki.name, cameras: data });
        } else {
          cameraData.push({ chowkiName: chowki.name, cameras: [] });
        }
      } catch (error) {
        cameraData.push({ chowkiName: chowki.name, cameras: [] });
      }
    }

    setChowkiData(cameraData);
  };

  const handleDelete = (chowkiName) => {
  Alert.alert(
    'Confirm Delete',
    `Are you sure you want to delete Chowki '${chowkiName}'?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes, Delete',
        style: 'destructive',
        onPress: () => performDelete(chowkiName),
      },
    ]
  );
};
const performDelete = async (chowkiName) => {
  try {
    const cameraInfo = chowkiData.find(d => d.chowkiName === chowkiName);
    const linkedCameras = cameraInfo?.cameras.map(c => c.camera_name) || [];

    if (linkedCameras.length > 0) {
      await fetch(`${global.furl}unlinkcamerachowki`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chowkiname: chowkiName,
          cameraname: linkedCameras,
        }),
      });
    }

    await fetch(`${global.furl}deletechowki`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: chowkiName,
        placename: selectedPlace,
      }),
    });

    Alert.alert('Success', `Chowki '${chowkiName}' deleted successfully.`);
    setChowkis(prev => prev.filter(c => c.name !== chowkiName));
    setChowkiData(prev => prev.filter(c => c.chowkiName !== chowkiName));
  } catch (err) {
    Alert.alert('Error', err.message || 'Failed to delete chowki.');
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Delete Naka</Text>
        <Text style={styles.headerSubtitle}>Select City and Place to View Chowkis</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Picker
          selectedValue={selectedCity}
          onValueChange={(value) => {
            setSelectedCity(value);
            setSelectedPlace('');
            setChowkis([]);
            setChowkiData([]);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Select a City" value="" />
          {cities.map(city => (
            <Picker.Item key={city.id} label={city.name} value={city.name} />
          ))}
        </Picker>

        {selectedCity !== '' && (
          <Picker
            selectedValue={selectedPlace}
            onValueChange={(value) => {
              setSelectedPlace(value);
              setChowkis([]);
              setChowkiData([]);
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select a Place" value="" />
            {places.map(place => (
              <Picker.Item key={place.id} label={place.name} value={place.name} />
            ))}
          </Picker>
        )}

        {chowkis.length > 0 && (
          <View>
            <Text style={styles.chowkiHeader}>Chowkis in {selectedPlace}:</Text>
            {chowkis.map(chowki => {
              const cameraInfo = chowkiData.find(
                c => c.chowkiName === chowki.name
              );
              const cameras = cameraInfo?.cameras || [];

              return (
                <View key={chowki.id} style={styles.chowkiCard}>
                  <Text style={styles.chowkiName}>{chowki.name}</Text>
                  {cameras.length > 0 ? (
                    <Text style={styles.cameraText}>
                      Linked Cameras:{' '}
                      {cameras.map(c => `${c.camera_name} (${c.camera_type})`).join(', ')}
                    </Text>
                  ) : (
                    <Text style={styles.cameraText}>No linked cameras</Text>
                  )}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(chowki.name)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F0' },
  header: {
    backgroundColor: '#2AB9A8',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  headerSubtitle: { fontSize: 14, color: '#FFF', marginTop: 5 },
  form: { padding: 20 },
  picker: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    marginBottom: 15,
  },
  chowkiHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  chowkiCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    borderColor: '#DDD',
    borderWidth: 1,
    marginBottom: 10,
  },
  chowkiName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraText: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
    color: '#555',
  },
  deleteButton: {
    backgroundColor: '#E53935',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  backButton: {
    backgroundColor: '#CCC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DeleteNaka;
