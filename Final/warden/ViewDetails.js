import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';

const ViewDetails = ({ route, navigation }) => {
  const { violation, WardenID } = route.params;
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ViewDetails params:', route.params);

    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${global.furl}get-images/${violation.id}`);
      const data = await res.json();
      if (res.ok) {
        setImages(data.image_data);
      } else {
        console.warn(data.message);
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

      <Text style={styles.title}>Violation Detail</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Violation Date: <Text style={styles.value}>{new Date(violation.violation_datetime).toLocaleString()}</Text></Text>
        <Text style={styles.label}>Violation Location: <Text style={styles.value}>{violation.location}</Text></Text>
        <Text style={styles.label}>Vehicle Number: <Text style={styles.value}>{violation.licenseplate}</Text></Text>
        <Text style={styles.label}>Vehicle Type: <Text style={styles.value}>{violation.vehicle_type}</Text></Text>
        <Text style={styles.label}>Status: <Text style={styles.value}>{violation.status}</Text></Text>
        <Text style={styles.label}>Violations:</Text>
        {violation.violation_details.map((v, idx) => (
          <Text key={idx} style={styles.badge}>{v.violation_name}</Text>
        ))}
      </View>

      {loading ? (
  <ActivityIndicator size="large" color="#2AB9A8" />
) : (
  <ScrollView horizontal pagingEnabled style={styles.imageScroll} showsHorizontalScrollIndicator={false}>
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

)}


      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateChallan', { violation, WardenID })}
        
      >
        <Text style={styles.createButtonText}>Create Challan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateChallan', { violation, WardenID })}
        
      >
        <Text style={styles.createButtonText}>Notify Link Naka</Text>
      </TouchableOpacity>
      
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
  imageScroll: {
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
  },
  createButton: {
    backgroundColor: '#008b8b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageScroll: {
  width: '100%',
  height: 400,
  marginTop: 15,
  borderRadius: 10,
},
fullImage: {
  width: 300, // or Dimensions.get('window').width if you want full screen width
  height: 400,
  marginRight: 10,
  borderRadius: 10,
  backgroundColor: '#000',
},

});

export default ViewDetails;
