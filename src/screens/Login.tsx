import React from "react";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView, View, Image, Text, TouchableOpacity, Alert } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../hooks/warmBrowser";
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import env from "../../utils/env";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive ? setActive({ session: createdSessionId }) : null;
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  const showAllLoadedEnv = () => {
    Alert.alert("Loaded env", JSON.stringify(env));
}

  return (
    <SafeAreaView className="flex justify-center items-center h-full bg-black w-full px-4">

      <Image source={{ uri: "https://app.synclabs.so/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsync_icon_white.850b8eaa.png&w=3840&q=75" }} className="h-64 w-48"></Image>
      <View className="flex flex-row justify-start items-center gap-1 pt-4 mt-4">
        <Text className="text-white font-thin text-xl">Welcome to</Text>
        <Text className="text-white font-bold text-xl">sync labs.</Text>
      </View>

      <TouchableOpacity
        onPress={showAllLoadedEnv}
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