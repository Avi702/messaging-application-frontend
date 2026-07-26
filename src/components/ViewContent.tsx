import { Text, View, StyleSheet, TextInput } from "react-native";

function formatDate(value: string){
    if(!value){
        return "—"
    }
    return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
}



interface DropDown{
    _id: string
    displayName: string
    bio: string
    createdAt: string
    lastOnline: string
    isOnline: boolean
    email: string
    birthDate: string
    isEdit:boolean
    onChangeDisplayName: (text: string) => void
    onChangeBio: (text: string) => void
}
export default function ViewContent({_id, displayName, email, birthDate, bio, createdAt, lastOnline, isOnline, isEdit, onChangeDisplayName, onChangeBio}:DropDown){
    return(<View style={style.container}>
        <View style={style.field}>
            <Text style={style.label}>Display Name</Text>
            {isEdit
                ? <TextInput style={style.input} value ={displayName} onChangeText ={onChangeDisplayName} placeholderTextColor="#888" />
                : <Text style={style.value}>{displayName}</Text>}
        </View>

        <View style={style.field}>
            <Text style={style.label}>Bio</Text>
            {isEdit
                ? <TextInput style={[style.input, style.multiline]} value ={bio} onChangeText = {onChangeBio} placeholderTextColor="#888" multiline />
                : <Text style={style.value}>{bio}</Text>}
        </View>

        <View style={style.field}>
            <Text style={style.label}>Email</Text>
            <Text style={style.value}>{email}</Text>
        </View>

        <View style={style.field}>
            <Text style={style.label}>Birthday</Text>
            <Text style={style.value}>{birthDate}</Text>
        </View>

        <View style={style.field}>
            <Text style={style.label}>Account Created</Text>
            <Text style={style.value}>{formatDate(createdAt)}</Text>
        </View>


        <Text style={style.section}>Recently Chatted</Text>
    </View>
)
}

const style = StyleSheet.create({
    container:{
        width:'100%',
        alignItems:'stretch',
        gap:18,
        paddingHorizontal:20,
    },
    field:{
        gap:4,
    },
    label:{
        color:'gray',
        fontSize:13,
        letterSpacing:0.5,
        textTransform:'uppercase',
    },
    value:{
        color:'white',
        fontSize:18,
    },
    input:{
        backgroundColor:"rgba(40, 38, 38, 1)",
        color:'white',
        borderRadius:8,
        width:'100%',
        height:40,
        paddingHorizontal:12,
        fontSize:16,
    },
    multiline:{
        height:80,
        paddingTop:10,
        textAlignVertical:'top',
    },
    section:{
        color:'white',
        fontSize:22,
        marginTop:10,
    },
})
