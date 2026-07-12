import {Image,ImageBackground, StyleSheet, View, Text, Pressable} from 'react-native'
import React from 'react'
import {Tabs} from "expo-router"
import {FontAwesome} from '@expo/vector-icons'
import {useRouter} from 'expo-router'
interface Conversation{
    id: number,
    title: string,
    date: string,
    cur_user: string,
    to_user: string,
    last_message: string,
}
export default function Chat({id, title, date, cur_user, to_user, last_message}:Conversation){
    const router = useRouter()
    return (
    <Pressable style = {style.container} onPress={()=>router.push(`/message/${id}?name=${to_user}`)}>
        <View style={style.profile}>
            <Text style={{ color: 'white', fontSize: 30, alignSelf: 'center', justifyContent:'center'}}>{to_user[0].toUpperCase()}</Text>
        </View>
        <View style = {style.meta}>
            <View style = {style.name}>
                <Text style = {{color: 'white', fontSize: 25, alignSelf:'flex-start'}}>{to_user}</Text>
            </View>
            <View style = {style.lastmsg}>
                <Text style = {{color: 'gray', fontSize: 15, alignSelf:'center'}}>{last_message}</Text>
            </View>
        </View>
    </Pressable>)
}

const style = StyleSheet.create({
    container:{
        width:'100%',
        flexDirection:'row',
        paddingHorizontal:20,
    },
    profile:{
    width:80,
    height:80,
    borderRadius:55,
    backgroundColor:'gray',
    justifyContent: 'center',
    alignItems: 'center',
    },
  meta:{
    flexDirection:'column',
    paddingHorizontal:20,
  },
  name:{
    justifyContent:'flex-start',
  },
  lastmsg:{
    justifyContent:'center',
  },
})