import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, Alert} from 'react-native'
import { Stack, useRouter } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import {FontAwesome} from '@expo/vector-icons'
import { SafeAreaView } from "react-native-safe-area-context";
import {useState, useEffect, useRef} from 'react'
import {useAuth} from '../Authentication/AuthContext'
import { io, Socket } from 'socket.io-client'

type Message = {
     _id: string; 
     sender: string; 
     textContent: string; 
     createdAt: string
}
export default function Message() {
    const { id, name } = useLocalSearchParams()
    const router = useRouter()
    const { user, authFetch, getValidToken } = useAuth()
    const chatId = typeof id === 'string' ? id : ''
    const label = typeof name === 'string' ? name : ''

    const [owner, setOwner] = useState('')
    const [members, setMembers] = useState<string[]>([])
    const [title, setTitle] = useState(label)
    const [isEditing, setEditing] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const socketRef = useRef<Socket | null>(null)
    const [text, setText] = useState('')
    // cache of sender id to displayName, so group messages show each sender's initial
    const [senderNames, setSenderNames] = useState<{ [id: string]: string }>({})

    // load the chat so we know if it is a group and who owns it
    useEffect(()=>{
        if(!chatId){
            return
        }
        async function loadChat(){
            const res = await authFetch('/api/v1/messaging/getChat', { chatId })
            if(res.ok){
                const chat = await res.json()
                setOwner(chat.owner)
                setMembers(chat.members)
                setTitle(chat.title)
            }
        }
        loadChat()
    },[chatId])



    useEffect(() => {
        let socket: Socket | null = null
        let cancelled = false
        async function connect(){
            // refreshes the token first if it expired, otherwise the socket is rejected
            const token = await getValidToken()
            if (cancelled) return
            if (!token){
                Alert.alert('Your session expired, please log in again')
                return
            }
            socket = io(process.env.EXPO_PUBLIC_API_URL, { auth:{ token }, transports:['websocket'] })
            socketRef.current = socket
            socket.on('connect_error', () => { if (!cancelled) Alert.alert('Lost connection to the chat') })
            socket.emit('chat:open', { chatId })
            socket.emit('message:get', { chatId })
            socket.on('reply:message:get', (res) => { if (res.success) setMessages(res.messages) })
            socket.on('message:new', (res) => { if (res.success) setMessages(prev => prev.some(m => m._id === res.message._id) ? prev : [...prev, res.message]) })
            socket.on('reply:message:send',(res) => { if (res.success) setMessages(prev => prev.some(m => m._id === res.message._id) ? prev : [...prev, res.message]) })
    }
    connect()
    return () => {
        cancelled = true
        socket?.emit('chat:close')
        socket?.disconnect()
    }
    }, [chatId])


    // resolve the display names of any message senders we do not know yet
    useEffect(()=>{
        const unknown = [...new Set(messages.map(m => m.sender))]
            .filter(senderId => senderId !== user?._id && !senderNames[senderId])
        if(unknown.length === 0){
            return
        }
        let cancelled = false
        async function resolve(){
            const entries = await Promise.all(unknown.map(async (senderId) => {
                const res = await authFetch('/api/v1/users/getUserById', { userId: senderId })
                return res.ok ? [senderId, (await res.json()).displayName] as const : null
            }))
            if(cancelled){
                return
            }
            setSenderNames(prev => {
                const next = { ...prev }
                for(const entry of entries){
                    if(entry){
                        next[entry[0]] = entry[1]
                    }
                }
                return next
            })
        }
        resolve()
        return () => { cancelled = true }
    },[messages, user?._id])

    function send(){
        if (text.trim().length < 2){
            return
        }
            socketRef.current?.emit('message:send', { chatId, textContent: text.trim() })
            setText('')
    }


    // only the owner of a group chat can edit the title
    const isGroup = members.length > 1
    const canEdit = isGroup && owner === user?._id
    // groups show the (editable) title, DMs show the other user's name
    const displayTitle = isGroup ? title : label

    async function saveTitle(){
        if(title.length < 3 || title.length > 64){
            Alert.alert('Title must be between 3 and 64 characters')
            return
        }
        const res = await authFetch('/api/v1/messaging/updateChatInformation', { chatId, title })
        if(!res.ok){
            Alert.alert('Could not update the chat')
            return
        }
        setEditing(false)
    }

    return (
        <>
            <Stack.Screen options={{headerShown: false }} />
            <View style = {style.header}>
                <Pressable style = {{borderWidth: 1, borderColor:'gray', borderRadius:30,alignSelf:'flex-start',justifyContent:'flex-start', padding:10,}} onPress={()=>router.back()}>
                <Text style = {{alignSelf:'flex-start',justifyContent:'flex-start', color:'lightblue', fontSize:15}}>Go Back</Text>
                </Pressable>
                <View style={style.profile}>
                        <Text style={{ color: 'white', fontSize: 30, alignSelf: 'center', justifyContent:'center'}}>{displayTitle ? displayTitle[0].toUpperCase() : '?'}</Text>
                </View>
                {isEditing ? (
                    <View style={style.titleRow}>
                        <TextInput style={style.titleInput} value={title} onChangeText={setTitle} autoFocus maxLength={64} />
                        <Pressable onPress={saveTitle}>
                            <FontAwesome name="check" size={20} color="lightblue" />
                        </Pressable>
                    </View>
                ) : (
                    <View style={style.titleRow}>
                        <Text style={{ color:'white', fontSize:25 }}>{displayTitle}</Text>
                        {canEdit && (
                            <Pressable onPress={()=>setEditing(true)}>
                                <FontAwesome name="pencil" size={18} color="lightblue" />
                            </Pressable>
                        )}
                    </View>
                )}
            </View>
            <View style={{ paddingHorizontal:10, paddingBottom:10, height: '78%',backgroundColor: 'black' }}>
                <ScrollView style={{ flex:1 }} contentContainerStyle={{ paddingTop:8, paddingBottom: 90, paddingHorizontal:10, gap:8 }}>
                    {messages.map((m) => {
                        if(m.sender === user?._id){
                            return (
                                <View key={m._id} style={style.mine}>
                                    <Text style={{ color:'white' }}>{m.textContent}</Text>
                                </View>
                            )
                        }
                        // group: each sender's own name; DM: the other user's name
                        const senderName = senderNames[m.sender] || (isGroup ? '' : label)
                        return (
                            <View key={m._id} style={style.theirsRow}>
                                <View style={style.msgAvatar}>
                                    <Text style={style.msgInitial}>{senderName ? senderName[0].toUpperCase() : '?'}</Text>
                                </View>
                                <View style={{ alignItems:'flex-start' }}>
                                    {isGroup ? <Text style={style.senderName}>{senderName}</Text> : null}
                                    <View style={style.theirs}>
                                        <Text style={{ color:'white' }}>{m.textContent}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })}

                </ScrollView>
                <View style = {style.textbox}>
                    <TextInput style={style.input} value={text} onChangeText={setText} />
                    <Pressable style={style.fab} onPress={send}>
                        <FontAwesome name="paper-plane" variant="regular" size={21} color="white" />
                    </Pressable>
                </View>
            </View>
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
    titleRow:{
        flexDirection:'row',
        alignItems:'center',
        gap:8,
    },
    titleInput:{
        color:'white',
        fontSize:25,
        borderBottomWidth:1,
        borderColor:'gray',
        minWidth:140,
    },
    textbox:{
    position:'absolute',
    bottom: 30,
    height: 35,
    flexDirection: 'row',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
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
    },
    mine: {
        alignSelf:'flex-end',
        backgroundColor:'blue',
        borderRadius:16,
        paddingVertical:8,
        paddingHorizontal:12,
        marginVertical:4,
        maxWidth:'80%',
    },
    theirsRow: {
        flexDirection:'row',
        alignItems:'flex-end',
        alignSelf:'flex-start',
        gap:6,
        marginVertical:4,
        maxWidth:'85%',
    },
    msgAvatar: {
        width:32,
        height:32,
        borderRadius:16,
        backgroundColor:'gray',
        justifyContent:'center',
        alignItems:'center',
    },
    msgInitial: {
        color:'white',
        fontSize:14,
    },
    theirs: {
        backgroundColor:'#333',
        borderRadius:16,
        paddingVertical:8,
        paddingHorizontal:12,
    },
    senderName: {
        color:'lightblue',
        fontSize:12,
        marginBottom:2,
    }
});