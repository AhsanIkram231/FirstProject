import { StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
const Welcome = () => {
  const navigation = useNavigation();
 
    return (
        <View style={styles.container}>
          <Image
            source={require('../assets/images/logo.png')} 
            style={styles.icon}
          />
          <Text style={styles.title}>
            <Text style={styles.titlePrimary}>Traffic</Text>
            <Text style={styles.titleSecondary}>Guardian</Text>
          </Text>
          <Text style={styles.subtitle}>Real Time traffic monitoring{'\n'}&{'\n'}Automatic Challan Issuance</Text>
          
          <TouchableOpacity
           style={styles.button}
           onPress={() => navigation.navigate('Role')}
           >
            <Text style={styles.buttonText}>Get Started ➤</Text>
          </TouchableOpacity>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      icon: {
        width: 120,
        height: 120,
        marginBottom: 20,
      },

      title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
      },
      titlePrimary: {
        color: '#4ca7a8',
      },
      titleSecondary: {
        color: '#333',
      },
      subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
      },
      button: {
        backgroundColor: '#4ca7a8',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        alignItems: 'center',
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
    });

export default Welcome;