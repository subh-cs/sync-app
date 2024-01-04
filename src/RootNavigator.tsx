import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Signup from './screens/Signup';
import DrawerNavigator from './DrawerNavigator';
import Profile from './screens/Profile';

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
    const [isSignedIn, setIsSignedIn] = React.useState(true)

    return (
        <RootStack.Navigator initialRouteName={isSignedIn ? "Playground" : "Login"} screenOptions={{ headerShown: false }}>
            {isSignedIn ? (
                <RootStack.Group>
                    <RootStack.Screen name="DrawerNavigator" component={DrawerNavigator} />
                    <RootStack.Screen name="Profile" component={Profile} />
                </RootStack.Group>
            ) : (
                <RootStack.Group>
                    <RootStack.Screen name="Login" component={Login} />
                    <RootStack.Screen name="SignUp" component={Signup} />
                </RootStack.Group>
            )}
        </RootStack.Navigator>
    )
}

export default RootNavigator
