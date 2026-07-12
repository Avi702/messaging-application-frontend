import { View, Text } from 'react-native'
import { Stack } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
export default function Message() {
    const { id, name } = useLocalSearchParams()

    return (
        <>
            <Stack.Screen options={{ title: name, headerBackgroundColor: 'black', }} />
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                {/* ... */}
            </View>
        </>
    )
}

