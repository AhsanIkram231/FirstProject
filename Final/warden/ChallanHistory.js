import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused, useNavigation } from '@react-navigation/native';

const ChallanHistory = ({ route }) => {
    const { wardenId } = route.params;
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const [challans, setChallans] = useState([]);
    const [filteredChallans, setFilteredChallans] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchText, setSearchText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [challanDate, setChallanDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (isFocused) fetchChallans();
    }, [isFocused]);

    useEffect(() => {
        applyFilters();
    }, [searchText, selectedStatus, challanDate, challans]);

    const fetchChallans = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${global.furl}getchallans`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ warden_id: wardenId })
            });

            const data = await res.json();
            if (data.error || data.message === 'No challan records found.') {
                Alert.alert('Info', data.error || data.message);
                setChallans([]);
            } else {
                setChallans(data || []);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch challans.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...challans];

        if (searchText.trim()) {
            filtered = filtered.filter(item =>
                item.vehicle_number.toLowerCase().includes(searchText.toLowerCase()) ||
                item.violator_name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (selectedStatus !== 'All') {
            filtered = filtered.filter(item => item.status === selectedStatus);
        }

        if (challanDate) {
            const selectedDateStr = challanDate.toISOString().split('T')[0];
            filtered = filtered.filter(item => item.challan_date === selectedDateStr);
        }

        setFilteredChallans(filtered);
    };

    const formatDate = (date) => date ? date.toLocaleDateString() : 'Select Date';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Challan History</Text>
                <Text style={styles.headerSubtitle}>View and filter issued challans</Text>
            </View>

            <View style={styles.filterContainer}>
                <TextInput
                    placeholder="Search by Name or Vehicle Number"
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                />

                <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>Status:</Text>
                    <Picker
                        selectedValue={selectedStatus}
                        style={styles.picker}
                        onValueChange={setSelectedStatus}
                    >
                        <Picker.Item label="All" value="All" />
                        <Picker.Item label="Paid" value="Paid" />
                        <Picker.Item label="Unpaid" value="Unpaid" />
                    </Picker>
                </View>

                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
                    <Text style={styles.pickerLabel}>Challan Date: {formatDate(challanDate)}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={challanDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowDatePicker(false);
                            if (date) setChallanDate(date);
                        }}
                    />
                )}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
            ) : (
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    {filteredChallans.length === 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#fff' }}>No challans found.</Text>
                    ) : (
                        filteredChallans.map((item, index) => (
                            <View key={index} style={styles.card}>
                                <Text style={styles.label}>
                                    Name: <Text style={styles.value}>{item.violator_name}</Text>
                                </Text>
                                <Text style={styles.label}>
                                    Challan Date: <Text style={styles.value}>{item.challan_date}</Text>
                                </Text>
                                <Text style={styles.label}>
                                    Status:{' '}
                                    <Text style={item.status === 'Unpaid' ? styles.pending : styles.issued}>
                                        {item.status}
                                    </Text>
                                </Text>
                                <Text style={styles.label}>
                                    Vehicle Number: <Text style={styles.value}>{item.vehicle_number}</Text>
                                </Text>

                                {/* Violation Details */}
                                {item.violation_details.map((violation, idx) => (
                                    <View key={idx} style={{ marginTop: 5 }}>
                                        <Text style={styles.label}>
                                            Violation: <Text style={styles.value}>{violation.violation}</Text>
                                        </Text>
                                        <Text style={styles.label}>
                                            Fine: <Text style={styles.value}>Rs. {violation.fine}</Text>
                                        </Text>
                                    </View>
                                ))}

                                <TouchableOpacity
                                    style={styles.detailButton}
                                    onPress={() =>
                                        navigation.navigate('ChallanDetail', {
                                            challan: item,
                                            violation_history_id: item.violation_history_id,
                                        })
                                    }
                                >
                                    <Text style={styles.buttonText}>View Challan Details</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
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
    filterContainer: {
        padding: 10,
        backgroundColor: '#f1f1f1',
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginVertical: 10,
    },
    pickerContainer: {
        marginBottom: 10,
    },
    pickerLabel: {
        fontWeight: 'bold',
        color: '#333',
    },
    picker: {
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    datePicker: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        margin: 10,
    },
    label: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    value: {
        fontWeight: 'normal',
        color: '#444',
    },
    pending: {
        color: 'red',
        fontWeight: 'bold',
    },
    issued: {
        color: 'green',
        fontWeight: 'bold',
    },
    detailButton: {
        backgroundColor: '#2AB9A8',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        right: 20,
        backgroundColor: '#444',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ChallanHistory;
