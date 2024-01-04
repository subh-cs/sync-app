import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';


interface LoginProps {
  onLogin(): void
}

const Login = (props: LoginProps) => {
  const navigation = useNavigation<any>();

  return (
    <View className='flex justify-center items-center h-full'>
      <Text>Login</Text>
      <TouchableOpacity onPress={props.onLogin}><Text>Click to login</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=> navigation.navigate("SignUp")}><Text>Go to Signup</Text></TouchableOpacity>
    </View>
  )
}

export default Login