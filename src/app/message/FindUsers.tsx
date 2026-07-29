import { View, Alert, Text, ScrollView, StyleSheet, TextInput, Pressable} from 'react-native'
import { Stack, useRouter } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import {FontAwesome} from '@expo/vector-icons'
import { SafeAreaView } from "react-native-safe-area-context";
import {useState, useEffect} from 'react'
import * as SecureStore from 'expo-secure-store'
import {useAuth} from '../Authentication/AuthContext'
import UserCard from '../../components/UserCard'

type PublicUser = {
    _id: string
    displayName: string
    bio: string
    createdAt: string
    lastOnline: string
    isOnline: boolean
}


export default function FindUsers(){
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<PublicUser[]>([])
    const { user, isAuthenticated, logout} = useAuth()
    const [selected, setSelected] = useState<PublicUser[]>([])
    async function createChat(){
        if (selected.length === 0) { Alert.alert('Add at least one user'); return }
        const members = selected.map(s => s._id)
        const title = members.length > 1 ? selected.map(s => s.displayName).join(', ').slice(0, 64) : undefined
        const token = await SecureStore.getItemAsync('accessToken')
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/messaging/createChat`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                 Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(title ? { title, members } : { members }),
        })
        if (!res.ok){
            Alert.alert('Could not create chat'); 
            return
        }
        const chat = await res.json()
        const label = members.length > 1 ? chat.title : selected[0].displayName
        router.replace(`/message/${chat._id}?name=${encodeURIComponent(label)}`)
        
    }
    useEffect(() => {
        if(!query.trim()){
            setResults([]);
            return
        }
        const timer = setTimeout(async () => {
        const token = await SecureStore.getItemAsync('accessToken')
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/users/searchUsers`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ query: query.trim() }),
        })
        if (res.ok){
            setResults(await res.json())
        }},300)
        return () => clearTimeout(timer)
    }, [query])
    return(<><Stack.Screen options={{headerShown: false }} />
    <SafeAreaView style = {style.topBar}>
        <Pressable style = {{borderWidth: 1, borderColor:'gray', borderRadius:30, justifyContent:'center', padding:10,}} onPress={()=>router.back()}>
                <Text style = {{ color:'lightblue', fontSize:15}}>Go Back</Text>
                </Pressable>
        <View style = {style.search}>
                <TextInput style = {style.input} value={query} onChangeText={setQuery} placeholder = 'Search via DisplayName/Email'></TextInput>
                <Pressable onPress={() => {console.log("Clicked")}}>
                  <FontAwesome name ="search" size={19} color='white'/></Pressable>
              </View>
    </SafeAreaView>
    <ScrollView style = {style.header}>
        {results.map((u) => (
            <UserCard
                key={u._id}
                _id={u._id}
                displayName={u.displayName}
                bio={u.bio}
                onAdd={() => setSelected(prev =>
                    prev.some(s => s._id === u._id) ? prev : [...prev, u]
                )}

            />
            ))}
    </ScrollView>
    <View style = {style.footer}>
        {selected.map((v) =>
            <Text key = {v._id} style={{ color: 'white' }}>{v.displayName} ,</Text>)}
            <Pressable style={style.add} onPress={()=>createChat()}>
                            <FontAwesome name="arrow-right" size={40} color="white" />
                        </Pressable>
    </View>

    </>)
}

const style = StyleSheet.create({
    topBar:{
        flexDirection:'row',
        alignItems:'center',
        gap:10,
        padding:10,
        backgroundColor:'black',
    },
    header:{
        flex:1,
        backgroundColor:'black',
    },
    search: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: 'white',
  borderRadius: 20,
  paddingHorizontal: 10,
  height: 35,
  backgroundColor: "rgba(40, 38, 38, 1)",
},

input: {
  flex: 1,
  color: 'white',
  marginLeft: 8,
},
footer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems:'center',
    justifyContent:'flex-start',
    backgroundColor:'black',
    padding:20,
    paddingBottom:50,
},
add:{
        backgroundColor:'blue',
        borderRadius:50,
        width:55,
        height:55,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:'auto',
    },
});