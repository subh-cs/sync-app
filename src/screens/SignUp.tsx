import { View, Text, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from 'expo-status-bar';
import { useSignUp } from "@clerk/clerk-expo";


const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const navigation = useNavigation<any>();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // start the sign up process.
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
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

        <View className="w-full flex justify-center items-center pb-4 mt-16 h-40">
          {pendingVerification && (<Text className='text-white p-2'>code sent to {emailAddress}</Text>)}
          {pendingVerification && (
            <TextInput value={code} onChangeText={setCode} className="border border-white w-full rounded-lg p-4 mb-4  text-white" placeholder="Code" placeholderTextColor="white" />
          )}
          {!pendingVerification && (
            <TextInput value={emailAddress} onChangeText={setEmailAddress} className="border border-white w-full rounded-lg p-4 mb-4  text-white" placeholder="Email" placeholderTextColor="white" textContentType="emailAddress" />

          )}
          {!pendingVerification && (<TextInput value={password} onChangeText={setPassword} className="border border-white w-full rounded-lg p-4 mb-4  text-white" placeholder="Password" placeholderTextColor="white" textContentType="password" secureTextEntry />
          )}
        </View>
        <View className="w-full">
          <TouchableOpacity
            onPress={pendingVerification ? onPressVerify : onSignUpPress}
            className="p-4 bg-white rounded-md flex flex-row justify-center items-center w-full"
          >
            <Text className=" text-base pl-2 font-semibold">{pendingVerification ? "Verify" : "Signup"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="p-4 bg-black rounded-md flex flex-row justify-center items-center w-full"
          >
            <Text className=" text-base pl-2 font-semibold text-white">Go to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  )
}

export default SignUp