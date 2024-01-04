import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const navigation = useNavigation<any>()
  return (
    <View className='flex justify-center items-center h-full'>
      <Text>Profile</Text>
      <TouchableOpacity onPress={() => navigation.navigate("DrawerNavigator")}><Text>Go to playground</Text></TouchableOpacity>
    </View>
  )
}

export default Profile