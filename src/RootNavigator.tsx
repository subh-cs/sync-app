import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import InAppScreenNavigator from './InAppScreenNavigator';
import SignUp from './screens/SignUp';
import * as Google from "expo-auth-session/providers/google";
import env from '../utils/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './screens/SplashScreen';
import { IUser } from '../utils/interfaces';


const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
    const [userInfo, setUserInfo] = React.useState<IUser>();
    const [token, setToken] = React.useState("");

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: env.ANDROID_CLIENT_ID
    });

    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        handleEffect();
    }, [response, token]);

    async function handleEffect() {
        setIsLoading(true);
        const user = await getLocalUser();
        console.log("user", user);
        if (!user) {
            // console.log("no user");
            if (response?.type === "success") {
                setToken(response.authentication?.accessToken ?? '');
                getUserInfo(response.authentication?.accessToken);
            }
        } else {
            setUserInfo(user);
            console.log("loaded locally");
        }
        setIsLoading(false);
    }

    const getLocalUser = async () => {
        const data = await AsyncStorage.getItem("@user");
        if (!data) return null;
        return JSON.parse(data);
    };

    const getUserInfo = async (token?: string) => {
        if (!token) return;
        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const user = await response.json();
            await AsyncStorage.setItem("@user", JSON.stringify(user));
            setUserInfo(user);
            console.log("user from api", user);
        } catch (error) {
            // Add your own error handler here
            console.error(error);
            throw error;
        }
    };

    const handleSignOut = async () => {
        await AsyncStorage.removeItem("@user");
        setUserInfo(undefined);
    }

    if (isLoading === true) return <SplashScreen />;

    if (isLoading === false) return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {userInfo ? (
                <RootStack.Screen name="InAppScreenNavigator" children={() =>
                    <InAppScreenNavigator user={userInfo} handleSignOut={handleSignOut} />
                } />
            ) : (
                <RootStack.Screen name="Login" children={() => <Login
                    hitSignIn={() => promptAsync()}
                />} />
            )}
        </RootStack.Navigator>

    )
}

export default RootNavigator
