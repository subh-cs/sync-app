import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import InAppScreenNavigator from './InAppScreenNavigator';
import SignUp from './screens/SignUp';

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
    return (
        <>
            <SignedIn>
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    <RootStack.Screen name="InAppScreenNavigator" component={InAppScreenNavigator} />
                </RootStack.Navigator>
            </SignedIn>
            <SignedOut>
                <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
                    <RootStack.Screen name="Login" component={Login} />
                    <RootStack.Screen name="SignUp" component={SignUp} />
                </RootStack.Navigator>
            </SignedOut>
        </>
    )
}

export default RootNavigator
