import React, { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView, View, Image, Text, TouchableOpacity } from "react-native";
// import { useOAuth } from "@clerk/clerk-expo";
// import { useWarmUpBrowser } from "../hooks/warmBrowser";
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

interface LoginProps {
    hitSignIn: () => void;
}

const Login = (props: LoginProps) => {

    // const [token, setToken] = useState("");
    // const [userInfo, setUserInfo] = useState(null);


    // const [request, response, promptAsync] = Google.useAuthRequest({
    //     androidClientId: "703565878773-b33cu94atbqhpiagrqth2go30of177gc.apps.googleusercontent.com"
    // });


    // // useEffect(() => {
    // //     handleEffect();
    // // }, [response, token]);

    // async function handleEffect() {
    //     const user = await getLocalUser();
    //     console.log("user", user);
    //     if (!user) {
    //         if (response?.type === "success") {
    //             setToken(response.authentication?.accessToken ?? '');
    //             getUserInfo(response.authentication?.accessToken);
    //         }
    //     } else {
    //         setUserInfo(user);
    //         console.log("loaded locally");
    //     }
    // }

    // const getLocalUser = async () => {
    //     const data = await AsyncStorage.getItem("@user");
    //     if (!data) return null;
    //     return JSON.parse(data);
    // };

    // const getUserInfo = async (token?: string) => {
    //     if (!token) return;
    //     try {
    //         const response = await fetch(
    //             "https://www.googleapis.com/userinfo/v2/me",
    //             {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             }
    //         );

    //         const user = await response.json();
    //         await AsyncStorage.setItem("@user", JSON.stringify(user));
    //         setUserInfo(user);
    //     } catch (error) {
    //         // Add your own error handler here
    //         console.error(error);
    //         throw error;
    //     }
    // };

    return (
        <SafeAreaView className="flex justify-center items-center h-full bg-black w-full px-4">

            <Image source={{ uri: "https://app.synclabs.so/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsync_icon_white.850b8eaa.png&w=3840&q=75" }} className="h-64 w-48"></Image>
            <View className="flex flex-row justify-start items-center gap-1 pt-4 mt-4">
                <Text className="text-white font-thin text-xl">Welcome to</Text>
                <Text className="text-white font-bold text-xl">sync labs.</Text>
            </View>

            <TouchableOpacity
                // onPress={onPress}
                onPress={() => {
                    props.hitSignIn();
                }}
                className="p-4 bg-white rounded-md flex flex-row justify-center items-center w-full mt-32"
            >
                <AntDesign name="google" size={24} color="black" />
                <Text className=" text-base pl-4">Continue with Google</Text>
            </TouchableOpacity>

            <StatusBar style="light" />
        </SafeAreaView>
    );
}
export default Login;