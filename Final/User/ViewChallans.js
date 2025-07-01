import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ViewChallans = () => {
  const route = useRoute();
  const { user } = route.params;

  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallans();
  }, []);

  const fetchChallans = async () => {
    try {
      const response = await fetch(`${global.furl}getchallans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ violator_cnic: user.cnic })
      });

      const data = await response.json();
      if (response.ok) {
        setChallans(data);
      } else {
        alert(data.error || 'Failed to load challans');
      }
    } catch (err) {
      alert('Error fetching challans');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Challan History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#009688" />
      ) : (
        <ScrollView>
          {challans.length === 0 ? (
            <Text style={styles.noData}>No challans found.</Text>
          ) : (
            challans.map(challan => (
              <View key={challan.id} style={styles.card}>
                <Text style={styles.label}>Vehicle Number: <Text style={styles.value}>{challan.vehicle_number}</Text></Text>
                <Text style={styles.label}>Violator Name: <Text style={styles.value}>{challan.violator_name}</Text></Text>
                <Text style={styles.label}>CNIC: <Text style={styles.value}>{challan.violator_cnic}</Text></Text>
                <Text style={styles.label}>Date: <Text style={styles.value}>{new Date(challan.challan_date).toLocaleDateString()}</Text></Text>
                <Text style={styles.label}>Status: <Text style={[styles.value, challan.status === 'Pending' ? styles.pending : styles.issued]}>{challan.status}</Text></Text>
                <Text style={styles.label}>Total Fine: <Text style={styles.value}>{challan.fine_amount} PKR</Text></Text>
                <Text style={styles.label}>Violations:</Text>
                {challan.violation_details.map((v, i) => (
                  <Text key={i} style={styles.violationItem}>- {v.violation} ({v.fine} PKR)</Text>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2f2f2'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#009688'
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#333'
  },
  value: {
    fontWeight: 'normal',
    color: '#555'
  },
  violationItem: {
    marginLeft: 10,
    color: '#444'
  },
  pending: {
    color: 'red',
    fontWeight: 'bold'
  },
  issued: {
    color: 'green',
    fontWeight: 'bold'
  }
});

export default ViewChallans;
