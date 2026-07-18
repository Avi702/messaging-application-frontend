import { Text, View, StyleSheet, TextInput, Pressable, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {FontAwesome} from '@expo/vector-icons'
import {useState} from 'react'
import LogIn from "../../app/Authentication/LogIn"
import ViewContent from "../../components/ViewContent"
export default function Profile(){
    const [setisUser, setUser] = useState(true)
    return(<>{setisUser && <><SafeAreaView style ={style.header}>
            <View style={style.profile}>
                <Text style={{ color: 'white', fontSize: 30, alignSelf: 'center', justifyContent:'center'}}>A</Text>
            </View>
                <Text style ={{alignSelf: 'center', color:'white',fontSize:25,}}>Avneet</Text>
                <Text style = {{alignSelf: 'center', color:'gray',fontSize:15,}}>I like football and soccer</Text>
    </SafeAreaView>
        <ViewContent/></>}
    {!setisUser && <LogIn/>}</>)
}


const style = StyleSheet.create({
    header:{
        flex: 1, justifyContent: 'flex-end', alignItems: 'center',
        width:'100%',
        height:'50%',
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
})