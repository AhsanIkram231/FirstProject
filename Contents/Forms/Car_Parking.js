import React, { useState } from 'react';
import { View, Text, StyleSheet , FlatList} from 'react-native';
import { Button, RadioButton, TextInput } from 'react-native-paper';

const Car_Parking = () => {

    const [vehicleNumber, setvehicleNumber] = useState('')
    const [VehicleType, setVehicleType] = useState('')
    const [parkedVehicles, setParkedVehicles] = useState([]);
    
   
    
    





    return (
        <View style={styles.background}>
            <View style={styles.header}>
                <Text style={styles.Quiztaxt}>Car Parking System</Text>
            </View>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Vehicle Number"
                    value={vehicleNumber}
                    onChangeText={setvehicleNumber}
                    
                />

                <RadioButton.Group onValueChange={newValue => setVehicleType(newValue)} value={VehicleType}>
                    <View style={styles.radioButtonContainer}>
                        <View style={styles.radioButtonItem}>
                            <RadioButton value="Car" />
                            <Text style={styles.radioLabel}>Car</Text>
                        </View>
                        <View style={styles.radioButtonItem}>
                            <RadioButton value="Bike" />
                            <Text style={styles.radioLabel}>Bike</Text>
                        </View>

                        <Button
                            mode="contained"

                        >
                            Park In
                        </Button>
                    </View>
                </RadioButton.Group>

                <View style={styles.radioButtonContainer}>
                    <Button
                        mode="contained"

                    >
                        All
                    </Button>

                    <Button
                        mode="contained"
                    >
                        Car
                    </Button>

                    <Button
                        mode="contained"
                    >
                        Bike
                    </Button>

                    <Button
                        mode="contained"
                    >
                        Parked Out
                    </Button>
                </View>

                <View style={styles.TextEarn}>
                    <Text style={styles.label}>Total Parked in:</Text>
                    <Text style={styles.label}>Total Earnings: Rs </Text>
                </View> 

            <FlatList
            data={parkedVehicles}
            
            />




            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: 'pink',
        marginBottom: 10
    },
    Quiztaxt: {
        textAlign: 'center',
        fontSize: 30,
        paddingBottom: 10,
        fontWeight: 'bold'
    },
    form: {
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10'
    },
    radioLabel: {
        fontSize: 16,
        marginRight: 20,
    },
    radioButtonItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    TextEarn: {
        flexDirection: 'row',
        marginBottom: '10',
        justifyContent:"space-between"

    }
})

export default Car_Parking