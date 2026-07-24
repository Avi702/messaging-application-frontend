import { Text, View, StyleSheet, TextInput, Pressable, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {FontAwesome} from '@expo/vector-icons'
import {useState} from 'react'
import {useRouter} from 'expo-router'
export default function LogIn(){
    const router = useRouter()
    const [useName,setName] = useState('')
    const [usePwd,setPwd] = useState('')
    return(<View style={style.container}>
        <Text style = {{color:'white',fontSize:36}}>Welcome Back!</Text>
        <View style={style.form}>
            <Text style={{ color: 'white', fontSize: 20, alignSelf:'center' }}>Email</Text>
            <TextInput placeholder="you@example.com" style={style.input} />

            <Text style={{ color: 'white', fontSize: 20, alignSelf:'center' }}>Password</Text>
            <TextInput placeholder="Password" secureTextEntry style={style.input} />
            <Pressable style = {style.buttons}><Text style={{ color: 'white', fontSize: 15, alignSelf:'center' }}>Log In</Text></Pressable>
            <Pressable style={style.buttons} onPress={() => router.push('/Authentication/SignUp')}>
                <Text style={{ color: 'white', fontSize: 15, alignSelf:'center' }}>Sign Up</Text>
            </Pressable>
        </View>
        

    </View>)
}

const style = StyleSheet.create({
    header:{
        padding:10,
        flex: 1, justifyContent: 'flex-end', alignItems: 'center',
        width:'100%',
        height:'22%',
    },
    container:{
        height:'100%',
        backgroundColor:'black',
        alignItems:'center',
        justifyContent:'center',
        padding:25,
    }, 
    form:{
        borderWidth:2,
        borderColor:'lightblue',
        borderRadius:8,
        height:400,
        width:'100%',
        padding:25,
        alignItems:'center',
        justifyContent:'center',
        gap:18,
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