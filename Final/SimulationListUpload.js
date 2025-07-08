import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const SimulationListUpload = ({ navigation, route }) => {
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedPlace, setSelectedPlace] = useState('');
    const [selectedDirection, setSelectedDirection] = useState('');
    const [cities, setCities] = useState([]);
    const [places, setPlaces] = useState([]);
    const [directions, setDirections] = useState([]);
    const [cameras, setCameras] = useState([]);
    const [frontImage, setFrontImage] = useState(null);
    const [sideImage, setSideImage] = useState(null);

    const frontCamera = cameras.find(c => c.Type?.toLowerCase() === 'front');
    const sideCamera = cameras.find(c => c.Type?.toLowerCase() === 'side');
    const camerasAvailable = frontCamera && sideCamera;

    const fetchCities = async () => {
        const res = await fetch(`${global.furl}city`);
        const data = await res.json();
        setCities(data || []);
    };

    const fetchPlaces = async (city) => {
        const res = await fetch(`${global.furl}place?name=${city}`);
        const data = await res.json();
        setPlaces(data || []);
    };

    const fetchDirections = async (place) => {
        const res = await fetch(`${global.furl}directions?name=${place}`);
        const data = await res.json();
        setDirections(data || []);
    };

    const fetchCameras = async (place, direction) => {
        const res = await fetch(`${global.furl}camera`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ placename: place, directionname: direction }),
        });
        const data = await res.json();
        setCameras(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const pickImage = async (type) => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        if (!result.didCancel && result.assets?.length > 0) {
            const img = result.assets[0];
            type === 'front' ? setFrontImage(img) : setSideImage(img);
        }
    };

    // ...all your imports and setup remain the same...

    const handleSubmit = () => {
  if (!frontImage || !sideImage || !frontCamera || !sideCamera) {
    Alert.alert('Error', 'Please upload both front and side images and make sure cameras are available.');
    return;
  }

  const newSubmission = {
    id: Date.now(),
    frontCamera,
    sideCamera,
    frontImageUri: frontImage.uri,
    sideImageUri: sideImage.uri,
  };

  global.simulations.push(newSubmission); // ✅ append globally
  navigation.navigate('SimulationList');   // ✅ no need to pass via params
};




    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Camera Feeds</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Picker selectedValue={selectedCity} onValueChange={(val) => {
                    setSelectedCity(val);
                    setSelectedPlace('');
                    setDirections([]);
                    setSelectedDirection('');
                    fetchPlaces(val);
                }}>
                    <Picker.Item label="Select City" value="" />
                    {cities.map((city, idx) => <Picker.Item key={idx} label={city.name} value={city.name} />)}
                </Picker>

                <Picker selectedValue={selectedPlace} onValueChange={(val) => {
                    setSelectedPlace(val);
                    fetchDirections(val);
                }} enabled={places.length > 0}>
                    <Picker.Item label="Select Place" value="" />
                    {places.map((place, idx) => <Picker.Item key={idx} label={place.name} value={place.name} />)}
                </Picker>

                <Picker selectedValue={selectedDirection} onValueChange={(val) => {
                    setSelectedDirection(val);
                    fetchCameras(selectedPlace, val);
                }} enabled={directions.length > 0}>
                    <Picker.Item label="Select Direction" value="" />
                    {directions.map((dir, idx) => <Picker.Item key={idx} label={dir.name} value={dir.name} />)}
                </Picker>
                {cameras.length > 0 ? (
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Fetched Cameras:</Text>
                        {cameras.map((cam, index) => (
                            <Text key={cam.id}>
                                {index + 1}. {cam.name} ({cam.Type})
                            </Text>
                        ))}
                    </View>
                ) : selectedDirection ? (
                    <Text style={{ color: 'red', marginVertical: 10 }}>
                        No cameras linked with this direction.
                    </Text>
                ) : null}


                <TouchableOpacity style={styles.button} onPress={() => pickImage('front')} disabled={!camerasAvailable}>
                    <Text style={styles.buttonText}>Upload Front Image</Text>
                </TouchableOpacity>
                {frontImage && <Image source={{ uri: frontImage.uri }} style={styles.image} />}

                <TouchableOpacity style={styles.button} onPress={() => pickImage('side')} disabled={!camerasAvailable}>
                    <Text style={styles.buttonText}>Upload Side Image</Text>
                </TouchableOpacity>
                {sideImage && <Image source={{ uri: sideImage.uri }} style={styles.image} />}

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>

            </ScrollView>
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
    content: { padding: 15 },
    button: {
        backgroundColor: '#0E9AA7',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: { color: '#FFF' },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
        marginTop: 10,
        borderRadius: 10,
    },
    submitButton: {
        backgroundColor: '#2AB9A8',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default SimulationListUpload;
