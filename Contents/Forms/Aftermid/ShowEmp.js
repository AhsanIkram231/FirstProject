import React, { useEffect, useState } from "react";
import { FlatList, Image, ImageBackground, Pressable, Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";
import * as ImagePicker from 'react-native-image-picker'
import { openDatabase } from 'react-native-sqlite-storage'


const ShowEmp = () => {

    const db = openDatabase({ name: 'Employees.db' });
    useEffect(() => {
        db.transaction(txl => {
            txl.executeSql(
                'create table if not exists Emp' +
                '(empId integer primary key AUTOINCREMENT,name text,' +
                'city text, age integer, department text,Path text)',
                [],
                () => { console.log('table CREATED succesfully') },
                (e) => { console.log(e.message) },
            );
        });
    }, [])

    const [myImage, setMyImage] = useState(null)
    const [name, setName] = useState('')
    const [city, setCity] = useState('')
    const [age, setAge] = useState('')
    const [department, setDepartment] = useState('')
    const [allEmployees, setAllEmployees] = useState([])

    const populateList = ({ item }) => {
        return (
            <View>
                <Image
                    source={{ uri: item.Path }}
                    style={{ width: 150, height: 150, }}
                />
                <Text>{item.name} </Text>
                <Text>{item.city} </Text>
                <Text>{item.age} </Text>
            </View>
        );
    }
    const getAllEmployees = () => {
        console.log('Function Executing')
        db.transaction(txl => {
            txl.executeSql(
                'select * from Emp',
                [],
                (txl, resp) => {
                    console.log(resp.rows.length)
                    var tempAllEmployees = [];
                    for (var i = 0; i < resp.rows.length; i++) {
                        console.log(resp.rows.item(i))
                        var emp = {
                            name: resp.rows.item(i).name,
                            city: resp.rows.item(i).city,
                            age: resp.rows.item(i).age,
                            Path: resp.rows.item(i).Path
                        }
                        tempAllEmployees.push(emp)
                    }
                    setAllEmployees(tempAllEmployees)
                },
                (error) => { error.message }
            )
        })
    }
    return (
        <View>
            <Button
                onPress={getAllEmployees}
                mode='elevated'> Show All Employee</Button>
            <FlatList
                data={allEmployees}
                renderItem={populateList}
            />
        </View>
    )
}
export default ShowEmp;