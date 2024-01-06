import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Button, View } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../hooks/warmBrowser";

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

    return (
        <View className="flex justify-center items-center h-full">
            <Button
                title="Sign in with Google"
                onPress={onPress}
            />
        </View>
    );
}
export default Login;