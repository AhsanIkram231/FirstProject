import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Quiz = () => {
  return (
    <View style={styles.background}>
        <View style={styles.header}>
            <Text style={styles.Quiztaxt}>Quiz</Text>
        </View>
        
    </View>
  )
}

const styles = StyleSheet.create({
    background:{
        flex: 1,
    backgroundColor: '#fff',
    },
    header:{
        backgroundColor:'orange',
        marginBottom:10
    },
    Quiztaxt:{
        textAlign:'center',
        fontSize:30,
        paddingBottom:10,
        fontWeight:'bold'
    }
})

export default Quiz