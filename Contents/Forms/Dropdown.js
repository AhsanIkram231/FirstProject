import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';

const Dropdown = () => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [Countries, setCountries] = useState([
        { key: 1, value: 'Islamabad' },
        { key: 2, value: 'Rawalpindi' },
        { key: 3, value: 'Lahore' },
        { key: 4, value: 'Karachi' },
        { key: 5, value: 'Peshawar' },
        { key: 6, value: 'Peswar' },
    ]);

    return (
        <View style={styles.background}>
            <SelectList
                data={Countries}
                setSelected={setSelectedCountry}
                save='value'
                search={true}
                placeholder="Select a country"
                
                boxStyles={{
                    borderWidth: 2,
                    backgroundColor: 'yellow',
                    borderRadius: 20,
                }}
            />
            <Text>Selected Country: {selectedCountry}</Text>
        </View>
    );
};
const styles=StyleSheet.create({
    background:{
        flex:1,
        backgroundColor:'pink',
        padding: 20,

    }
})

export default Dropdown;
