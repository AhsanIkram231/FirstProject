import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";

const AddViolation = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [fine, setFine] = useState("");
  const [description, setDescription] = useState("");
  const [addLimit, setAddLimit] = useState(false);
  const [limitValue, setLimitValue] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Violation name is required.");
      return;
    }

    try {
      const response = await fetch(`${global.furl}violation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          fine: parseInt(fine.trim()),
          limitValue: addLimit ? parseInt(limitValue) : -1,
          status: "active", // sending status from frontend
        }),
      });

      const result = await response.json();

      if (response.status === 201) {
        Alert.alert("Success", result?.Successfully || "Violation added successfully.");
        setName("");
        setFine("");
        setDescription("");
        setAddLimit(false);
        setLimitValue("");
        navigation.goBack();
      } else {
        Alert.alert("Error", result.error || "Failed to add violation.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Violation</Text>
        <Text style={styles.headerSubtitle}>Set up and manage a new traffic violation</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter Violation Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Fine"
          keyboardType="numeric"
          value={fine}
          onChangeText={setFine}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Description"
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.limitToggle}>
          <Text style={styles.limitText}>Add Limit</Text>
          <Switch
            value={addLimit}
            onValueChange={setAddLimit}
            trackColor={{ false: "#767577", true: "#2AB9A8" }}
            thumbColor={addLimit ? "#FFF" : "#f4f3f4"}
          />
        </View>

        {addLimit && (
          <TextInput
            style={styles.input}
            placeholder="Enter Limit Value"
            keyboardType="numeric"
            value={limitValue}
            onChangeText={setLimitValue}
          />
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Violation</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F0F0" },
  header: {
    backgroundColor: "#2AB9A8",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#FFF" },
  headerSubtitle: { fontSize: 14, color: "#FFF", marginTop: 5 },
  form: { padding: 20 },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    borderColor: "#CCC",
    borderWidth: 1,
  },
  limitToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  limitText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#008080",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  backButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: { textAlign: "center", color: "white", fontWeight: "bold" },
  backButtonText: { textAlign: "center", color: "black" },
});

export default AddViolation;
