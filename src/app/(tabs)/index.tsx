import { Text, View, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {FontAwesome} from '@expo/vector-icons'
import Chat from '../../components/Chat'
import {useAuth} from '../Authentication/AuthContext'
import LogIn from "../../app/Authentication/LogIn"
import {useRouter} from 'expo-router'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
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
  const { user, isAuthenticated, loading, logout, authFetch } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [search, setSearch] = useState('')
  useFocusEffect(useCallback(() => {
      let active = true
      async function load(){
        const res = await authFetch('/api/v1/messaging/getChats')
        if (res.ok && active){
          const chats: Conversation[] = await res.json()
          // newest chats first
          chats.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          setConversations(chats)
        }
      }
      load()
      return () => { active = false }
    }, []))

    // wait for the startup token check so we do not flash the login screen
    if (loading){
      return (
        <View style={styles.loading}>
          <ActivityIndicator color="white" />
        </View>
      )
    }

    if (!isAuthenticated){
      return (<LogIn />)
  }

  const visible = conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
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
        {visible.map((c) => (
          <Chat
            key={c._id}
            id={c._id}
            title={c.title}
            createdAt={c.createdAt}
            owner={c.owner}
            members={c.members}
          />
        ))}
        {visible.length === 0 && (
          <Text style={styles.empty}>{search ? 'No conversations found' : 'No conversations yet'}</Text>
        )}
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
loading:{
  flex: 1,
  backgroundColor: 'black',
  justifyContent: 'center',
  alignItems: 'center',
},
empty:{
  color: 'gray',
  fontSize: 16,
  marginTop: 40,
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
