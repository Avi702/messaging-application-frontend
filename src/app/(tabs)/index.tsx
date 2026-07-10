import { Text, View, StyleSheet, TextInput, Pressable, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {FontAwesome} from '@expo/vector-icons'
import Chat from '../../components/Chat'
export default function Index(){
  return (
    <SafeAreaView style={styles.container}>
      {/* Search for existing conversations/users */}
      <View style = {styles.search}>
        <TextInput style = {styles.input} placeholder = 'Search'></TextInput>
        <Pressable onPress={() => {console.log("Clicked")}}>
          <FontAwesome name ="search" size={19} color='white'/></Pressable>
      </View>
      <Text style = {{color:'white', fontSize: 35, alignSelf: 'flex-start', padding:15}}>Conversations</Text>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {/*Props for all conversations using conversation card */}
      </ScrollView>
      {/* Search for new users with no existing conversation */}
      <Pressable style={styles.fab} onPress={() => {console.log("Clicked")}}>
        <FontAwesome name="plus" size={24} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    color:"white",
  },
  search: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: 'white',
  borderRadius: 20,
  paddingHorizontal: 10,
  height: 35,
  width:"90%",
  backgroundColor:"rgba(40, 38, 38, 1)",
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
