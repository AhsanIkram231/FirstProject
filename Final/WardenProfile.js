import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WardenProfile = ({ route }) => {
  const { warden } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Traffic Warden Profile</Text>
      </View>

      {/* Profile Circle */}
      <View style={styles.profileCircle} />

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.row}>
          <Text style={styles.label}>👤 Name:</Text>
          <Text style={styles.value}>{warden.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>🎖 Badge Number:</Text>
          <Text style={styles.value}>{warden.badge_number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>🆔 CNIC:</Text>
          <Text style={styles.value}>{warden.cnic}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>✉️ Email:</Text>
          <Text style={styles.value}>{warden.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>📞 Mobile:</Text>
          <Text style={styles.value}>{warden.mobile_number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>🏙️ City:</Text>
          <Text style={styles.value}>{warden.city_Name}</Text>
        </View>
      </View>


{/* Back Button */}
<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
  <Text style={styles.backButtonText}>⬅️ Back</Text>
</TouchableOpacity>

      {/* Bottom Navigation
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('WardenDashboard', { warden })}
        >
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
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008b8b',
  },
  header: {
    backgroundColor: '#006666',
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileCircle: {
    width: 100,
    height: 100,
    backgroundColor: '#ccecec',
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 20,
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#006666',
    width: 130,
  },
  value: {
    color: '#333',
    flexShrink: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#006666',
    paddingVertical: 10,
    marginTop: 'auto',
  },
  backButton: {
    backgroundColor: '#004d4d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
    marginTop: 'auto',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default WardenProfile;
