import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

const RM = () => {
    const [userCate, setUserCate] = useState('');
    const [userPrice, setUserPrice] = useState('');

    const [stock, setStock] = useState([
        { Price: 800, name: 'Spring Rolls', category: 'Appetizers' },
        { Price: 500, name: 'Cheese Burger', category: 'Main Course' },
        { Price: 1200, name: 'Tikka', category: 'Appetizers' },
        { Price: 1500, name: 'Chicken Karahi', category: 'Main Course' },
        { Price: 400, name: 'Cup Cake', category: 'Desserts' },
    ]);

    const [s1Cate, setS1Cate] = useState([
        { key: 1, value: 'Appetizers' },
        { key: 2, value: 'Main Course' },
        { key: 3, value: 'Desserts' },
    ]);

    const [PriceCate, setPriceCate] = useState([
        { key: 1, value: 'Below 1000 PKR' },
        { key: 2, value: '1000 - 1500 PKR' },
        { key: 3, value: 'Above 1500 PKR' },
    ]);

    const filterItems = () => {
        return stock.filter((item) => {
            const matchesCategory = userCate ? item.category == userCate : true;
            const matchesPrice =
                userPrice == 'Below 1000 PKR' ? item.Price < 1000 :
                    userPrice == '1000 - 1500 PKR' ? item.Price >= 1000 && item.Price <= 1500 :
                        userPrice == 'Above 1500 PKR' ? item.Price > 1500 :
                            true;

            return matchesCategory && matchesPrice;
        });
    };

    const renderItem = ({ item }) => (
        <View style={styleSheet.itemContainer}>
            <Text style={styleSheet.itemText}>{item.name}</Text>
            <Text style={styleSheet.itemText}>Price: {item.Price} PKR</Text>
            <Text style={styleSheet.itemText}>Category: {item.category}</Text>
        </View>
    );

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Text style={styleSheet.mainHeading}>Restaurant Menu</Text>
            <Text style={styleSheet.catText}>Select Category</Text>
            <SelectList
                data={s1Cate}
                placeholder="Select a category"
                save="value"
                search={false}
                boxStyles={{ borderColor: 'darkblue' }}
                setSelected={setUserCate}
            />
            <Text style={styleSheet.catText}>Select Price Range</Text>
            <SelectList
                data={PriceCate}
                placeholder="Select a price range"
                save="value"
                search={false}
                boxStyles={{ borderColor: 'darkblue' }}
                setSelected={setUserPrice}
            />

            <FlatList
                data={filterItems()}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
            />
        </View>
    );
};

const styleSheet = StyleSheet.create({
    mainHeading: {
        backgroundColor: 'skyblue',
        fontSize: 20,
        padding: 10,
        fontWeight: 'bold',
        borderWidth: 2,
        borderColor: 'skyblue',
        borderRadius: 10,
        textAlign: 'center',
    },
    catText: {
        margin: 10,
        fontSize: 16,
    },
    itemContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
    },
    itemText: {
        fontSize: 16,
    },
});

export default RM;