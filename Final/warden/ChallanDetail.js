import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

const ChallanDetail = ({ route, navigation }) => {
  const { challan, violation_history_id } = route.params;
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${global.furl}get-images/${violation_history_id}`);
      const data = await res.json();
      if (res.ok && data.image_data) {
        setImages(data.image_data);
      } else {
        console.warn(data.message || 'No image data found');
        setImages([]);
      }
    } catch (err) {
      console.error('Error fetching images:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Challan Detail</Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Violator Name: <Text style={styles.value}>{challan.violator_name}</Text>
        </Text>
        <Text style={styles.label}>
          Mobile Number: <Text style={styles.value}>{challan.mobile_number}</Text>
        </Text>
        <Text style={styles.label}>
          CNIC: <Text style={styles.value}>{challan.violator_cnic}</Text>
        </Text>
        <Text style={styles.label}>
          Vehicle Number: <Text style={styles.value}>{challan.vehicle_number}</Text>
        </Text>
        <Text style={styles.label}>
          Challan Date: <Text style={styles.value}>{challan.challan_date}</Text>
        </Text>
        <Text style={styles.label}>
          Status:{' '}
          <Text
            style={[
              styles.value,
              challan.status === 'Paid' ? styles.paid : styles.unpaid,
            ]}
          >
            {challan.status}
          </Text>
        </Text>
        <Text style={styles.label}>
          Fine Amount: <Text style={styles.value}>{challan.fine_amount} PKR</Text>
        </Text>
        <Text style={styles.label}>Violation(s):</Text>
        {challan.violation_details?.length > 0 ? (
          challan.violation_details.map((v, idx) => (
            <View key={idx} style={{ marginBottom: 5 }}>
              <Text style={styles.badge}>{v.violation}</Text>
              
            </View>
          ))
        ) : (
          <Text style={styles.value}>No violations listed</Text>
        )}

      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2AB9A8" />
      ) : images.length > 0 ? (
        <ScrollView
          horizontal
          pagingEnabled
          style={styles.imageScroll}
          showsHorizontalScrollIndicator={false}
        >
          {images.map((img, idx) => (
            <View key={idx} style={{ marginRight: 10 }}>
              <Image
                source={{ uri: `${global.furl}uploads/${img.image_path}` }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={{ textAlign: 'center', color: '#666', marginVertical: 10 }}>
          No images available for this violation.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    flex: 1,
    padding: 10,
  },
  backButton: {
    marginVertical: 5,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#008b8b',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008b8b',
    textAlign: 'center',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 5,
  },
  value: {
    fontWeight: 'normal',
    color: '#333',
  },
  badge: {
    backgroundColor: '#f44336',
    color: 'white',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginVertical: 3,
    alignSelf: 'flex-start',
  },
  paid: {
    color: 'green',
    fontWeight: 'bold',
  },
  unpaid: {
    color: 'red',
    fontWeight: 'bold',
  },
  imageScroll: {
    width: '100%',
    height: 400,
    marginTop: 15,
    borderRadius: 10,
  },
  fullImage: {
    width: 300,
    height: 400,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#000',
  },
});

export default ChallanDetail;
