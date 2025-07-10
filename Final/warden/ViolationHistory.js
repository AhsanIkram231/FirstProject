import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused } from '@react-navigation/native';  // 👈 Add this

const ViolationHistory = ({ route, navigation }) => {
    const { chowki_id , WardenID } = route.params;
    const isFocused = useIsFocused();  // 👈 Track if screen is focused

    const [violations, setViolations] = useState([]);
    const [filteredViolations, setFilteredViolations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchText, setSearchText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedViolationType, setSelectedViolationType] = useState('All');
    const [allViolationTypes, setAllViolationTypes] = useState([]);

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);

    // Re-fetch when screen comes into focus
    useEffect(() => {
        if (isFocused) {
            fetchViolations();
        }
    }, [isFocused]);

    // Apply filters every time inputs change
    useEffect(() => {
        applyFilters();
    }, [searchText, selectedStatus, selectedViolationType, fromDate, toDate, violations]);

    const fetchViolations = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${global.furl}getviolationsrecord_for_nakaid`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chowki_id }),
            });

            const data = await res.json();
            if (data.error || data.message === 'No violation records found.') {
                Alert.alert('Info', data.error || data.message);
                setViolations([]);
            } else {
                setViolations(data.violation_histories || []);
                const types = new Set();
                data.violation_histories?.forEach(item =>
                    item.violation_details?.forEach(v => types.add(v.violation_name))
                );
                setAllViolationTypes(['All', ...Array.from(types)]);
            }
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

//     const fetchViolations = async () => {
//     setLoading(true);
//     try {
//         const res = await fetch(`${global.furl}getviolationsrecord_for_nakaid`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ chowki_id }),
//         });

//         const data = await res.json();
//         if (data.error || data.message === 'No violation records found.') {
//             Alert.alert('Info', data.error || data.message);
//             setViolations([]);
//         } else {
//             const sortedData = (data.violation_histories || []).sort(
//                 (a, b) => new Date(b.violation_datetime) - new Date(a.violation_datetime)
//             );
//             setViolations(sortedData);
//             const types = new Set();
//             sortedData.forEach(item =>
//                 item.violation_details?.forEach(v => types.add(v.violation_name))
//             );
//             setAllViolationTypes(['All', ...Array.from(types)]);
//         }
//     } catch (err) {
//         Alert.alert('Error', err.message || 'Failed to fetch data');
//     } finally {
//         setLoading(false);
//     }
// };


    const applyFilters = () => {
        let filtered = [...violations];

        if (searchText.trim()) {
            filtered = filtered.filter(item =>
                item.licenseplate.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (selectedStatus !== 'All') {
            filtered = filtered.filter(item => item.status === selectedStatus);
        }

        if (selectedViolationType !== 'All') {
            filtered = filtered.filter(item =>
                item.violation_details.some(v => v.violation_name === selectedViolationType)
            );
        }

        if (fromDate) {
            filtered = filtered.filter(item =>
                new Date(item.violation_datetime) >= fromDate
            );
        }

        if (toDate) {
            filtered = filtered.filter(item =>
                new Date(item.violation_datetime) <= toDate
            );
        }

        setFilteredViolations(filtered);
    };

    const formatDateTime = (datetimeStr) => {
        const dt = new Date(datetimeStr);
        return `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`;
    };

    const formatDate = (date) => {
        return date ? date.toLocaleDateString() : 'Select Date';
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Violation History</Text>
                <Text style={styles.headerSubtitle}>
                    View and manage real-time traffic violations
                </Text>
            </View>

            <View style={styles.filterContainer}>
                <TextInput
                    placeholder="Search by Vehicle Number"
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
                        <Picker.Item label="Pending" value="Pending" />
                        <Picker.Item label="Issued" value="issued" /> 
                    </Picker>
                </View>

                <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>Violation Type:</Text>
                    <Picker
                        selectedValue={selectedViolationType}
                        style={styles.picker}
                        onValueChange={setSelectedViolationType}
                    >
                        {allViolationTypes.map((type, index) => (
                            <Picker.Item label={type} value={type} key={index} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.dateRow}>
                    <TouchableOpacity onPress={() => setShowFromDatePicker(true)} style={styles.datePicker}>
                        <Text style={styles.pickerLabel}>From: {formatDate(fromDate)}</Text>
                    </TouchableOpacity>
                    {showFromDatePicker && (
                        <DateTimePicker
                            value={fromDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setShowFromDatePicker(false);
                                if (date) setFromDate(date);
                            }}
                        />
                    )}

                    <TouchableOpacity onPress={() => setShowToDatePicker(true)} style={styles.datePicker}>
                        <Text style={styles.pickerLabel}>To: {formatDate(toDate)}</Text>
                    </TouchableOpacity>
                    {showToDatePicker && (
                        <DateTimePicker
                            value={toDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setShowToDatePicker(false);
                                if (date) setToDate(date);
                            }}
                        />
                    )}
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#fff" />
            ) : (
                <ScrollView>
                    {filteredViolations.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Text style={styles.label}>Vehicle Number: <Text style={styles.value}>{item.licenseplate}</Text></Text>
                            <Text style={styles.label}>Violation Date: <Text style={styles.value}>{formatDateTime(item.violation_datetime)}</Text></Text>
                            <Text style={styles.label}>
                                Status: <Text style={item.status?.toLowerCase() === 'pending' ? styles.pending : styles.issued}>
                                    {item.status?.toLowerCase() === 'pending' ? 'Pending' : 'Issued'}
                                </Text>

                            </Text>



                            <Text style={styles.label}>Violation Type:
                                {item.violation_details.map((v, i) => (
                                    <Text key={i} style={styles.value}> {v.violation_name}</Text>
                                ))}
                            </Text>
                            <Text style={styles.label}>Violation Location: <Text style={styles.value}>{item.location}</Text></Text>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={styles.viewButton}
                                    onPress={() => navigation.navigate('ViewDetails', { violation: item , WardenID})}
                                >
                                    <Text style={styles.buttonText}>View Details</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.createButton}
                                    onPress={() => navigation.navigate('CreateChallan', { violation: item , WardenID })}
                                >
                                    <Text style={styles.buttonText}>Create Challan</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )
            }
        </View >
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
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 10,
    },
    datePicker: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    viewButton: {
        backgroundColor: '#00b894',
        padding: 10,
        borderRadius: 5,
    },
    createButton: {
        backgroundColor: '#0984e3',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ViolationHistory;
