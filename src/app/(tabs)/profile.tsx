import { Text, View, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useState, useEffect} from 'react'
import LogIn from "../../app/Authentication/LogIn"
import ViewContent from "../../components/ViewContent"
import {useAuth} from '../Authentication/AuthContext'

function formatDateTime(value: string){
    if(!value){
        return "—"
    }
    return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
}

export default function Profile() {
  const { user, isAuthenticated, loading, logout, updateProfile } = useAuth()
  const [isEdit,setEdit] = useState(false)
  const [name,setName] = useState('')
  const [bio,setBio] = useState('')

  // keep the editable fields in sync with the logged in user
  useEffect(()=>{
    if(user){
      setName(user.displayName)
      setBio(user.bio)
    }
  },[user])

  // wait for the startup token check so we do not flash the login screen
  if (loading){
    return (
      <View style={style.loading}>
        <ActivityIndicator color="white" />
      </View>
    )
  }

  if (!isAuthenticated || !user){
    return (<LogIn />)
  }

  async function handleEdit(){
    if(isEdit){
      try{
        await updateProfile(name, bio)
      } catch {
        Alert.alert('Could not update profile')
        return
      }
    }
    setEdit(prev => !prev)
  }
  return (<>
          <SafeAreaView style={style.header}>
            <View style={style.profile}>
              <Text style={{ color: "white", fontSize: 30 }}>{user?.displayName[0].toUpperCase()}</Text>
            </View>

            <Text style={{ alignSelf: "center", color: "white", fontSize: 25 }}>{user?.displayName}</Text>
            <Text style={{ alignSelf: "center", color: "gray", fontSize: 15 }}>Last Online: {formatDateTime(user?.lastOnline)} </Text>
          </SafeAreaView>

          <ScrollView style={style.body} contentContainerStyle={style.bodyContent}>
            {isAuthenticated && user && (
          <ViewContent
            _id={user._id}
            displayName={name}
            bio={bio}
            onChangeDisplayName={setName}
            onChangeBio={setBio}
            createdAt={user.createdAt}
            lastOnline={user.lastOnline}
            isOnline={user.isOnline}
            email={user.email}
            birthDate={user.birthDate}
            isEdit = {isEdit}
          />
          )}
            <Pressable style = {style.editbutton} onPress={handleEdit}><Text>{isEdit ? 'Done' : 'Edit'}</Text></Pressable>
            <Pressable style = {style.logoutbutton} onPress={logout}><Text>Log Out</Text></Pressable>
          </ScrollView>

         
    </>
  );
}


const style = StyleSheet.create({
    header:{
        justifyContent: 'flex-end', alignItems: 'center',
        width:'100%',
        backgroundColor:'rgb(55, 50, 50)',
        height:'30%'
    },
    profile:{
    width:80,
    height:80,
    borderRadius:55,
    backgroundColor:'gray',
    justifyContent: 'center',
    alignItems: 'center',
    gap:15,
    },
    loading:{
      flex:1,
      backgroundColor:'black',
      justifyContent:'center',
      alignItems:'center',
    },
    body:{
      flex:1,
      backgroundColor:'black',
    },
    bodyContent:{
      padding:10,
      gap:15,
      alignItems:'center',
      flexGrow:1,
    },
    editbutton:{
        padding:15,
        alignItems:'center',
        backgroundColor:'blue',
        borderRadius:8,
        width:'70%',
        marginTop:15,
    },
    logoutbutton:{
        padding:15,
        alignItems:'center',
        backgroundColor:'red',
        borderRadius:8,
        width:'70%',
        marginTop:15,
    },
})