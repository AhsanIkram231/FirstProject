import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const DutyRoster = () => {
  const navigation = useNavigation();
  const [selectedCriteria, setSelectedCriteria] = useState('Proximity to Residence');
  const [assignments, setAssignments] = useState([]);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    fetch(`${global.furl}shift`, {
      method: 'GET',
    })
      .then(res => res.json())
      
      .then(data => {
        console.log('Shifts fetched:', data);
        if (Array.isArray(data)) {
          setShifts(data);
        } else {
          Alert.alert('Error', 'Failed to fetch shifts');
        }
      })
      .catch(err => Alert.alert('Error', err.message));
  }, []);

  const handleAssign = () => {
    console.log('Assign button clicked');

    fetch(`${global.furl}wardenassignments`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        console.log('Response from /wardenassignments:', data);

        if (data.sucessfully && Array.isArray(data.sucessfully)) {
          const parsed = [];

          data.sucessfully.forEach(item => {
            console.log('Processing item:', item);

            const chowki = item.chowki;
            const shiftId = item.shift;
            const wardenList = item.warden;

            console.log('Shift ID from assignment:', shiftId);

            // Find the shift object by matching the ID
            const shiftObj = shifts.find(s => s.id == shiftId);

            console.log('Found Shift Object:', shiftObj);

            // If the shift object is found, map the wardens to the assignments
            wardenList.forEach(warden => {
              parsed.push({
                wardenName: warden.name,
                naka: chowki,
                shift: shiftObj ? shiftObj.name : `Shift ${shiftId}`,    // <-- use 'name' for shift type
                time: shiftObj ? `${shiftObj.start_time} - ${shiftObj.end_time}` : 'N/A',   // <-- format time range
                date: new Date().toLocaleDateString('en-GB')
              });
            });
          });

          console.log('Parsed Assignments:', parsed);
          setAssignments(parsed);
        } else {
          Alert.alert('Error', 'No assignments received');
        }
      })
      .catch(err => {
        console.error('API Error:', err);
        Alert.alert('Error', err.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Duty Roster</Text>
        <Text style={styles.subHeader}>Assign Officers to Chowkis</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Select Criteria:</Text>
        <Picker
          selectedValue={selectedCriteria}
          style={styles.input}
          onValueChange={(itemValue) => setSelectedCriteria(itemValue)}
        >
          <Picker.Item label="Proximity to Residence" value="Proximity to Residence" />
          <Picker.Item label="Seniority" value="Seniority" />
          <Picker.Item label="Random Assignment" value="Random Assignment" />
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleAssign}>
          <Text style={styles.buttonText}>Assign</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>

      {assignments.length > 0 && (
        <ScrollView style={{ paddingHorizontal: 10, paddingBottom: 20 }}>
          <Text style={styles.assignmentTitle}>Assignments:</Text>
          <ScrollView horizontal>
            <View>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.headerCell}>Warden</Text>
                <Text style={styles.headerCell}>Naka</Text>
                <Text style={styles.headerCell}>Shift</Text>
                <Text style={styles.headerCell}>Time</Text>
                <Text style={styles.headerCell}>Date</Text>
              </View>
              <ScrollView style={{ maxHeight: 300 }}>
                {assignments.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.cell}>{item.wardenName}</Text>
                    <Text style={styles.cell}>{item.naka}</Text>
                    <Text style={styles.cell}>{item.shift}</Text>
                    <Text style={styles.cell}>{item.time}</Text>
                    <Text style={styles.cell}>{item.date}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F0' },
  header: {
    backgroundColor: '#2AB9A8',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  subHeader: { fontSize: 14, color: '#FFF' },
  form: { padding: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    borderColor: '#CCC',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#2AB9A8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  backButton: {
    backgroundColor: '#2AB9A8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 16 },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#DDD',
  },
  tableHeader: {
    backgroundColor: '#E0E0E0',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cell: { width: 100, textAlign: 'center', fontSize: 14 },
  headerCell: {
    width: 100,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DutyRoster;
