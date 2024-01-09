import { View, Text, TouchableOpacity, Button, SafeAreaView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { useAuth, useUser } from "@clerk/clerk-expo";
import Avatar from '../components/Avatar';
import { Appbar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';


const Profile = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const { signOut } = useAuth();

    const navigation = useNavigation<any>()

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    return (
        <SafeAreaView className='h-full bg-black w-full'>
            <Appbar.Header className='bg-black' style={{ borderBottomColor: "gray", borderBottomWidth: 0.5 }}>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} iconColor='white' />
                <Appbar.Content title="Profile" color='white' />
            </Appbar.Header>
            <View className='flex justify-start items-center h-full w-full'>
                <View className='pt-12 pb-4'>
                    <Avatar size={100} uri={user?.imageUrl} onPress={() => null} />
                </View>
                <Text className='text-white'>{user.emailAddresses[0].emailAddress}</Text>
                <TouchableOpacity className='mt-12 bg-white px-12 py-2 rounded-lg' onPress={() => signOut()}>
                    <Text className='text-lg font-semibold'>Logout</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>

    )
}

export default Profile