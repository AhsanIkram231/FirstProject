import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserProfile = ({ route }) => {
    const { admin } = route.params;             // same key everywhere
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>User Profile</Text>
            </View>

            {/* Profile Circle */}
            
            <View style={styles.profileCircle}
             />
            
            {/* Profile Card */}
            <View style={styles.profileCard}>
                <View style={styles.row}>
                    <Text style={styles.label}>👤 Name:</Text>
                    <Text style={styles.value}>{admin.name ? admin.name : 'Admin'}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>🎖 Badge Number:</Text>
                    <Text style={styles.value}>{admin.badge_number ? admin.badge_number : "WR-0001"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>🆔 CNIC:</Text>
                    <Text style={styles.value}>{admin.cnic ? admin.cnic : "37405"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>✉️ Email:</Text>
                    <Text style={styles.value}>{admin.email ? admin.email : "abc@gmail.com"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>📞 Mobile:</Text>
                    <Text style={styles.value}>{admin.mobile_number ? admin.mobile_number : "03369479101"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>🏙️ City:</Text>
                    <Text style={styles.value}>{admin.city_Name ? admin.city_Name : "Rawalpindi"}</Text>
                </View>
            </View>


            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>⬅️ Back</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#008b8b',
    },
    header: {
        backgroundColor: '#006666',
        paddingVertical: 15,
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileCircle: {
        width: 100,
        height: 100,
        backgroundColor: '#ccecec',
        borderRadius: 50,
        alignSelf: 'center',
        marginVertical: 20,
    },
    profileCard: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 10,
        padding: 20,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
    },
    label: {
        fontWeight: 'bold',
        color: '#006666',
        width: 130,
    },
    value: {
        color: '#333',
        flexShrink: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#006666',
        paddingVertical: 10,
        marginTop: 'auto',
    },
    backButton: {
        backgroundColor: '#004d4d',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        margin: 20,
        marginTop: 'auto',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    navItem: {
        alignItems: 'center',
    },
    navIcon: {
        fontSize: 24,
        color: '#fff',
    },
    navText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 5,
    },
});

export default UserProfile;
