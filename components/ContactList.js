import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function ContactList() {
    const Contacts = [
        {
            uid:1,
            name: 'Ahsan ikram',
            status: 'Student',
            imageUrl: 'https://picsum.photos/200/300?grayscale'
        },
        {
            uid:2,
            name: 'Hassan ikram',
            status: 'Student',
            imageUrl: 'https://picsum.photos/200/300?grayscale'
        },
        {
            uid:3,
            name: 'Mohsin',
            status: 'Student',
            imageUrl: 'https://picsum.photos/200/300?grayscale'
        },
        {
            uid:4,
            name: 'Rimsha Churail',
            status: 'Student',
            imageUrl: 'https://picsum.photos/200/300?grayscale'
        },
        {
            uid:5,
            name: 'Haseeb ishtaq',
            status: 'Student',
            imageUrl: 'https://picsum.photos/200/300?grayscale'
        },
        {
            uid:6,
            name: 'iman',
            status: 'Student',
            imageUrl: 'https://picsum.photos/200/300?grayscale'
        },
        {
            uid:7,
            name: 'Zeeshan',
            status: 'Student',
            imageUrl: 'https://picsum.photos/200/300?grayscale'
        },
        {
            uid:8,
            name: 'Fahad',
            status: 'Student',
            imageUrl: 'https://picsum.photos/200/300?grayscale'
        },
        {
            uid:8,
            name: 'Awais',
            status: 'Student',
            imageUrl: 'https://picsum.photos/200/300?grayscale'
        },
        {
            uid:8,
            name: 'Danish',
            status: 'Student',
            imageUrl: 'https://picsum.photos/200/300?grayscale'
        },
    ]
  return (
    <View >
      <Text style={styles.headingText}>Contact List</Text>
      <ScrollView
        style={styles.container}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        
        >
            {Contacts.map(({uid,name,status,imageUrl})=> (
                <View key={uid} style={styles.userCard}>
                    <Image 
                    source={ {
                        uri:imageUrl
                    }}
                    style={styles.userImage}
                    />
                   <View>
                   <Text style={styles.username}>{name}</Text>
                   <Text style={styles.userstatus}>{status}</Text>
                   </View>
                </View>
            ))}
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
        flex: 1,
        paddingHorizontal:16,
        marginBottom:4,
        // height:320
        // padding: 8
        
    },
    userCard:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        marginBottom:3,
        backgroundColor:'#8D3DAF',
        padding:8,
        borderRadius:10

    },
    userImage:{
        height:60,
        width:60,
        borderRadius:60/2,
        marginRight:14
    },
    username: {
        fontSize:16,
        fontWeight:'bold',
        color:'#FFF'
    },
    userstatus: {
        fontSize:12

    }
})