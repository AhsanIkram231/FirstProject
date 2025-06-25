import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserInfoScreen = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");

  // Load saved data when the component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  const saveUserData = async () => {
    try {
      const userData = { name, age, city };
      await AsyncStorage.setItem("userInfo", JSON.stringify(userData));
      Alert.alert("Success", "User data saved!");
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userInfo");
      if (storedData) {
        const { name, age, city } = JSON.parse(storedData);
        setName(name);
        setAge(age);
        setCity(city);
      }
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <Text style={styles.label}>City:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter City"
        value={city}
        onChangeText={setCity}
      />

      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={saveUserData} />
        <Button title="Show" onPress={loadUserData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default UserInfoScreen;