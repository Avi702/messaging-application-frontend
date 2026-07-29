import {StyleSheet, View, Text, Pressable} from 'react-native'
import {useState, useEffect} from 'react'
import {useRouter} from 'expo-router'
import {useAuth} from '../app/Authentication/AuthContext'

interface ChatProps {
  id: string
  title: string
  createdAt: string
  owner: string
  members: string[]
}
function formatDateTime(value: string){
    if(!value){
        return "—"
    }
    return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
}

export default function Chat({id, title, createdAt, owner, members}:ChatProps){
    const router = useRouter()
    const {user, authFetch} = useAuth()
    const [otherName, setOtherName] = useState('')
    const [otherOnline, setOtherOnline] = useState(false)

    const isDm = members.length === 1

    useEffect(()=>{
        if(!isDm){
            return
        }
        async function loadOtherUser(){
            // the other person is the owner, unless we are the owner (then members[0])
            const otherId = owner === user?._id ? members[0] : owner
            const res = await authFetch('/api/v1/users/getUserById', { userId: otherId })
            if(res.ok){
                const publicUser = await res.json()
                setOtherName(publicUser.displayName)
                setOtherOnline(publicUser.isOnline)
            }
        }
        loadOtherUser()
    },[isDm, owner, members, user?._id])

    // DMs show the other user's name, groups show the chat title
    const label = isDm ? otherName : title

    return (
    <Pressable style={style.container} onPress={()=>router.push(`/message/${id}?name=${encodeURIComponent(label)}`)}>
    <View>
        <View style={style.profile}>
            <Text style={{ color: 'white', fontSize: 30 }}>{label ? label[0].toUpperCase() : '?'}</Text>
        </View>
        {isDm && otherOnline ? <View style={style.onlineDot} /> : null}
    </View>
    <View style={style.meta}>
        <View style={style.name}>
            <Text style={{color: 'white', fontSize: 25, alignSelf:'flex-start'}}>{label}</Text>
        </View>
    </View>
    <Text style={{ color: 'gray', fontSize: 12, marginLeft: 'auto' }}>{formatDateTime(createdAt)}</Text>
</Pressable>
)
}

const style = StyleSheet.create({
    container:{
        width:'100%',
        flexDirection:'row',

        paddingHorizontal:20,
        padding:10,
    },
    profile:{
    width:80,
    height:80,
    borderRadius:55,
    backgroundColor:'gray',
    justifyContent: 'center',
    alignItems: 'center',
    },
  onlineDot:{
    position:'absolute',
    right:2,
    bottom:2,
    width:18,
    height:18,
    borderRadius:9,
    backgroundColor:'limegreen',
    borderWidth:2,
    borderColor:'black',
  },
  meta:{
    flexDirection:'column',
    paddingHorizontal:20,
  },
  name:{
    padding:5,
    flexDirection:'row',
    justifyContent:'flex-start',
  },
})
