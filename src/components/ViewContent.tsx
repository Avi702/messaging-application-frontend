import { Text, View, StyleSheet, TextInput, Pressable, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {FontAwesome} from '@expo/vector-icons'
import {useState} from 'react'

interface DropDown{
    id: number,
    name: string,
    email: string,
    bio: string,
    createdAt: string,
    lastOnline: number,
    isOnline: boolean,
}
export default function ViewContent({id, name, email, bio, createdAt, lastOnline, isOnline}:DropDown){
    const [isOpen, setIsOpen] = useState(true)
    return(<View style = {style.container}>
        <Pressable style = {style.dropDown}>
            <Text style = {{color:'white',fontSize:18}}></Text>
            <FontAwesome name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color="white" />
        </Pressable>
    {isOpen && (
        <View style={style.body}>
            <Text style = {{color:'gray'}}></Text>
        </View>)}
    </View>
)
}

const style = StyleSheet.create({
    container:{

    },
    dropDown:{

    },
    body:{

    },
})