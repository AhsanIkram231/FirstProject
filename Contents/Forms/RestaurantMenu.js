import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

const RestaurantMenu = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedPriceRange, setSelectedPriceRange] = useState('All');
    const [selectedItem, setSelectedItem] = useState('');

    const categories = [
        { key: '1', value: 'All' },
        { key: '2', value: 'Fast Food' },
        { key: '3', value: 'Desi' },
        { key: '4', value: 'Sweets' },
    ];

    const priceRange = [
        { key: '1', value: 'All' },
        { key: '2', value: 'Below 1000 PKR' },
        { key: '3', value: '1000 - 1500 PKR' },
        { key: '4', value: 'Above 1500 PKR' },
    ];

    const menuItems = [
        { id: '1', name: 'Burger', category: 'Fast Food', price: 500 },
        { id: '2', name: 'Biryani', category: 'Desi', price: 1200 },
        { id: '3', name: 'Gulab Jamun', category: 'Sweets', price: 800 },
        { id: '4', name: 'Pizza', category: 'Fast Food', price: 1500 },
        { id: '5', name: 'Halwa', category: 'Sweets', price: 1000 },
        { id: '6', name: 'Karahi', category: 'Desi', price: 1800 },
        { id: '7', name: 'Frices', category: 'Fast Food', price: 100 },
        { id: '8', name: 'Karahi', category: 'Desi', price: 1800 },
    ];

    
    const filteredItems = menuItems.filter((item) => {
        const matchesCategory = selectedCategory == 'All' || item.category == selectedCategory;
        const matchesPriceRange =
            selectedPriceRange == 'All' ||
            (selectedPriceRange == 'Below 1000 PKR' && item.price < 1000) ||
            (selectedPriceRange == '1000 - 1500 PKR' && item.price >= 1000 && item.price <= 1500) ||
            (selectedPriceRange == 'Above 1500 PKR' && item.price > 1500);

        return matchesCategory && matchesPriceRange;
    });

    
    const filteredSelectListData = filteredItems.map((item) => ({
        key: item.id,
        value: item.name,
    }));

    return (
        <View style={styles.background}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Restaurant Menu</Text>
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Select Category:</Text>
                <SelectList
                    setSelected={setSelectedCategory}
                    data={categories}
                    search={false}
                    placeholder="All"
                    boxStyles={styles.input}
                />

                <Text style={styles.label}>Select Price Range:</Text>
                <SelectList
                    setSelected={setSelectedPriceRange}
                    data={priceRange}
                    search={false}
                    placeholder="ALl"
                    boxStyles={styles.input}
                />

                <Text style={styles.label}>Select Item:</Text>
                <SelectList
                    setSelected={setSelectedItem}
                    data={filteredSelectListData}
                    search={false}
                    save='value'
                    placeholder={
                        filteredSelectListData.length > 0
                            ? 'Choose item'
                            : 'No items available'
                    }
                    boxStyles={styles.input}
                    disabled={filteredSelectListData.length == 0}
                />
            </View>

            <View style={styles.resultContainer}>
                <Text style={styles.result}>
                    Selected Item: {selectedItem || 'Danish kar lo select'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'lightblue',
        paddingVertical: 10,
        borderRadius: 10,
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000',
    },
    form: {
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    resultContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    result: {
        fontSize: 18,
        fontWeight: '500',
        color: '#555',
    },
});

export default RestaurantMenu;
