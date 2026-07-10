import {Image,ImageBackground, StyleSheet, View, Text} from 'react-native'
import React from 'react'
import {Tabs} from "expo-router"
import {FontAwesome} from '@expo/vector-icons'

interface Conversation{
    title: string,
    date: string,
    cur_user: string,
    to_user: string,
}
export default function Chat({title, date, cur_user, to_user}:Conversation){
    return (
    <View style = {style.container}>
        <View style={style.profile}>
            <Text style={{ color: 'white', fontSize: 24 }}>{to_user[0].toUpperCase()}</Text>
        </View>
        <View>
            <View>
            </View>
            <View>
            </View>
        </View>
    </View>)
}

const style = StyleSheet.create({
    container:{

    },
    profile:{
    width:80,
    height:80,
    borderRadius:30,
    backgroundColor:'gray',
  },
})