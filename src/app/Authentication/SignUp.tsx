import { Text, Alert, View, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {FontAwesome} from '@expo/vector-icons'
import {useState} from 'react'
import { Stack, useRouter} from 'expo-router'

function isValidBirthDate(mon: string, day: string, year: string){
    // must be digits only and non-empty
    if(!/^\d+$/.test(mon) || !/^\d+$/.test(day) || !/^\d+$/.test(year)){
        return false
    }
    const m = parseInt(mon, 10)
    const d = parseInt(day, 10)
    const y = parseInt(year, 10)

    // basic range checks
    if(y < 1900 || m < 1 || m > 12 || d < 1 || d > 31){
        return false
    }

    // verify it's a real calendar date (rejects e.g. 02/30, handles leap years)
    const date = new Date(y, m - 1, d)
    if(date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d){
        return false
    }

    // can't be in the future
    if(date > new Date()){
        return false
    }

    return true
}

export default function SignUp(){
    const router = useRouter()
    const [useName,setName] = useState('')
    const [useMon,setMon] = useState('')
    const [useDay,setDay] = useState('')
    const [useYear,setYear] = useState('')
    const [useEmail,setEmail] = useState('')
    const [usePwd,setPwd] = useState('')
    const [loading,setLoading] = useState(false)
    const [useCheckPwd,setCheckPwd] = useState('')
    async function handleSignUp(){
            setLoading(true)
        try{
            if(usePwd === useCheckPwd && 8 <= usePwd.length && usePwd.length <= 64
                && useName.length >= 3 && useName.length <= 64
                && isValidBirthDate(useMon, useDay, useYear)){
                const date = useYear + "-" + useMon.padStart(2, "0") + "-" + useDay.padStart(2, "0")
                const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/authentication/register`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body : JSON.stringify({ email: useEmail, password: usePwd, birthDate: date, displayName: useName })
                    })
                if(res.ok){
                    Alert.alert('Profile created!')
                    router.push("../Authentication/LogIn")
                }else{
                    const body = await res.json()
                    switch (body?.error?.code) {
                    case 'USER_ALREADY_EXISTS': Alert.alert("An account with that email already exists") 
                    return
                    case 'USER_NOT_OLD_ENOUGH': Alert.alert("You must be older to sign up")
                    return
                    case 'BAD_REQUEST': Alert.alert("Please check your details")
                    return
                    default: Alert.alert("Something went wrong, try again")
                    return
                    }
                }
            }else{
                Alert.alert('Invalid Input. Password must be 8 to 64 chars, Name should be 3 to 64, and Birth Date must be a valid past date.')
            }

        } catch {
            Alert.alert('Could not reach server')
        } finally {
            setLoading(false)              
        }
        }
    
    return( <><Stack.Screen options={{headerShown: false }} />
        <SafeAreaView style = {style.container}>
                        <Pressable style = {{borderWidth: 1, borderColor:'gray', borderRadius:30,alignSelf:'flex-start',justifyContent:'flex-start', padding:10}} onPress={()=>router.back()}>
                        <Text style = {{alignSelf:'flex-start',justifyContent:'flex-start', color:'lightblue', fontSize:15}}>Go Back</Text>
                        </Pressable>

        <Text style = {{color:'white',fontSize:36,}}>Sign Up!</Text>
        <View style={style.form}>
            <Text style={{ color: 'white', fontSize: 20, alignSelf:'center' }}>Username</Text>
            <TextInput placeholder="JohnDoe123" placeholderTextColor="#888" value ={useName} onChangeText ={setName} style={style.input} />

            <Text style={{ color: 'white', fontSize: 20, alignSelf:'center' }}>Email</Text>
            <TextInput placeholder="you@example.com" placeholderTextColor="#888" autoCapitalize="none" keyboardType="email-address" value ={useEmail} onChangeText ={setEmail} style={style.input} />

            <Text style={{ color: 'white', fontSize: 20, alignSelf:'center' }}>Birth Date</Text>
            <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
                <TextInput placeholder="MM" placeholderTextColor="#888" keyboardType="number-pad" maxLength={2} value ={useMon} onChangeText ={setMon} style={[style.input, { flex: 1 }]} />
                <TextInput placeholder="DD" placeholderTextColor="#888" keyboardType="number-pad" maxLength={2} value ={useDay} onChangeText ={setDay} style={[style.input, { flex: 1 }]} />
                <TextInput placeholder="YYYY" placeholderTextColor="#888" keyboardType="number-pad" maxLength={4} value ={useYear} onChangeText ={setYear} style={[style.input, { flex: 2 }]} />
            </View>


            <Text style={{ color: 'white', fontSize: 20, alignSelf:'center' }}>Password</Text>
            <TextInput placeholder="Password" placeholderTextColor="#888" value ={usePwd} onChangeText ={setPwd} secureTextEntry style={style.input} />

            <Text style={{ color: 'white', fontSize: 20, alignSelf:'center' }}>Confirm Password</Text>
            <TextInput placeholder="Password" placeholderTextColor="#888" value ={useCheckPwd} onChangeText ={setCheckPwd} secureTextEntry style={style.input} />
            <Pressable style={style.buttons} disabled={loading || !useEmail || !usePwd} onPress={handleSignUp}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={{ color:'white', fontSize:15, alignSelf:'center' }}>Sign Up</Text>}
            </Pressable>
        </View>
        </SafeAreaView>
        
    </>)
}

const style = StyleSheet.create({
    header:{
    padding:15,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width:'100%',
    backgroundColor:'black',
},
container:{
    flex: 1,
    backgroundColor:'black',
    alignItems:'center',
    justifyContent:'flex-start',
    paddingTop: 60,
    padding:25,
},


    form:{
        borderWidth:2,
        borderColor:'lightblue',
        borderRadius:8,
        width:'100%',
        padding:25,
        alignItems:'flex-start',
        justifyContent:'flex-start',
        gap:18,
        alignSelf:'flex-start',
    },
    input:{
        backgroundColor: "rgba(40, 38, 38, 1)",
        color:'white',
        borderRadius:8,
        width:'100%',
        height:35,
        paddingHorizontal:10
    },
    buttons:{
        padding:15,
        backgroundColor:'blue',
        borderRadius:8,
        width:'100%',
        marginTop:15,
    },
})