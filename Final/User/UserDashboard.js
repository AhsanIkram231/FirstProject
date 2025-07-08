import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';

const UserDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [user, setUser] = useState(null);
  const [totalFine, setTotalFine] = useState(0);
  const [totalViolations, setTotalViolations] = useState(0);
  const [hasUnread, setHasUnread] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.cnic) {
      const timer = setTimeout(() => {
        fetchViolations();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    let interval;

    if (isFocused && user?.id) {
      fetchUnreadStatus();
      interval = setInterval(() => {
        fetchUnreadStatus();
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isFocused, user]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${global.furl}userbyid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId })
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        alert(data.error || 'Failed to load user');
      }
    } catch (err) {
      alert('Error fetching user info');
    }
  };

  const fetchViolations = async () => {
    try {
      const response = await fetch(`${global.furl}getchallans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ violator_cnic: user.cnic })
      });
      const data = await response.json();
      if (response.ok) {
        setTotalViolations(data.length);
        const fine = data.reduce((sum, challan) => sum + Number(challan.fine_amount), 0);
        setTotalFine(fine);
      } else {
        alert(data.error || 'Failed to load challans');
      }
    } catch (err) {
      alert('Error fetching challans');
    }
  };

  const fetchUnreadStatus = async () => {
    try {
      const res = await fetch(`${global.furl}getnotifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_type: 'User',
          recipient_id: user.id,
        }),
      });
      const data = await res.json();
      const unread = data.some(n => !n.is_read);
      setHasUnread(unread);
    } catch (err) {
      console.error("Failed to fetch unread status", err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topHeader}>
          <Image source={require('../../assets/images/avatar.jpg')} style={styles.avatar} />
          <Text style={styles.welcome}>Welcome Back, {user?.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Profile</Text>
          <TextInput style={styles.input} editable={false} value={user?.name || ''} />
          <TextInput style={styles.input} editable={false} value={user?.cnic || ''} />
          <Text style={styles.linkText}>Edit Profile Info</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary of Violations</Text>
          <View style={styles.violationHeader}>
            <Text style={styles.label}>Total Fine</Text>
            <Text style={styles.label}>Total Violations: <Text style={styles.redText}>{String(totalViolations).padStart(2, '0')}</Text></Text>
          </View>
          <TextInput
            style={styles.input}
            editable={false}
            value={`${Number(totalFine).toFixed(2)} PKR`}
          />
          <Text style={styles.linkText} onPress={() => navigation.navigate('ViewChallans', { user })}>View Details</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewChallans', { user })}>
          <Text style={styles.buttonText}>View Challans</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TrafficRules')}>
          <Text style={styles.buttonText}>View Traffic Rules</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.navItem} onPress={() => alert('Home pressed')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setHasUnread(false);
            navigation.navigate('UserNotification', { user });
          }}
        >
          <Text style={styles.navIcon}>
            🔔
            {hasUnread && <Text style={{ color: 'red', fontSize: 10, position: 'absolute', top: -5, right: -5 }}>●</Text>}
          </Text>
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('UserProfile', { user })}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => alert('Settings pressed')}>
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
    backgroundColor: '#f7f7f7',
    paddingBottom: 80, // leave space for bottom nav
  },
  scrollContent: {
    padding: 4,
    paddingBottom: 100, // extra space so content isn't hidden behind nav
  },
  topHeader: {
    alignItems: 'center',
    backgroundColor: '#009688',
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 20,
    marginBottom: 10,
  },
  welcome: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  linkText: {
    color: '#009688',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  violationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
  },
  redText: {
    color: 'red',
  },
  button: {
    backgroundColor: '#009688',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    elevation: 10, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  navIcon: {
    fontSize: 24,
    marginBottom: 2,
  },

  navText: {
    fontSize: 12,
    color: '#333',
  },

});

export default UserDashboard;
