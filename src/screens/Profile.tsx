import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Avatar from '../components/Avatar';
import { Appbar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { IUser } from '../../utils/interfaces';

interface ProfileProps {
    user: IUser
    handleSignOut: () => void;
}

const Profile = (props: ProfileProps) => {

    const navigation = useNavigation<any>();

    return (
        <SafeAreaView className='h-full bg-black w-full'>
            <Appbar.Header className='bg-black' style={{ borderBottomColor: "gray", borderBottomWidth: 0.5 }}>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} iconColor='white' />
                <Appbar.Content title="Profile" color='white' />
            </Appbar.Header>
            <View className='flex justify-start items-center h-full w-full'>
                <View className='pt-12 pb-4'>
                    <Avatar size={100} uri={props.user.picture} onPress={() => null} />
                </View>
                <Text className='text-white'>{props.user.email}</Text>
                <TouchableOpacity className='mt-12 bg-white px-12 py-2 rounded-lg' onPress={props.handleSignOut}>
                    <Text className='text-lg font-semibold'>Logout</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="light" />
        </SafeAreaView>

    )
}

export default Profile