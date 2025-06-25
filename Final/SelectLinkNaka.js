import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const SelectLinkNaka = () => {
    const navigation = useNavigation();
    const [cities, setCities] = useState([]);
    const [places, setPlaces] = useState([]);
    const [chowkis, setChowkis] = useState([]);

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
                .then(data => Array.isArray(data) ? setChowkis(data) : setChowkis([]))
                .catch(() => setChowkis([]));
        }
    }, [selectedPlace]);

    const handleLink = (chowki) => {
        navigation.navigate('LinkNakaWithNaka', {
            chowkiId: chowki.id,
            chowkiName: chowki.name,
            placeName: selectedPlace,
            cityName: selectedCity,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Select Link Naka</Text>
                <Text style={styles.headerSubtitle}>Select City and Place to Link Nakas</Text>
            </View>

            <ScrollView contentContainerStyle={styles.form}>
                <Picker
                    selectedValue={selectedCity}
                    onValueChange={(value) => {
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

                {selectedCity !== '' && (
                    <Picker
                        selectedValue={selectedPlace}
                        onValueChange={(value) => {
                            setSelectedPlace(value);
                            setChowkis([]);
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
                        {chowkis.map(chowki => (
                            <View key={chowki.id} style={styles.chowkiCard}>
                                <Text style={styles.chowkiName}>{chowki.name}</Text>
                                <TouchableOpacity
                                    style={styles.linkButton}
                                    onPress={() =>
                                        navigation.navigate('LinkNakaWithNaka', {
                                            chowkiId: chowki.id,
                                            chowkiName: chowki.name,
                                            placeName: selectedPlace,
                                            cityName: selectedCity,
                                        })
                                    }

                                >
                                    <Text style={styles.linkText}>Link</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
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
    linkButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    linkText: {
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

export default SelectLinkNaka;
