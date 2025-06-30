import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TrafficRules = () => {
  const navigation = useNavigation();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${global.furl}violations`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRules(data);
        } else {
          Alert.alert('Error', data.error || 'Unexpected response');
        }
      })
      .catch(err => {
        Alert.alert('Error', err.message || 'Failed to load rules');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Traffic Rules & Guidelines 🚦</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {rules.map((rule) => (
          <View key={rule.id} style={styles.card}>
            <Text style={styles.ruleTitle}>Rule: {rule.name}</Text>
            <Text style={styles.fine}>Fine: {rule.fines?.[0]?.fine || 'N/A'} PKR</Text>
            <Text style={styles.symbolLabel}>{rule.name} Symbol:</Text>
            <Text style={styles.description}>{rule.description}</Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Back button placed slightly above bottom */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f7',
  },
  header: {
    backgroundColor: '#00bfa5',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scroll: {
    padding: 10,
    paddingBottom: 30,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    width: '100%',
    elevation: 2,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
  },
  fine: {
    fontSize: 14,
    color: '#e74c3c',
    marginVertical: 4,
  },
  symbolLabel: {
    fontWeight: 'bold',
    marginTop: 4,
    color: '#2c3e50',
  },
  description: {
    color: '#555',
    marginVertical: 6,
  },
  button: {
    backgroundColor: '#00bfa5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#00bfa5',
    paddingVertical: 15,
    width: '90%',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TrafficRules;
