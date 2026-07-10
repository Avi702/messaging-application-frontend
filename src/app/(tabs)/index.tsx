import { Text, View, StyleSheet, TextInput, Pressable, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {FontAwesome} from '@expo/vector-icons'
export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Search for existing conversations/users */}
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
      <View style = {styles.search}>
        <TextInput style = {styles.input} placeholder = 'Search'></TextInput>
        <Pressable onPress={() => {console.log("Clicked")}}>
          <FontAwesome name ="search" size={19} color='white'/></Pressable>
      </View>
      </ScrollView>
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
