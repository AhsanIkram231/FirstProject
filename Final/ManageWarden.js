import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ManageWarden = () => {
  const navigation = useNavigation();

  const handleAddWarden = () => {
    Alert.alert('Add Warden', 'This will navigate to Add Warden screen.');
  };

  const handleRemoveWarden = () => {
    Alert.alert('Remove Warden', 'This will navigate to Remove Warden screen.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Wardens</Text>
        <Text style={styles.headerSubtitle}>Add or Remove Wardens</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('AddTrafficWarden')}
            >
          <Text style={styles.buttonText}>Add Traffic Warden</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
          onPress={() => navigation.navigate('DeleteTrafficWarden')}
         >
          <Text style={styles.buttonText}>Remove Warden</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>


      {/* Bottom Navigation */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navIcon}>🏠</Text>
                <Text style={styles.navText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navIcon}>🔔</Text>
                <Text style={styles.navText}>Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navIcon}>👤</Text>
                <Text style={styles.navText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navIcon}>⚙️</Text>
                <Text style={styles.navText}>Settings</Text>
              </TouchableOpacity>
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  backButton: { backgroundColor: "#ddd", padding: 12, borderRadius: 5, marginTop: 5 },
  backButtonText: { textAlign: "center", color: "black" },
  header: {
    backgroundColor: '#2AB9A8',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#2AB9A8',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#006666',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
    color: '#fff',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
});

export default ManageWarden;
