import { Text, View, StyleSheet, TextInput, Pressable, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {FontAwesome} from '@expo/vector-icons'
import {useState} from 'react'
import LogIn from "../../app/Authentication/LogIn"
import ViewContent from "../../components/ViewContent"
import {useAuth} from '../Authentication/AuthContext'


export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth()
  if (!isAuthenticated){
    return (<LogIn />)
  }
  return (<>
   <Pressable style = {style.button} onPress={logout}><Text>Log Out</Text></Pressable>
          <SafeAreaView style={style.header}>
            <View style={style.profile}>
              <Text style={{ color: "white", fontSize: 30 }}>A</Text>
            </View>

            <Text style={{ alignSelf: "center", color: "white", fontSize: 25 }}>{user.dsplayName}</Text>
            <Text style={{ alignSelf: "center", color: "gray", fontSize: 15 }}>{user.bio} </Text>
          </SafeAreaView>

          <View style={style.body} />

         {/* {isAuthenticated && user && (
          <ViewContent
            id={user._id}
            name={user.displayName}
            bio={user.bio}
            createdAt={user.createdAt}
            lastOnline={user.lastOnline}
            isOnline={user.isOnline}
          />
          )}
          */}
         
    </>
  );
}


const style = StyleSheet.create({
    header:{
        justifyContent: 'flex-end', alignItems: 'center',
        width:'100%',
        height:'30%',
        backgroundColor:'rgb(55, 50, 50)',
    },
    profile:{
    width:80,
    height:80,
    borderRadius:55,
    backgroundColor:'gray',
    justifyContent: 'center',
    alignItems: 'center',
    },
    body:{
        height:'70%',
        backgroundColor:'black',
    },
    button:{
        padding:15,
        backgroundColor:'red',
        borderRadius:8,
        width:'100%',
        marginTop:15,
    },
})