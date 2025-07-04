import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const WardenNotification = ({ navigation, route }) => {
  const { wardenId } = route.params;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${global.furl}getnotifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient_type: 'TrafficWarden',
            recipient_id: wardenId,
          }),
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setNotifications(data);

          // Mark unread after 2 seconds
          setTimeout(() => markAllAsRead(data), 2000);
        } else {
          console.error('Unexpected response format:', data);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [wardenId]);

  const markAllAsRead = async (data) => {
    try {
      const unread = data.filter(n => n.is_read === 0 || n.is_read === false);
      await Promise.all(
        unread.map(n =>
          fetch(`${global.furl}notifications/${n.id}/mark`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_read: true }),
          })
        )
      );

      // Update state
      const updated = data.map(n => ({ ...n, is_read: true }));
      setNotifications(updated);
    } catch (err) {
      console.error("Error marking notifications as read", err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.notificationItem, item.is_read ? styles.read : styles.unread]}>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.timestamp}>{item.created_at}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2AB9A8" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2AB9A8',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    marginRight: 10,
  },
  backArrow: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  listContainer: {
    padding: 15,
  },
  notificationItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
  unread: {
    borderLeftWidth: 5,
    borderLeftColor: '#2AB9A8',
  },
  read: {
    opacity: 0.6,
  },
});

export default WardenNotification;
