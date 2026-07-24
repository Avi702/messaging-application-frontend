import { Text, View, StyleSheet, TextInput, Pressable, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {FontAwesome} from '@expo/vector-icons'
import {useState} from 'react'
import { Label } from "expo-router";
import { Stack, useRouter} from 'expo-router'
export default function SignUp(){
    const router = useRouter()
    return( <><Stack.Screen options={{headerShown: false }} />
        <SafeAreaView style = {style.header}>
                        <Pressable style = {{borderWidth: 1, borderColor:'gray', borderRadius:30,alignSelf:'flex-start',justifyContent:'flex-start', padding:10,}} onPress={()=>router.back()}>
                        <Text style = {{alignSelf:'flex-start',justifyContent:'flex-start', color:'lightblue', fontSize:15}}>Go Back</Text>
                        </Pressable>
        </SafeAreaView>
        <View style={style.container}>

        <Text style = {{color:'white',fontSize:36}}>Sign Up!</Text>
        <View style={style.form}>
            <Text style={{ color: 'white', fontSize: 20, alignSelf:'center' }}>Username</Text>
            <TextInput placeholder="you@example.com" style={style.input} />

            <Text style={{ color: 'white', fontSize: 20, alignSelf:'center' }}>Email</Text>
            <TextInput placeholder="you@example.com" style={style.input} />

            <Text style={{ color: 'white', fontSize: 20, alignSelf:'center' }}>Password</Text>
            <TextInput placeholder="Password" secureTextEntry style={style.input} />

            <Text style={{ color: 'white', fontSize: 20, alignSelf:'center' }}>Confirm Password</Text>
            <TextInput placeholder="Password" secureTextEntry style={style.input} />
            <Pressable style = {style.buttons}><Text style={{ color: 'white', fontSize: 15, alignSelf:'center' }}>Sign Up</Text></Pressable>
        </View>
        

    </View>
    </>)
}

const style = StyleSheet.create({
    header:{
    padding:15,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width:'100%',
    backgroundColor:'black',
},
container:{
    flex: 1,
    backgroundColor:'black',
    alignItems:'center',
    justifyContent:'flex-start',
    paddingTop: 60,
    padding:25,
},


    form:{
        borderWidth:2,
        borderColor:'lightblue',
        borderRadius:8,
        height:'fit-content',
        width:'100%',
        padding:25,
        alignItems:'center',
        justifyContent:'center',
        gap:18,
        alignSelf:'center'
    },
    input:{
        backgroundColor: "rgba(40, 38, 38, 1)",
        color:'white',
        borderRadius:8,
        width:'100%',
        height:35,
        paddingHorizontal:10
    },
    buttons:{
        padding:15,
        backgroundColor:'blue',
        borderRadius:8,
        width:'100%',
        marginTop:15,
    },
})