import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';


const Signup = () => {
  const navigation = useNavigation<any>();

  return (
    <View className='flex justify-center items-center h-full'>
      <Text>Signup</Text>
      <Text onPress={() => navigation.navigate('Login')}>Go to Login</Text>
    </View>
  )
}

export default Signup