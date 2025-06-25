import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function ActionCard() {
    function openWebsites(website){
        Linking.openURL(website)

    }
  return (
    <View>
      <Text style={styles.headingText}>Action Card</Text>
        <View style={[styles.card,styles.cardsElevated]}>
            <View style={styles.headingContainer}>
                <Text style={styles.headerText}>Whats New in 2024</Text>
            </View>
            <Image 
            source={{
                uri:'https://picsum.photos/200/300?grayscale'
            }}
            style={styles.cardImage}
            />
            <View style={styles.bodyContainer}>
                <Text numberOfLines={2}>nausasucasnasncusca scsuidsnc sjiajcasncasuchu dcsudhcs csdusdhsdjcsusdj csdusdsd cjsdu
                    kkasjasxma asaksmask isj ladkcadkcdc sdcjksdk csdcjsdicjs sdcsdijc
                </Text>
            </View>
            <View style={styles.footerContainer}>
                <TouchableOpacity onPress={() => openWebsites('https://www.youtube.com/watch?v=hHuG7FIKgtc')}>
                <Text style={styles.socialLinks}>Read more!</Text> 
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openWebsites('https://www.youtube.com/watch?v=hHuG7FIKgtc')}>
                <Text style={styles.socialLinks}>Follow Me!</Text> 
                </TouchableOpacity>
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
    card: {
        width: 400,
        height:360,
        borderRadius: 6,
        marginVertical: 12,
        marginHorizontal:16,
        
        
        
    },
    cardsElevated: {
        backgroundColor: '#E07C24',
        elevation: 33,
        shadowOffset:{
            width:1,
            height:1
        },
        shadowColor:'#333',
        shadowOpacity:0.8

    },
    headingContainer:{
        height:40,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems:'center'
    },
    headerText:{
        color:'#000000',
        fontSize:22,
        fontWeight:'bold',
        marginBottom:4
    },
    cardImage: {
        height:190,
        
    },
    bodyContainer: {
        padding:10
    },
    footerContainer: {
        padding:8,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly'
    },
    socialLinks: {
        fontSize:16,
        color:'#000000',
        backgroundColor:'#FFFFFF',
        paddingHorizontal:20,
        paddingVertical:6,
        borderRadius:6

    }
})