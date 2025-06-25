import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react'
import { Text, View, TouchableOpacity, TextInput } from 'react-native';


const setIntArray = async () => {
    try {
        const numbers = [1, 2, 3, 4];
        await AsyncStorage.setItem("values", JSON.stringify(numbers))
        console.log("Data Saved Successfully")
    } catch (error) {
        console.log(error.message)
    }
}

const getArray = async () => {
    try {
        var response = await AsyncStorage.getItem('values');
        if (response) {
            var digits = JSON.parse(response);
            console.log('Numbers in Array:' + digits)
        }
    } catch (error) {
        console.log(error.message)
    }
}
const SharedPrefrence = () => {
    return (
        <View>

            <TouchableOpacity
                style={{ alignSelf: 'center', backgroundColor: 'blue', width: 180, height: 50, margin: 15, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
                onPress={setIntArray}
            >
                <Text style={{ color: 'white', fontSize: 20 }}>Store Integer Array</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ alignSelf: 'center', backgroundColor: 'blue', width: 180, height: 50, margin: 15, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
                onPress={getArray}
            >
                <Text style={{ color: 'white', fontSize: 20 }}>Get Integer Array</Text>
            </TouchableOpacity>

        </View>
    );
}

export default SharedPrefrence;