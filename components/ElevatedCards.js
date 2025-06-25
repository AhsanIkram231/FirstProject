import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function ElevatedCards() {
  return (
    <View>
      <Text style={styles.headingText}>Elevated Cards</Text>
      <ScrollView horizontal={true} style={styles.container}>
        <View style={[styles.card,styles.cardsElevated]}>
            <Text>Scroll</Text>
        </View>
        <View style={[styles.card,styles.cardsElevated]}>
            <Text>me</Text>
        </View>
        <View style={[styles.card,styles.cardsElevated]}>
            <Text>to</Text>
        </View>
        <View style={[styles.card,styles.cardsElevated]}>
            <Text>View</Text>
        </View>
        <View style={[styles.card,styles.cardsElevated]}>
            <Text>more....</Text>
        </View>
        <View style={[styles.card,styles.cardsElevated]}>
            <Text>😊</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    headingText: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        color: '#FFFFFF'
    },
    container:{
        padding: 8
    },
    card:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        borderRadius: 4,
        margin: 8
    },
    cardsElevated:{
        backgroundColor: '#CAD5E2',
        elevation: 4,
        shadowOffset:{
            width: 1,
            height: 1
        },
        shadowColor: '#EF5354',
        shadowOpacity: 0.4,
        shadowRadius: 2
    }
})