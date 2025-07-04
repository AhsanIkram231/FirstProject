import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const WardenDashboard = ({ route }) => {
  const navigation = useNavigation();
  const { warden } = route.params;

  const [wardenDetails, setWardenDetails] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [hasUnread, setHasUnread] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    let interval;

    if (isFocused) {
      fetchUnreadStatus(); // check immediately

      // Set interval to check every 30 seconds
      interval = setInterval(() => {
        fetchUnreadStatus();
      }, 1000);
    }

    // Clear interval when screen is unfocused/unmounted
    return () => clearInterval(interval);
  }, [isFocused]);


  const fetchUnreadStatus = async () => {
    try {
      const res = await fetch(`${global.furl}getnotifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_type: 'TrafficWarden',
          recipient_id: warden.WardenID,
        }),
      });
      const data = await res.json();
      const unread = data.some(n => !n.is_read);
      setHasUnread(unread);
    } catch (err) {
      console.error("Failed to fetch unread status", err);
    }
  };



  useEffect(() => {
    const fetchWardenAndAssignment = async () => {
      try {
        const wardenRes = await fetch(`${global.furl}trafficwarden`);
        const allWardens = await wardenRes.json();

        if (!Array.isArray(allWardens)) throw new Error('Invalid warden list response');

        const matchedWarden = allWardens.find(w => w.id === warden.WardenID);
        if (!matchedWarden) {
          Alert.alert('Error', 'Warden not found');
          return;
        }

        setWardenDetails(matchedWarden);

        const assignmentRes = await fetch(`${global.furl}getassignjobofwardenbyid`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: warden.WardenID }),
        });

        const assignmentData = await assignmentRes.json();
        if (assignmentData.error) throw new Error(assignmentData.error);

        setAssignment(assignmentData.length > 0 ? assignmentData[0] : null);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchWardenAndAssignment();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!wardenDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Warden details not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.menuIcon}>☰</Text>
          <Text style={styles.headerText}>Welcome Back, {wardenDetails.name}</Text>
          <Text style={styles.notificationIcon}
            onPress={() => {
              setHasUnread(false);  // reset dot
              if (warden?.WardenID) {
                navigation.navigate('WardenNotification', { wardenId: warden.WardenID });
              } else {
                Alert.alert('Error', 'Warden ID is missing');
              }
            }}
          >🔔
            {hasUnread && <Text style={styles.redDot}>●</Text>}</Text>
        </View>

        {/* Schedule Card */}
        <View style={styles.scheduleCard}>
          {assignment ? (
            <>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{assignment.chowki_place} - {assignment.chowki_name}</Text>
              <Text style={styles.label}>Shift</Text>
              <Text style={styles.value}>{assignment.shift_name} - {assignment.shift_time}</Text>
              <Text style={styles.label}>Duty Date</Text>
              <Text style={styles.value}>{assignment.duty_date}</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Duty Roster</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.value}>No assignment found for today.</Text>
          )}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (assignment && assignment.chowki_id) {
              navigation.navigate('ViolationHistory', { chowki_id: assignment.chowki_id, WardenID: warden.WardenID, });
            } else {
              Alert.alert('Error', 'No chowki assigned');
            }
          }}
        >
          <Text style={styles.actionText}>View Violations</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (warden?.WardenID) {
              navigation.navigate('ChallanHistory', { wardenId: warden.WardenID });
            } else {
              Alert.alert('Error', 'Warden ID is missing');
            }
          }}
        >
          <Text style={styles.actionText}>Challan History</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.navItem}

        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setHasUnread(false);  // reset dot
            navigation.navigate('WardenNotification', { wardenId: warden.WardenID });
          }}
        >
          <Text style={styles.navIcon}>
            🔔
            {hasUnread && <Text style={styles.redDot}>●</Text>}
          </Text>
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('WardenProfile', { warden: wardenDetails })}
        >
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#008b8b',
  },
  container: {
    flex: 1,
    backgroundColor: '#008b8b',
  },
  scrollContent: {
    padding: 1,
    paddingBottom: 80, // space for footer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#006666',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
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
    right: -5
  },
  scheduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    marginBottom: 10,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#00a5a5',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#00a5a5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#006666',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 22,
    color: '#fff',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});

export default WardenDashboard;
