import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  ScrollView, TouchableOpacity, Alert
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const CreateChallan = ({ route, navigation }) => {
 const { violation, WardenID } = route.params;

  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [mobile, setMobile] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState(violation.licenseplate || '');
  const [violations, setViolations] = useState([]);
  const [totalFine, setTotalFine] = useState(0);

  useEffect(() => {
    console.log('CreateChallan params:', route.params);

    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    try {
      const response = await fetch(`${global.furl}violations`);
      const data = await response.json();

      const formatted = data.map(v => ({
        id: v.id,
        name: v.name,
        fine: v.fines.length > 0 ? v.fines[0].fine : 0,
        selected: violation.violation_details.some(d => d.violation_name === v.name)
      }));

      setViolations(formatted);
      updateTotalFine(formatted);
    } catch (error) {
      console.error('Error fetching violations:', error.message);
    }
  };

  const updateTotalFine = (violationList) => {
    const total = violationList
      .filter(v => v.selected)
      .reduce((sum, v) => sum + v.fine, 0);
    setTotalFine(total);
  };

  const handleIssueChallan = async () => {
    const selectedViolations = violations.filter(v => v.selected).map(v => v.id);

    if (!name || !cnic || !mobile || !vehicleNumber || selectedViolations.length === 0 || totalFine <= 0) {
      Alert.alert("Validation", "Please fill all fields, select violations, and ensure fine amount is greater than 0.");
      return;
    }

    try {
      console.log("Payload:", {
        violation_history_id: violation.id,
        violation_ids: selectedViolations,
        violator_cnic: cnic,
        violator_name: name,
        mobile_number: mobile,
        vehicle_number: vehicleNumber,
        warden_id: WardenID,
        fine_amount: totalFine,
        status: "Unpaid"
      });
      const response = await fetch(`${global.furl}addchallanrecord`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          violation_history_id: violation.id,
          violation_ids: selectedViolations,
          violator_cnic: cnic,
          violator_name: name,
          mobile_number: mobile,
          vehicle_number: vehicleNumber,
          warden_id: WardenID,  
          fine_amount: totalFine,
          status: "Unpaid"
        })
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Update violation status to "issued"
        await fetch(`${global.furl}updateviolationsrecord`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicle_id: violation.vehicle_id,
            date: violation.date,
            camera_id: violation.camera_id,
            updates: { status: "issued" }
          })
        });

        Alert.alert("Success", "Challan issued successfully.");
        navigation.goBack();
      } else {
        Alert.alert("Error", data.error || "Failed to issue challan.");
      }
    } catch (error) {
      console.error('Error issuing challan:', error.message);
      Alert.alert("Error", "Server error while issuing challan.");
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Challan</Text>

      <Text style={styles.label}>Enter Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
      />

      <Text style={styles.label}>Enter CNIC / License Number</Text>
      <TextInput
        style={styles.input}
        value={cnic}
        onChangeText={setCnic}
        placeholder="Enter CNIC"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Enter Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
        placeholder="Enter mobile"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Violations & Fine:</Text>
      {violations.map((item, index) => (
        <View key={item.id} style={styles.violationItem}>
          <Text>{index + 1}. {item.name} - {item.fine} PKR</Text>
          <CheckBox
            value={item.selected}
            onValueChange={(newValue) => {
              const updated = [...violations];
              updated[index].selected = newValue;
              setViolations(updated);
              updateTotalFine(updated);
            }}
          />
        </View>
      ))}

      <Text style={styles.label}>Enter Vehicle Number</Text>
      <TextInput
        style={styles.input}
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
        placeholder="Enter vehicle number"
      />

      <View style={styles.totalFineContainer}>
        <Text style={styles.totalFineText}>Total Fine: {totalFine.toFixed(2)} PKR</Text>
      </View>

      <TouchableOpacity style={styles.issueButton} onPress={handleIssueChallan}>
        <Text style={styles.issueButtonText}>Issue Challan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008b8b',
    textAlign: 'center',
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  violationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  totalFineContainer: {
    marginTop: 15,
    backgroundColor: '#ffe0e0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  totalFineText: {
    color: '#d00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  issueButton: {
    backgroundColor: '#008b8b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  issueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateChallan;
