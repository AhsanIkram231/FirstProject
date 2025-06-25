import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddShift = () => {
  const navigation = useNavigation();

  const [shiftName, setShiftName] = useState("morning");
  const [startTime, setStartTime] = useState("08:00:00");
  const [endTime, setEndTime] = useState("16:00:00");

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSave = async () => {
    if (!shiftName || !startTime || !endTime) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    const shiftData = {
      shiftname: shiftName,
      starttime: startTime,
      endtime: endTime,
    };

    try {
      const response = await fetch(`${global.furl}addshift`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shiftData),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Shift added successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", result.error || "Failed to add shift.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}:00`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Shift</Text>
        <Text style={styles.headerSubtitle}>Set up and manage a new shift</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Shift Type</Text>
        <View style={styles.radioGroup}>
          {["morning", "evening", "night"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.radioButton,
                shiftName === type && styles.radioSelected,
              ]}
              onPress={() => setShiftName(type)}
            >
              <View
                style={[
                  styles.circle,
                  shiftName === type && styles.circleSelected,
                ]}
              />
              <Text style={{ marginLeft: 5 }}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity
          style={styles.timeBox}
          onPress={() => setShowStartPicker(true)}
        >
          <Text>{startTime}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={new Date(`1970-01-01T${startTime}`)}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) {
                setStartTime(formatTime(selectedDate));
              }
            }}
          />
        )}

        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity
          style={styles.timeBox}
          onPress={() => setShowEndPicker(true)}
        >
          <Text>{endTime}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={new Date(`1970-01-01T${endTime}`)}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) {
                setEndTime(formatTime(selectedDate));
              }
            }}
          />
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
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
  label: { fontWeight: "bold", marginTop: 10, marginBottom: 5 },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    borderColor: "#2AB9A8",
    borderWidth: 1,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  radioSelected: {
    backgroundColor: "#E0F7F5",
    borderRadius: 5,
  },
  circle: {
    height: 14,
    width: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#444",
    marginRight: 5,
  },
  circleSelected: {
    backgroundColor: "#2AB9A8",
    borderColor: "#2AB9A8",
  },
  timeBox: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    borderColor: "#CCC",
    borderWidth: 1,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#2AB9A8",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  backButtonText: {
    textAlign: "center",
    color: "black",
  },
});

export default AddShift;
