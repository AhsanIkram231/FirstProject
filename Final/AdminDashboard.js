import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const AdminDashboard = ({ route }) => {
  const navigation = useNavigation();
  const admin = route?.params?.warden;

  const [hasUnread, setHasUnread] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    let interval;

    if (isFocused) {
      fetchUnreadStatus(); // check immediately
      interval = setInterval(fetchUnreadStatus, 2000);
    }

    return () => clearInterval(interval);
  }, [isFocused]);

  const fetchUnreadStatus = async () => {
    try {
      const res = await fetch(`${global.furl}getnotifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_type: 'Admin',
          recipient_id: admin?.id,
        }),
      });
      const data = await res.json();
      const unread = data.some(n => !n.is_read);
      setHasUnread(unread);
    } catch (err) {
      console.error('Failed to fetch unread status', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.menuIcon}>☰</Text>
        <Text style={styles.headerText}>Welcome Back, Admin</Text>
        <TouchableOpacity onPress={() => {
          setHasUnread(false);
          navigation.navigate('WardenNotification', { wardenId: admin?.id, recipientType: 'Admin' });
        }}>
          <Text style={styles.notificationIcon}>🔔{hasUnread && <Text style={styles.redDot}>●</Text>}</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.profileImage}
        />
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonGroup}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.buttonSmall}
            onPress={() => navigation.navigate('ManageWarden')}>
            <Text style={styles.buttonText}>Manage Warden</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSmall}
            onPress={() => navigation.navigate('ManageCamera')}>
            <Text style={styles.buttonText}>Manage Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSmall}
            onPress={() => navigation.navigate('ManageNaka')}>
            <Text style={styles.buttonText}>Manage  Naka</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.buttonLarge}
          onPress={() => navigation.navigate('DutyRoster')}
        >
          <Text style={styles.buttonText}>Duty Roster</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonLarge}
          onPress={() => navigation.navigate('ManageCity')}>
          <Text style={styles.buttonText}>Manage City</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonLarge}
          onPress={() => navigation.navigate('ManagePlace')}>
          <Text style={styles.buttonText}>Manage Place</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonLarge}
          onPress={() => navigation.navigate('ManageDirection')}
        >
          <Text style={styles.buttonText}>Manage Direction</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonLarge}
          onPress={() => navigation.navigate('ManageViolations')}
        >
          <Text style={styles.buttonText}>Manage Violations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonLarge}
          onPress={() => navigation.navigate('ManageShift')}
        >
          <Text style={styles.buttonText}>Manage Shift</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonLarge}
          onPress={() => navigation.navigate('CameraUpload')}
        >
          <Text style={styles.buttonText}>Camera Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.navItem}
          onPress={() => navigation.navigate('CameraDetection')}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => {
          setHasUnread(false);
          navigation.navigate('AdminNotification', { wardenId: admin?.id });
        }}>
          <Text style={styles.navIcon}>🔔{hasUnread && <Text style={styles.redDot}>●</Text>}</Text>
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}
        onPress={() => navigation.navigate('AdminProfile', { admin })}>
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
    backgroundColor: '#008b8b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#006666',
  },
  menuIcon: {
    color: '#fff',
    fontSize: 24,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationIcon: {
    color: '#fff',
    fontSize: 24,
  },
  redDot: {
    fontSize: 10,
    color: 'red',
    position: 'absolute',
    top: -5,
    right: -5,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  buttonGroup: {
    flex: 1,
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonSmall: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#00a5a5',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonLarge: {
    backgroundColor: '#00a5a5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
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

export default AdminDashboard;
