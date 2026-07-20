import { Text, View, StyleSheet, TextInput, Pressable, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {FontAwesome} from '@expo/vector-icons'
import {useState} from 'react'

interface DropDown{
    title: string,
    info: string,
}
export default function ViewContent({title, info}:DropDown){
    const [isOpen, setIsOpen] = useState(false)
    return(<View style = {style.container}>
        <Pressable style = {style.dropDown}>
            <Text style = {{color:'white',fontSize:18}}>{title}</Text>
            <FontAwesome name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color="white" />
        </Pressable>
    {isOpen && (
        <View style={style.body}>
            <Text style = {{color:'gray'}}>{info}</Text>
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