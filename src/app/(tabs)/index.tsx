import { Text, View, StyleSheet, TextInput, Pressable, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {FontAwesome} from '@expo/vector-icons'
import Chat from '../../components/Chat'
import {useAuth} from '../Authentication/AuthContext'
import LogIn from "../../app/Authentication/LogIn"
import {useRouter} from 'expo-router'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import * as SecureStore from 'expo-secure-store'
import {useState, useEffect} from 'react'

type Conversation = {
  _id: string
  title: string
  createdAt: string
  owner: string
  members: string[]
}

export default function Index(){
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [search, setSearch] = useState('')
  useFocusEffect(useCallback(() => {
      let active = true
      async function load(){
        const token = await SecureStore.getItemAsync('accessToken')
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/messaging/getChats`, {
          method: 'POST',
          headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
        })
        if (res.ok && active) setConversations(await res.json())
      }
      load()
      return () => { active = false }
    }, []))

    if (!isAuthenticated){
      return (<LogIn />)
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Search for existing conversations/users */}
      <View style = {styles.search}>
        <TextInput style = {styles.input} value={search} onChangeText={setSearch} placeholder = 'Search'></TextInput>
        <Pressable onPress={() => {console.log("Clicked")}}>
          <FontAwesome name ="search" size={19} color='white'/></Pressable>
      </View>
      <Text style = {{color:'white', fontSize: 35, alignSelf: 'flex-start', padding:15}}>Conversations</Text>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {/*Props for all conversations using conversation card */}
        {conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase())).map((c) => (
          <Chat
            key={c._id}
            id={c._id}
            title={c.title}
            createdAt={c.createdAt}
            owner={c.owner}
            members={c.members}
          />
        ))}
      </ScrollView>
      {/* Search for new users with no existing conversation */}
      <Pressable style={styles.fab} onPress={() => router.push(`/message/FindUsers`)}>
        <FontAwesome name="plus" size={24} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    color:"white",
  },
  search: {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'center',
  borderWidth: 1,
  borderColor: 'white',
  borderRadius: 20,
  paddingHorizontal: 10,
  height: 35,
  width: "90%",
  backgroundColor: "rgba(40, 38, 38, 1)",
},

input: {
  flex: 1,
  color: 'white',
  marginLeft: 8,
},
fab:{
  position: 'absolute',
  bottom: 20,
  right: 20,
  width: 50,
  height: 50,
  borderRadius: 25,
  borderWidth: 2,
  borderColor:'lightblue',
  backgroundColor: 'blue',
  justifyContent: 'center',
  alignItems: 'center',
},
});
