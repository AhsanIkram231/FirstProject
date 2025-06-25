import { View, Text, StyleSheet, TextInput, Button, FlatList, Alert, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';

const Task4 = () => {
  const [mobileName, setMobileName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stock, setStock] = useState([]);
  const [showStock, setShowStock] = useState(false);

  const categories = [
    { key: '1', value: 'Android' },
    { key: '2', value: 'Iphone' },
    
  ];

  const handleAddProduct = () => {
    if (!mobileName || !category || !price || !quantity) {
      Alert.alert('Error', 'Please fill all fields!');
      return;
    }

    const newProduct = {
      id: stock.length + 1,
      name: mobileName,
      category,
      price,
      quantity,
    };

    setStock([...stock, newProduct]);
    setMobileName('');
    setCategory('');
    setPrice('');
    setQuantity('');
    Alert.alert('Success', 'Product added to stock!');
  };

  const handleDeleteProduct = (id) => {
    const updatedStock = stock.filter((item) => item.id !== id);
    setStock(updatedStock);
    Alert.alert('Deleted', `Product ID ${id} has been removed!`);
  };

  return (

    
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Mobile Shop</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Mobile Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter mobile name"
          value={mobileName}
          onChangeText={(text) => setMobileName(text)}
        />

        <Text style={styles.label}>Category:</Text>
        <SelectList
          setSelected={(value) => setCategory(value)}
          data={categories}
          search={false}
          placeholder="Select category"
          boxStyles={styles.input} 
        />

        <Text style={styles.label}>Price:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          value={price}
          keyboardType="numeric"
          onChangeText={(text) => setPrice(text)}
        />

        <Text style={styles.label}>Quantity:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter quantity"
          value={quantity}
          keyboardType="numeric"
          onChangeText={(text) => setQuantity(text)}
        />

        <View style={styles.buttonContainer}>
          <Button title="Add" onPress={handleAddProduct} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={showStock ? 'Hide Stock' : 'Show Stock'}
            onPress={() => setShowStock(!showStock)}
          />
        </View>
      </View>

      {showStock && (
        <View style={styles.stockContainer}>
          <Text style={styles.stockHeader}>All Stock</Text>
          {stock.length === 0 ? (
            <Text style={styles.noStockText}>No products in stock</Text>
          ) : (
            <FlatList
              data={stock}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.stockItem}>
                  <Text>Product ID: {item.id}</Text>
                  <Text>Mobile Name: {item.name}</Text>
                  <Text>Category: {item.category}</Text>
                  <Text>Price: ${item.price}</Text>
                  <Text>Quantity: {item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteProduct(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      )}
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
  buttonContainer: {
    marginBottom: 15,
  },
  stockContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  stockHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  stockItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  deleteButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noStockText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
  },
});

export default Task4;
