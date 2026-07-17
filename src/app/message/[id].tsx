import { View, Text, ScrollView, StyleSheet, TextInput, Pressable} from 'react-native'
import { Stack, useRouter } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import {FontAwesome} from '@expo/vector-icons'
import { SafeAreaView } from "react-native-safe-area-context";

export default function Message() {
    const { id, name } = useLocalSearchParams()
    const router = useRouter()
    return (
        <>
            <Stack.Screen options={{headerShown: false }} />
            <View style = {style.header}>
                <Pressable style = {{borderWidth: 1, borderColor:'gray', borderRadius:30,alignSelf:'flex-start',justifyContent:'flex-start', padding:10,}} onPress={()=>router.back()}>
                <Text style = {{alignSelf:'flex-start',justifyContent:'flex-start', color:'lightblue', fontSize:15}}>Go Back</Text>
                </Pressable>
                <View style={style.profile}>
                        <Text style={{ color: 'white', fontSize: 30, alignSelf: 'center', justifyContent:'center'}}>{name[0].toUpperCase()}</Text>
                </View>
                <Text style ={{alignSelf: 'center', color:'white',fontSize:25,}}>{name}</Text>
            </View>
            <SafeAreaView style={{ padding:10, height: '78%',backgroundColor: 'black' }}>
                <ScrollView>
                    {/*message*/}
                </ScrollView>
                <View style = {style.textbox}>
                    <TextInput style = {style.input}></TextInput>
                    <Pressable style={style.fab} onPress={() => {console.log("Clicked")}}>
                        <FontAwesome name="paper-plane" variant="regular" size={21} color="white" />
                    </Pressable>
                </View>
            </SafeAreaView>
        </>
    )
}

const style = StyleSheet.create({
    header:{
        padding:10,
        flex: 1, justifyContent: 'flex-end', alignItems: 'center',
        width:'100%',
        height:'22%',
        backgroundColor:'rgb(55, 50, 50)'
    },
    profile:{
    width:80,
    height:80,
    borderRadius:55,
    backgroundColor:'gray',
    justifyContent: 'center',
    alignItems: 'center',
    },
    textbox:{
    flexDirection: 'row',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    height: 35,
    width: "95%",
    backgroundColor: "rgba(40, 38, 38, 1)",
    },
    input: {
    flex: 1,
    color: 'white',
    marginLeft: 8,
    paddingHorizontal: 10,
    },
    fab:{
        justifyContent:'center',
        paddingHorizontal:10,
    }
});