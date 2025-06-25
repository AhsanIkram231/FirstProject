import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import { useRoute, useNavigation } from '@react-navigation/native';

const LinkNakaWithNaka = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { chowkiId, chowkiName, placeName, cityName } = route.params;

  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [chowkis, setChowkis] = useState([]);
  const [selectedCity, setSelectedCity] = useState(cityName);
  const [selectedPlace, setSelectedPlace] = useState(placeName);
  const [linkedNakas, setLinkedNakas] = useState([]);
  const [existingLinksMap, setExistingLinksMap] = useState({});

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
        .then(data => {
          const filtered = data.filter(c => c.id !== chowkiId);
          setChowkis(filtered);
        })
        .catch(() => setChowkis([]));
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (chowkiId) {
      fetch(`${global.furl}nakagrapg`)
        .then(res => res.json())
        .then(data => {
          const existingLinks = data.filter(link => link.FromNakaID === chowkiId);
          const initialLinked = [];
          const map = {};

          existingLinks.forEach(link => {
            initialLinked.push(link.ToNakaID);
            map[`${link.FromNakaID}-${link.ToNakaID}`] = link.ID;
          });

          setLinkedNakas(initialLinked);
          setExistingLinksMap(map);
        })
        .catch(err => console.error('Error loading linked nakas:', err));
    }
  }, [chowkiId]);

  const handleSave = async () => {
    const updates = [];
    const inserts = [];

    linkedNakas.forEach(toId => {
      const key = `${chowkiId}-${toId}`;
      if (existingLinksMap[key]) {
        updates.push({ id: existingLinksMap[key], from_id: chowkiId, to_id: toId });
      } else {
        inserts.push({ from_id: chowkiId, to_id: toId });
      }
    });

    if (updates.length === 0 && inserts.length === 0) {
      Alert.alert('Error', 'No valid changes to save.');
      return;
    }

    try {
      for (let item of updates) {
        await fetch(`${global.furl}naka`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: item.id,
            FromNakaID: item.from_id,
            ToNakaID: item.to_id,
            DistanceKM: 0, // hardcoded
          }),
        });
      }

      if (inserts.length > 0) {
        const response = await fetch(`${global.furl}linkNakawithnaka`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            FromNakaID: chowkiId,
            ToNakaID: inserts.map(i => i.to_id),
            DistanceKM: inserts.map(() => 0), // hardcoded
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Failed to create new links.');
        }
      }

      Alert.alert('Success', 'Naka links saved/updated successfully.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save.');
    }
  };

  const handleUnlink = async (fromId, toId) => {
    try {
      const res = await fetch(`${global.furl}deletelinknaka`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: fromId, tonakaid: toId }),
      });

      const result = await res.json();
      if (!res.ok) {
        Alert.alert('Error', result.error || 'Failed to delete link.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to delete link.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Link Naka with Another Naka</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Selected Naka:</Text>
        <TextInput style={styles.input} value={chowkiName} editable={false} />

        <Picker
          selectedValue={selectedCity}
          onValueChange={value => {
            setSelectedCity(value);
            setSelectedPlace('');
            setChowkis([]);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Select a City" value="" />
          {cities.map(city => (
            <Picker.Item key={city.id} label={city.name} value={city.name} />
          ))}
        </Picker>

        {selectedCity && (
          <Picker
            selectedValue={selectedPlace}
            onValueChange={value => setSelectedPlace(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select a Place" value="" />
            {places.map(place => (
              <Picker.Item key={place.id} label={place.name} value={place.name} />
            ))}
          </Picker>
        )}

        {chowkis.map(naka => (
          <View key={naka.id} style={styles.card}>
            <View style={styles.checkboxRow}>
              <CheckBox
                value={linkedNakas.includes(naka.id)}
                onValueChange={async (newValue) => {
                  if (newValue) {
                    setLinkedNakas(prev => [...prev, naka.id]);
                  } else {
                    setLinkedNakas(prev => prev.filter(id => id !== naka.id));
                    await handleUnlink(chowkiId, naka.id);
                  }
                }}
              />
              <Text style={styles.chowkiName}>{naka.name}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: '#2AB9A8',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  form: { padding: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: '#CCC',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: '#CCC',
    borderWidth: 1,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  chowkiName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#2AB9A8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  saveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#CCC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LinkNakaWithNaka;
