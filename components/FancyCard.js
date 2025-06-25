import { Image, StyleSheet, Text, View } from 'react-native'

import React from 'react'


export default function FancyCard() {
  return (
    <View>
      <Text style={styles.headingText}>Fancy Card</Text>
      <View style={[styles.card,styles.cardsElevated]}>
        <Image 
        source={{
           uri:'https://picsum.photos/200/300?grayscale'
        }}
        style={styles.cardImage}        
        />
        <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Field in form</Text>
            <Text style={styles.cardLabel}>Pink City</Text>
            <Text style={styles.cardDiscreption}>The corn crops are waving in the field</Text>
            <Text style={styles.cardFooter}>12min away</Text>
        </View>
      </View>
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
    card:{
        width: 400,
        height: 360,
        borderRadius: 6,
        marginHorizontal:16,
        marginVertical: 12
        
    },
    cardsElevated:{
        backgroundColor:'#FFFFFF',
        elevation: 33,
        shadowOffset:{
            width:1,
            height:1
        }
    },
    cardImage: {
        height:180,
        marginBottom: 8,
        borderTopLeftRadius:6,
        borderTopRightRadius:6

        
    },
    cardBody:{
        flex:1,
        flexGrow:1,
        paddingHorizontal:12
    },
    cardTitle:{
        color:'#000000',
        fontSize:22,
        fontWeight:'bold',
        marginBottom:4
    },
    cardLabel:{
        color:'#000000',
        fontSize:18,
        marginBottom:6
        
    },
    cardDiscreption:{
        color:'#242B2E',
        fontSize:12,
        marginBottom:12,
        flexShrink:1,
        marginTop:6

    },
    cardFooter:{
        color:'#000000'
    }
    
})