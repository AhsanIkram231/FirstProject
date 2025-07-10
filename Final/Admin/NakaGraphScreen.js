import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NakaGraphScreen = () => {
  const navigation = useNavigation();
  const [edgesWithDistance, setEdgesWithDistance] = useState([]);
  const [chowkiNames, setChowkiNames] = useState({});

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchChowkiName = async (id) => {
    try {
      const res = await fetch(`${global.furl}chowkibyid`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }), // 👈 works in React Native
      });
      const data = await res.json();
      return data?.name || `ID-${id}`;
    } catch {
      return `ID-${id}`;
    }
  };

  const fetchGraphData = async () => {
    try {
      const [basicRes, detailRes] = await Promise.all([
        fetch(`${global.furl}nakagrapgforflutter`),
        fetch(`${global.furl}nakagrapg`),
      ]);

      const basicData = await basicRes.json();
      const detailData = await detailRes.json();

      if (!basicRes.ok || !detailRes.ok) {
        throw new Error('Failed to load naka graph');
      }

      const edges = basicData.edges || [];
      const uniqueIDs = new Set();
      edges.forEach((edge) => {
        uniqueIDs.add(edge.from);
        uniqueIDs.add(edge.to);
      });

      const nameMap = {};
      await Promise.all(
        Array.from(uniqueIDs).map(async (id) => {
          const name = await fetchChowkiName(id);
          nameMap[id] = name;
        })
      );

      setChowkiNames(nameMap);

      const mergedEdges = edges.map((edge) => {
        const found = detailData.find(
          (d) => d.FromNakaID === edge.from && d.ToNakaID === edge.to
        );
        return {
          from: edge.from,
          to: edge.to,
          distance: found?.DistanceKM ?? 'N/A',
        };
      });

      setEdgesWithDistance(mergedEdges);
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not load graph data');
    }
  };

  const getEdgeColor = (distance) => {
    if (distance === 'N/A') return '#777';
    if (distance <= 2) return '#4CAF50';
    if (distance <= 5) return '#FFC107';
    return '#F44336';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Naka Graph</Text>
        <Text style={styles.headerSubtitle}>
          Connections with Direction & Distance
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.graphContainer}>
        {edgesWithDistance.map((edge, idx) => (
          <View key={idx} style={styles.edgeRow}>
            <View style={styles.nodeBox}>
              <Text style={styles.nodeText}>
                {chowkiNames[edge.from] || `ID-${edge.from}`}
              </Text>
            </View>

            <Text style={[styles.arrow, { color: getEdgeColor(edge.distance) }]}>
              ➝
            </Text>

            <View style={styles.nodeBox}>
              <Text style={styles.nodeText}>
                {chowkiNames[edge.to] || `ID-${edge.to}`}
              </Text>
            </View>

            <Text
              style={[
                styles.distance,
                { color: getEdgeColor(edge.distance) },
              ]}
            >
              ({edge.distance} KM)
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
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
  graphContainer: {
    padding: 20,
    gap: 12,
  },
  edgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  nodeBox: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: '#2AB9A8',
    borderWidth: 1.5,
    minWidth: 90,
    alignItems: 'center',
  },
  nodeText: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 6,
  },
  distance: {
    fontSize: 13,
    marginLeft: 6,
  },
  backButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#CCC',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NakaGraphScreen;
