import React from "react";
import { SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import env from "../../utils/env";


const Login = () => {
    const showAllLoadedEnv = () => {
        Alert.alert("Loaded env", JSON.stringify(env));
    }
    
    return (
        <SafeAreaView className="h-full w-full px-4 bg-black">
            <ScrollView className="h-full w-full flex px-4 bg-black" contentContainerStyle={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
                <View className="pt-16">
                    <Image source={{ uri: "https://app.synclabs.so/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsync_icon_white.850b8eaa.png&w=3840&q=75" }} className="h-64 w-48"></Image>
                    <View className="flex flex-row justify-start items-center gap-1 pt-4 mt-4">
                        <Text className="text-white font-thin text-xl">Welcome to</Text>
                        <Text className="text-white font-bold text-xl">sync labs.</Text>
                    </View>
                </View>

                <View className="w-full flex justify-center items-center pb-4 pt-8 gap-2">
                    <TextInput className="border border-white w-full rounded-lg p-2 text-white" placeholder="Email" placeholderTextColor="white" textContentType="emailAddress" />
                    <TextInput className="border border-white w-full rounded-lg p-2 text-white" placeholder="Password" placeholderTextColor="white" textContentType="password" secureTextEntry />
                </View>
                <TouchableOpacity
                    // onPress={onPress}
                    className="p-4 bg-white rounded-md flex flex-row justify-center items-center w-full"
                >
                    <Text className=" text-base pl-2 font-semibold">Continue</Text>
                </TouchableOpacity>
            </ScrollView>
            <StatusBar style="light" />
        </SafeAreaView>
    );
}
export default Login;