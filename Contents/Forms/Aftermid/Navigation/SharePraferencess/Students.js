import { View, Text,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Students = () => {
    return (
        <View>

        <TouchableOpacity
          style={styles.buttonLarge}
          onPress={() => {}}>
          <Text style={styles.buttonText}>Save Name</Text>
          onPress={()=>{SaveName}}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonLarge}
          onPress={() => {}}>
          <Text style={styles.buttonText}>Save Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonLarge}
          onPress={() => {}}>
          <Text style={styles.buttonText}>Save All Students</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonLarge}
          onPress={() => {}}>
          <Text style={styles.buttonText}>Get Name</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonLarge}
          onPress={() => {}}>
          <Text style={styles.buttonText}>Add Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonLarge}
          onPress={() => {}}>
          <Text style={styles.buttonText}>Add Student</Text>
        </TouchableOpacity>
        </View>

    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008b8b',
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
})
export default Students