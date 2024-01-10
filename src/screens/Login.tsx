import React from "react";
import { SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import env from "../../utils/env";
import { useSignIn } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";


const Login = () => {
    const navigation = useNavigation<any>();
    const { signIn, setActive, isLoaded } = useSignIn();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSignInPress = async () => {
        if (!isLoaded) {
            return;
        }
        if (!emailAddress || !password) {
            Alert.alert("Missing fields", "Please enter email and password");
            return;
        }
        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });
            // This is an important step,
            // This indicates the user is signed in
            await setActive({ session: completeSignIn.createdSessionId });
        } catch (err: any) {
            console.log(err);
        }
    };


    return (
        <SafeAreaView className="h-full w-full px-4 bg-black">
            <ScrollView className="h-full w-full flex bg-black" contentContainerStyle={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
                <View className="pt-16">
                    <Image source={{ uri: "https://app.synclabs.so/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsync_icon_white.850b8eaa.png&w=3840&q=75" }} className="h-64 w-48"></Image>
                    <View className="flex flex-row justify-start items-center gap-1 pt-4 mt-4">
                        <Text className="text-white font-thin text-xl">Welcome to</Text>
                        <Text className="text-white font-bold text-xl">sync labs.</Text>
                    </View>
                </View>

                <View className="w-full flex justify-center items-center pb-4 mt-16">
                    <TextInput value={emailAddress} onChangeText={setEmailAddress} className="border border-white w-full rounded-lg p-4 mb-4  text-white" placeholder="Email" placeholderTextColor="white" textContentType="emailAddress" />
                    <TextInput value={password} onChangeText={setPassword} className="border border-white w-full rounded-lg p-4 mb-4  text-white" placeholder="Password" placeholderTextColor="white" textContentType="password" secureTextEntry />
                </View>
                <View className="w-full">
                    <TouchableOpacity
                        onPress={onSignInPress}
                        className="p-4 bg-white rounded-md flex flex-row justify-center items-center w-full"
                    >
                        <Text className=" text-base pl-2 font-semibold">Continue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("SignUp")}
                        className="p-4 bg-black rounded-md flex flex-row justify-center items-center w-full"
                    >
                        <Text className=" text-base pl-2 font-semibold text-white">Go to Sign up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <StatusBar style="light" />
        </SafeAreaView>
    );
}
export default Login;