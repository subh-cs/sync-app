import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import DrawerNavigator from './DrawerNavigator';
import Profile from './screens/Profile';
import VideoPlayer from './screens/VideoPlayer';
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {

    return (
        <>
            <SignedIn>
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    <RootStack.Screen name="DrawerNavigator" component={DrawerNavigator} />
                    <RootStack.Screen name="Profile" component={Profile} />
                    <RootStack.Screen name="VideoPlayer" component={VideoPlayer} />
                </RootStack.Navigator>
            </SignedIn>
            <SignedOut>
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    <RootStack.Screen name="Login" component={Login} />
                </RootStack.Navigator>
            </SignedOut>
        </>
    )
}

export default RootNavigator
