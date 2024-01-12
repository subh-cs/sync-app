import { SafeAreaView, Image } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const SplashScreen = () => {
    return (
        <SafeAreaView className='flex justify-center items-center h-full bg-black'>
            <Image source={{ uri: "https://app.synclabs.so/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsync_icon_white.850b8eaa.png&w=3840&q=75" }} className="h-32 w-24"></Image>
            <StatusBar style="light" />
        </SafeAreaView>
    )
}

export default SplashScreen