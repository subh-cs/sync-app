import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';


interface ProfileProps {
  onLogout(): void
}

const Profile = (props: ProfileProps) => {
  const navigation = useNavigation<any>()
  return (
    <View className='flex justify-center items-center h-full'>
      <Text>Profile</Text>
      <TouchableOpacity onPress={() => navigation.navigate("DrawerNavigator")}><Text>Go to playground</Text></TouchableOpacity>
      <TouchableOpacity onPress={props.onLogout}><Text>LogOut</Text></TouchableOpacity>
    </View>
  )
}

export default Profile