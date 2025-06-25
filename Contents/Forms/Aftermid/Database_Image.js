import React, { useEffect, useState } from 'react'
import { View, Image } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker'
import {openDatabase} from 'react-native-sqlite-storage'

const Database_Image = () => {
    const db=openDatabase({name:'Employees.db'})
    useEffect(()=>{
        db.transaction(txl=>{
            txl.executeSql(
                'create table if not exists Emp'+
                '(empId integer primary key AUTOINCREMENT,name text,city text,age integer,department text,path text)',
                [],
                ()=>{console.log("Table created successfully");},
                (err)=>{console.log("Error creating table");
                }
            )
        })
    },[])

    const [myImage,setMyImage]=useState(null)
    const [name,setName]=useState('')
    const [city,setCity]=useState('')
    const [age,setAge]=useState()
    const [department,setDepartment]=useState('')

    const  addImage=()=>{
        const opt={mediaType:'photo'}
        ImagePicker.launchImageLibrary(opt,(resp)=>{
            setMyImage(resp.assets[0].uri)
        })
    }

    const insertEmployee=()=>{
        let query='insert into Emp (name,city,age,department,path) values (?,?,?,?,?)'
        db.transaction(txl=>{
            txl.executeSql(
                query,[name,city,age,department,myImage],
            ()=>{console.log('Data inserted sucessfully');},
            (e)=>{console.log(e.message);}
            )
        })
    }

    return (
        <View style={{flex:1}}>
            <View style={{ width: '50%', alignSelf: 'center',margin:10 }}>
                <Image style={{ width: 150, height: 150,backgroundColor:'grey',margin:10 }} source={{ uri: myImage }}></Image>
                <Button mode='elevated' onPress={addImage}>+Image</Button>
            </View>
            <View style={{ flex: 1 ,flexDirection: 'row' }}>
                <View style={{borderWidth:1,width:'75%'}}>
                    <TextInput placeholder='Name' style={{ margin: 10, borderWidth: 1, fontSize: 25 }} onChangeText={setName}></TextInput>
                    <TextInput placeholder='City' style={{ margin: 10, borderWidth: 1, fontSize: 25 }}  onChangeText={setCity}></TextInput>
                    <TextInput placeholder='Age' style={{ margin: 10, borderWidth: 1, fontSize: 25 }}  onChangeText={setAge}></TextInput>
                    <TextInput placeholder='Department' style={{ margin: 10, borderWidth: 1, fontSize: 25 }}  onChangeText={setDepartment}></TextInput>
                </View>
                <View>
                    <Button mode='elevated' onPress={insertEmployee}>Save</Button>
                </View>
            </View>

        </View>
    );
}
export default Database_Image;