import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import DrawerNavigator from './DrawerNavigator';
import Profile from './screens/Profile';
import VideoPlayer from './screens/VideoPlayer';
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
    const [isSignedIn, setIsSignedIn] = React.useState(true);

    const onLogout = () => {
        setIsSignedIn(false);
    }

    const onLogin = () => {
        setIsSignedIn(true);
    }

    return (
        <>
            <SignedIn>
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    <RootStack.Screen name="DrawerNavigator" children={() => <DrawerNavigator />} />
                    <RootStack.Screen name="Profile" children={() => <Profile onLogout={onLogout} />} />
                    <RootStack.Screen name="VideoPlayer" children={() => <VideoPlayer url={"https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"} />} />
                </RootStack.Navigator>
            </SignedIn>
            <SignedOut>
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    <RootStack.Screen name="Login" component={Login} />
                    <RootStack.Screen name="SignUp" component={SignUp} />
                </RootStack.Navigator>
            </SignedOut>
        </>
    )
}

export default RootNavigator
