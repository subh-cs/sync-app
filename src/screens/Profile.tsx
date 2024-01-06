import { View, Text, TouchableOpacity, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { useAuth, useUser } from "@clerk/clerk-expo";
import Avatar from '../components/Avatar';


interface ProfileProps {
  onLogout(): void
}

const Profile = (props: ProfileProps) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  const navigation = useNavigation<any>()

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <View className='flex justify-center items-center h-full'>
      <Text>Profile {user.firstName}</Text>
      <Avatar size={40} uri={user?.imageUrl} onPress={() => null} />
      <TouchableOpacity onPress={() => navigation.navigate("DrawerNavigator")}><Text>Go to playground</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => signOut()}><Text>Logout</Text></TouchableOpacity>
    </View>
  )
}

export default Profile