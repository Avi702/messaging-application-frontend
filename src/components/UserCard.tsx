import { View, Text, StyleSheet, Pressable } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

interface UserCardProps {
    _id: string
    displayName: string
    email?: string
    bio: string
    isOnline?: boolean
    added?: boolean
    onAdd: () => void
}

export default function UserCard({ _id, displayName, email, bio, isOnline, added, onAdd }: UserCardProps){
    return (
        <View style={style.container}>
            <View>
                <View style={style.avatar}>
                    <Text style={style.initial}>{displayName[0].toUpperCase()}</Text>
                </View>
                {isOnline ? <View style={style.onlineDot} /> : null}
            </View>
            <View style={style.info}>
                <Text style={style.name}>{displayName}</Text>
                {email ? <Text style={style.sub}>{email}</Text> : null}
                {bio ? <Text style={style.sub}>{bio}</Text> : null}
            </View>
            <Pressable style={[style.add, added ? style.addedButton : null]} onPress={onAdd}>
                <FontAwesome name={added ? 'check' : 'plus'} size={20} color="white" />
            </Pressable>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        gap:12,
        backgroundColor:"rgba(40, 38, 38, 1)",
        borderRadius:8,
        padding:12,
        marginVertical:4,
        alignSelf: 'stretch'
    },
    avatar:{
        width:48,
        height:48,
        borderRadius:24,
        backgroundColor:'gray',
        justifyContent:'center',
        alignItems:'center',
    },
    initial:{
        color:'white',
        fontSize:22,
    },
    onlineDot:{
        position:'absolute',
        right:0,
        bottom:0,
        width:14,
        height:14,
        borderRadius:7,
        backgroundColor:'limegreen',
        borderWidth:2,
        borderColor:"rgba(40, 38, 38, 1)",
    },
    addedButton:{
        backgroundColor:'green',
    },
    info:{
        flex:1,
        gap:2,
    },
    name:{
        color:'white',
        fontSize:18,
    },
    sub:{
        color:'gray',
        fontSize:13,
    },
    add:{
        backgroundColor:'blue',
        borderRadius:20,
        width:36,
        height:36,
        justifyContent:'center',
        alignItems:'center',
        marginLeft: 'auto',
    },
})
