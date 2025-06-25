import { View, Text, Image, StyleSheet, Button, Animated, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');

const ImagePickerComponent = () => {
    const [ImageUri, setImageUri] = useState(null);
    const [backgroundPosition] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.loop(
            Animated.timing(backgroundPosition, {
                toValue: -height,
                duration: 10000,
                useNativeDriver: true,
            })
        ).start();
    }, [backgroundPosition]);

    const getFromGallery = () => {
        const options = {};
        ImagePicker.launchImageLibrary(options, response => {
            if (response.assets && response.assets.length > 0) {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    const takePicture = () => {
        const options = {};
        ImagePicker.launchCamera(options, response => {
            if (response.assets && response.assets.length > 0) {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    return (
        <View style={styles.container}>
            <Animated.View style={{ ...StyleSheet.absoluteFillObject, overflow: 'hidden' }}>
                <Animated.Image 
                    source={require('../../assets/images/background.jpg')} 
                    style={[styles.backgroundImage, { transform: [{ translateY: backgroundPosition }] }]} 
                />
                <Animated.Image 
                    source={require('../../assets/images/background.jpg')} 
                    style={[styles.backgroundImage, { transform: [{ translateY: backgroundPosition.interpolate({
                        inputRange: [-height, 0],
                        outputRange: [0, height]
                    }) }] }]} 
                />
            </Animated.View>
            <Image 
                source={ImageUri ? { uri: ImageUri } : require('../../assets/images/baby.jpg')} 
                style={styles.icon} 
            />
            <View style={{ alignItems: 'center' }}>
                <View style={styles.buttonContainer}>
                    <Button title="Upload From Gallery" onPress={getFromGallery} color="lightblue" />
                </View>

                <View style={styles.buttonContainer}>
                    <Button title="Take Picture From Camera" onPress={takePicture} color="lightblue" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    backgroundImage: {
        position: 'absolute',
        width: width,
        height: height,
        top: 0,
        resizeMode: 'cover',
    },
    icon: {
        width: 80,
        height: 80,
        marginBottom: 20,
        borderRadius: 80,
    },
    buttonContainer: {
        marginVertical: 5,
        width: 200,
    },
});

export default ImagePickerComponent;
