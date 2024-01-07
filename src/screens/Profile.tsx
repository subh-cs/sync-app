import { View, Text, TouchableOpacity, Button, SafeAreaView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { useAuth, useUser } from "@clerk/clerk-expo";
import Avatar from '../components/Avatar';
import { Appbar } from 'react-native-paper';


const Profile = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  const navigation = useNavigation<any>()

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <SafeAreaView className='h-full'>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => { navigation.goBack() }} />
        <Appbar.Content title="Profile" />
      </Appbar.Header>
      <View className=''>
        <Avatar size={40} uri={user?.imageUrl} onPress={() => null} />
        <Text>{user.emailAddresses[0].emailAddress}</Text>
        <TouchableOpacity onPress={() => signOut()}><Text>Logout</Text></TouchableOpacity>
      </View>
    </SafeAreaView>

  )
}

export default Profile