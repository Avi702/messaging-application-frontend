import { Text, View, StyleSheet, TextInput, Pressable, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {FontAwesome} from '@expo/vector-icons'
import {useState} from 'react'
import LogIn from "../../app/Authentication/LogIn"
import ViewContent from "../../components/ViewContent"


const information = [{id:1,name:'Avneet072',email:'avi@gmail.com',bio:'string',createdAt:'10/12/2025',lastOnline:10,isOnline:false}]

export default function Profile() {
  const [isUser, setIsUser] = useState(false);
  const user = {id:1,name:'Avneet072',email:'avi@gmail.com',bio:'string',createdAt:'10/12/2025',lastOnline:10,isOnline:false}
  return (
    <>
      {isUser ? (
        <>
          <SafeAreaView style={style.header}>
            <View style={style.profile}>
              <Text style={{ color: "white", fontSize: 30 }}>A</Text>
            </View>

            <Text style={{ alignSelf: "center", color: "white", fontSize: 25 }}>{user.name}</Text>
            <Text style={{ alignSelf: "center", color: "gray", fontSize: 15 }}>{user.bio} </Text>
          </SafeAreaView>

          <View style={style.body} />

          {information.map((c) => (
            <ViewContent
              key={c.id}
              id={c.id}
              name={c.name}
              email={c.email}
              bio={c.bio}
              createdAt={c.createdAt}
              lastOnline={c.lastOnline}
              isOnline={c.isOnline}
            />
          ))}
        </>
      ) : (
        <LogIn />
      )}
    </>
  );
}


const style = StyleSheet.create({
    header:{
        justifyContent: 'flex-end', alignItems: 'center',
        width:'100%',
        height:'30%',
        backgroundColor:'rgb(55, 50, 50)',
    },
    profile:{
    width:80,
    height:80,
    borderRadius:55,
    backgroundColor:'gray',
    justifyContent: 'center',
    alignItems: 'center',
    },
    body:{
        height:'70%',
        backgroundColor:'black',
    }
})