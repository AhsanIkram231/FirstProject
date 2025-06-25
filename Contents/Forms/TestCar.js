import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import { RadioButton, Button } from "react-native-paper";

const task = () => {
    const [radioBtn, setRadioBtn] = useState(false)
    const [inputData, setInputData] = useState('')
    const [parkedInData, setParkedInData] = useState([])
    const [parkedOutData, setParkedOutData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [totalParkedIn, setTotalParkedIn] = useState(0)
    const [totalEarnings, setTotalEarnings] = useState(0)
    const [isParkedOut, setIsParkedOut] = useState(false)
    const [allBtnColor, setAllBtnColor] = useState('skyblue')
    const [bikeBtnColor, setbikeBtnColor] = useState('grey')
    const [carBtnColor, setcarBtnColor] = useState('grey')
    const [parkedOutBtnColor, setParkedOutBtnColor] = useState('grey')

    const displayAllParkedIn = ({ item }) => {
        return (
            <View style={{ borderWidth: 2, borderRadius: 5, margin: 10, padding: 10, flexDirection: "row", justifyContent: 'space-between' }}>
                <View>
                    <Text style={{ fontWeight: '900', color: 'black' }}>{item['vehicleNumber']}</Text>
                    <Text>{item['vehicleType']}</Text>
                </View>
                <View>
                    <Button mode="contained" textColor="blue" style={{ backgroundColor: 'silver' }} onPress={
                        () => {
                            const temp_arr = parkedInData.filter((val) => val['vehicleNumber'] != item['vehicleNumber'])
                            setParkedInData(temp_arr)
                            setParkedOutData([...parkedOutData, item])
                            if (item['vehicleType']=='Car')
                                setTotalEarnings(totalEarnings + 10)
                            else
                                setTotalEarnings(totalEarnings + 5)
                            setTotalParkedIn(totalParkedIn - 1)
                            setFilteredData(temp_arr);
                        }
                    }>Park Out</Button>
                </View>
            </View>
        );
    }

    const displayAllParkedOut = ({ item }) => {
        return (
            <View style={{ borderWidth: 2, borderRadius: 5, margin: 10, padding: 10, flexDirection: "row", justifyContent: 'space-between' }}>
                <View>
                    <Text style={{ fontWeight: '900', color: 'black' }}>{item['vehicleNumber']}</Text>
                    <Text>{item['vehicleType']}</Text>
                </View>
            </View>
        );
    }


    return (
        <View>
            <View>
                <Text style={ss.title}>Car Parking System</Text>
            </View>
            <View>
                <TextInput placeholder="Vehicle Number" placeholderTextColor={'black'} style={ss.input} onChangeText={setInputData}></TextInput>
            </View>
            <View style={ss.radio}>
                <View style={ss.radio}>
                    <View>
                        <RadioButton status={radioBtn ? 'checked' : "unchecked"} onPress={() => setRadioBtn(!radioBtn)}></RadioButton>
                    </View>
                    <View style={{ alignSelf: 'center' }}>
                        <Text>Car</Text>
                    </View>
                    <View >
                        <RadioButton status={radioBtn ? 'unchecked' : "checked"} onPress={() => setRadioBtn(!radioBtn)}></RadioButton>
                    </View>
                    <View style={{ alignSelf: 'center' }}>
                        <Text>Bike</Text>
                    </View>
                </View>
                <View>
                    <Button mode="contained" textColor="blue" style={{ backgroundColor: 'silver' }} onPress={
                        () => {
                            console.log(inputData);
                            vehicleType = 'Bike'
                            if (radioBtn)
                                vehicleType = 'Car'
                            console.log(vehicleType);
                            setParkedInData([...parkedInData, { 'vehicleNumber': inputData, 'vehicleType': vehicleType }])
                            setFilteredData([...parkedInData, { 'vehicleNumber': inputData, 'vehicleType': vehicleType }])
                            setTotalParkedIn(totalParkedIn + 1)
                        }
                    }>Park In</Button>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <View>
                    <Button mode="contained" textColor="blue" style={{ backgroundColor: allBtnColor }} onPress={
                        () => {
                            setAllBtnColor('skyblue')
                            setbikeBtnColor('grey')
                            setcarBtnColor('grey')
                            setParkedOutBtnColor('grey')
                            setIsParkedOut(false)
                            setFilteredData([...parkedInData])
                        }
                    }>All</Button>
                </View>
                <View>
                    <Button mode="contained" textColor="blue" style={{ backgroundColor: bikeBtnColor }} onPress={
                        () => {
                            setAllBtnColor('grey')
                            setbikeBtnColor('skyblue')
                            setcarBtnColor('grey')
                            setParkedOutBtnColor('grey')
                            setIsParkedOut(false)
                            let temp_bikes = []
                            for (ind of parkedInData) {
                                if (ind['vehicleType'] == 'Bike')
                                    temp_bikes[temp_bikes.length] = ind
                            }  
                            setFilteredData(temp_bikes)
                        }
                    }>Bike</Button>
                </View>
                <View>
                    <Button mode="contained" textColor="blue" style={{ backgroundColor: carBtnColor }} onPress={
                        () => {
                            setAllBtnColor('grey')
                            setbikeBtnColor('grey')
                            setcarBtnColor('skyblue')
                            setParkedOutBtnColor('grey')
                            setIsParkedOut(false)
                            let temp_bikes = []
                            for (ind of parkedInData) {
                                if (ind['vehicleType'] == 'Car')
                                    temp_bikes[temp_bikes.length] = ind
                            }               
                            setFilteredData(temp_bikes)
                        }
                    }>Car</Button>
                </View>
                <View>
                    <Button mode="contained" textColor="blue" style={{ backgroundColor: parkedOutBtnColor }} onPress={
                        () => {
                            setAllBtnColor('grey')
                            setbikeBtnColor('grey')
                            setcarBtnColor('grey')
                            setParkedOutBtnColor('skyblue')
                            setIsParkedOut(true)
                            setParkedOutData([...parkedOutData])
                        }
                    }>Parked Out</Button>
                </View>
            </View>
            <View style={{ margin: 10, flexDirection: "row", justifyContent: 'space-between' }}>
                <View>
                    <Text>Total Parked in: {totalParkedIn}</Text>
                </View>
                <View>
                    <Text>Total Earnings: {totalEarnings}</Text>
                </View>
            </View>
            {
                isParkedOut==false &&
                <FlatList data={filteredData} renderItem={displayAllParkedIn}></FlatList>
            }
            {
                isParkedOut &&
                <FlatList data={parkedOutData} renderItem={displayAllParkedOut}></FlatList>
            }
        </View>
    );
}

const ss = StyleSheet.create({
    title: {
        color: 'black',
        backgroundColor: 'purple',
        padding: 10
    },
    input: {
        margin: 10,
        borderColor: 'silver',
        borderWidth: 2
    },
    radio: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5
    }
})
export default task