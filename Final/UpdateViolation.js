import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, Switch, ScrollView, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const UpdateViolation = () => {
  const navigation = useNavigation();
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetch(`${global.furl}violations`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setViolations(data);
          setFilteredViolations(data);
        } else {
          Alert.alert("Error", "Failed to load violations");
        }
      })
      .catch((err) => Alert.alert("Error", err.message));
  }, []);

  const toggleStatus = async (violation) => {
    const newStatus = violation.status === "Active" ? "Inactive" : "Active";
    try {
      const response = await fetch(`${global.furl}updateviolationstatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          violation_id: violation.id,
          Status: newStatus,
        }),
      });

      if (response.status === 200) {
        Alert.alert("Success", "Violation status updated successfully.");
        const updated = violations.map((v) =>
          v.id === violation.id ? { ...v, status: newStatus } : v
        );
        setViolations(updated);
        handleSearch(searchText, updated);
      } else {
        const result = await response.json();
        Alert.alert("Error", result?.error || "Failed to update status");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };


  const handleSearch = (text, baseData = violations) => {
    setSearchText(text);
    const filtered = baseData.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredViolations(filtered);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Update Violation</Text>
        <Text style={styles.headerSubtitle}>Set up and manage update traffic violations</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search violation name..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
        {filteredViolations.map((item) => (
          <View key={item.id.toString()} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.nameText}>{item.name}</Text>
              <View style={styles.iconRow}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => navigation.navigate("EditViolation", { violationId: item.id })}

                >
                  <Icon name="edit" size={20} color="#e74c3c" />
                </TouchableOpacity>
                <Switch
                  value={item.status === "Active"}
                  onValueChange={() => toggleStatus(item)}
                />
              </View>
            </View>
            <Text style={styles.description}>Description: {item.description}</Text>
            <Text style={styles.fineLabel}>Fines:</Text>
            <Text style={styles.fineAmount}>
              Fine: {item.fines.length > 0 ? item.fines[0].fine : "N/A"} PKR
            </Text>
            {item.fines.length > 0 && (
              <Text style={styles.date}>
                Date: {new Date(item.fines[0].created_date).toUTCString()}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
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
  searchContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2c3e50",
  },
  description: { color: "#555", marginTop: 6 },
  fineLabel: { fontWeight: "bold", marginTop: 8 },
  fineAmount: { color: "red", fontWeight: "bold" },
  date: { color: "#777", fontSize: 12, marginTop: 4 },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: { paddingHorizontal: 5 },
  backButton: {
    backgroundColor: "#ddd",
    padding: 15,
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 10,
  },
 backButton: {
    backgroundColor: '#CCC',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateViolation;
