import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';

const CameraUpload = () => {
    const navigation = useNavigation();

    const [selectedCity, setSelectedCity] = useState('');
    const [selectedPlace, setSelectedPlace] = useState('');
    const [selectedDirection, setSelectedDirection] = useState('');
    const [Date, setDate] = useState('');
    const [Time, setTime] = useState('');
    const [DateTime, setDateTime] = useState('');

    const [cities, setCities] = useState([]);
    const [places, setPlaces] = useState([]);
    const [directions, setDirections] = useState([]);

    const [cameras, setCameras] = useState([]);
    const [frontImage, setFrontImage] = useState(null);
    const [sideImage, setSideImage] = useState(null);

    const frontCamera = cameras.find((cam) => cam.Type?.toLowerCase() === 'front');
    const sideCamera = cameras.find((cam) => cam.Type?.toLowerCase() === 'side');
    const camerasAvailable = frontCamera && sideCamera;

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch(`${global.furl}city`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setCities(data);
                }
            } catch (error) {
                console.error('City fetch error:', error);
            }
        };

        fetchCities();
    }, []);

    const fetchPlaces = async (cityName) => {
        try {
            const response = await fetch(`${global.furl}place?name=${encodeURIComponent(cityName)}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setPlaces(data);
            }
        } catch (error) {
            console.error('Place fetch error:', error);
        }
    };

    const fetchDirections = async (placeName) => {
        try {
            const response = await fetch(`${global.furl}directions?name=${encodeURIComponent(placeName)}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setDirections(data);
            }
        } catch (error) {
            console.error('Direction fetch error:', error);
        }
    };

    const fetchCameras = async (placeName, directionName) => {
        try {
            const response = await fetch(`${global.furl}camera`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ placename: placeName, directionname: directionName }),
            });

            const data = await response.json();
            if (response.ok && Array.isArray(data)) {
                setCameras(data);
            } else {
                setCameras([]);
            }
        } catch (error) {
            console.error('Camera fetch error:', error);
        }
    };

    const pickImage = async (type) => {
        const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
        if (!result.didCancel && result.assets && result.assets.length > 0) {
            const image = result.assets[0];
            type === 'front' ? setFrontImage(image) : setSideImage(image);
        }
    };

    const handleSubmit = async () => {
        if (!selectedCity || !selectedPlace || !selectedDirection || !frontImage || !sideImage ) {
            Alert.alert('Error', 'Please complete all fields and upload both images.');
            return;
        }

        
        const formData = new FormData();
        const indices = [];

        if (frontImage) {
            indices.push(frontCamera.id);
            formData.append('images', {
                uri: frontImage.uri,
                name: `image_${frontCamera.id}.jpg`,
                type: frontImage.type || 'image/jpeg',
            });
        }

        if (sideImage) {
            indices.push(sideCamera.id);
            formData.append('images', {
                uri: sideImage.uri,
                name: `image_${sideCamera.id}.jpg`,
                type: sideImage.type || 'image/jpeg',
            });
        }

        formData.append('image_indices', indices.join(','));
        formData.append('date',DateTime);

        try {
            const response = await fetch(`${global.furl}upload-multicameraimages_task`, {
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Images uploaded and processed successfully!');
            } else {
                Alert.alert('Error', result.message || 'Upload failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong during upload');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Distance check</Text>
                <Text style={styles.headerSubtitle}>also check distance</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <RNPicker
                    selectedValue={selectedCity}
                    style={styles.input}
                    onValueChange={(itemValue) => {
                        setSelectedCity(itemValue);
                        setPlaces([]);
                        setSelectedPlace('');
                        setDirections([]);
                        setSelectedDirection('');
                        setCameras([]);
                        fetchPlaces(itemValue);
                    }}
                >
                    <RNPicker.Item label="Select City" value="" />
                    {cities.map((city, index) => (
                        <RNPicker.Item key={index} label={city.name} value={city.name} />
                    ))}
                </RNPicker>

                <RNPicker
                    selectedValue={selectedPlace}
                    style={styles.input}
                    onValueChange={(itemValue) => {
                        setSelectedPlace(itemValue);
                        setSelectedDirection('');
                        setCameras([]);
                        fetchDirections(itemValue);
                    }}
                    enabled={places.length > 0}
                >
                    <RNPicker.Item label="Select Place" value="" />
                    {places.map((place, index) => (
                        <RNPicker.Item key={index} label={place.name} value={place.name} />
                    ))}
                </RNPicker>

                <RNPicker
                    selectedValue={selectedDirection}
                    style={styles.input}
                    onValueChange={async (itemValue) => {
                        setSelectedDirection(itemValue);
                        if (selectedPlace && itemValue) {
                            await fetchCameras(selectedPlace, itemValue);
                        }
                    }}
                    enabled={directions.length > 0}
                >
                    <RNPicker.Item label="Select Direction" value="" />
                    {directions.map((dir, index) => (
                        <RNPicker.Item key={index} label={dir.name} value={dir.name} />
                    ))}
                </RNPicker>

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

                <TouchableOpacity
                    style={[styles.button, !camerasAvailable && { backgroundColor: '#aaa' }]}
                    onPress={() => pickImage('front')}
                    disabled={!camerasAvailable}
                >
                    <Text style={styles.buttonText}>
                        {frontImage ? 'Front Image Selected' : 'Upload Front Image'}
                    </Text>
                </TouchableOpacity>
                {frontImage && <Image source={{ uri: frontImage.uri }} style={styles.imagePreview} />}

                <TouchableOpacity
                    style={[styles.button, !camerasAvailable && { backgroundColor: '#aaa' }]}
                    onPress={() => pickImage('side')}
                    disabled={!camerasAvailable}
                >
                    <Text style={styles.buttonText}>
                        {sideImage ? 'Side Image Selected' : 'Upload Side Image'}
                    </Text>
                </TouchableOpacity>
                {sideImage && <Image source={{ uri: sideImage.uri }} style={styles.imagePreview} />}


                <Text style={styles.label}>Date</Text>
                
                          <TextInput
                            style={styles.textInput}
                            placeholder="e.g., 2025-06-09T08:45:30.000"
                            value={DateTime}
                            onChangeText={setDateTime}
                          />
                 {/* <Text style={styles.label}>Time</Text>
                
                          <TextInput
                            style={styles.textInput}
                            placeholder="e.g., H,M,S"
                            value={Time}
                            onChangeText={setTime}
                          /> */}

                <TouchableOpacity
                    style={[styles.submitButton, !camerasAvailable && { backgroundColor: '#999' }]}
                    onPress={handleSubmit}
                    disabled={!camerasAvailable}
                >
                    <Text style={styles.submitButtonText}>Submit</Text>
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
    scrollContent: { padding: 20, paddingBottom: 40 },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        borderColor: '#CCC',
        borderWidth: 1,
    },
    button: {
        backgroundColor: '#0E9AA7',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: { color: '#FFF', fontSize: 16 },
    imagePreview: {
        width: '100%',
        height: 100,
        marginTop: 5,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    submitButton: {
        backgroundColor: '#2AB9A8',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    textInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
label: { fontWeight: "bold", marginTop: 10, marginBottom: 5 },

});

export default CameraUpload;
