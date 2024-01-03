import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Signup from './screens/Signup';
import DrawerNavigator from './DrawerNavigator';
import Profile from './screens/Profile';


const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const [isSignedIn, setIsSignedIn] = React.useState(true)

    return (
        <Stack.Navigator initialRouteName={isSignedIn ? "Playground" : "Login"} screenOptions={{ headerShown: false }}>
            {isSignedIn ? (
                <Stack.Group>
                    <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
                    <Stack.Screen name="Profile" component={Profile} />
                </Stack.Group>
            ) : (
                <Stack.Group>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="SignUp" component={Signup} />
                </Stack.Group>
            )}
        </Stack.Navigator>
    )
}

export default RootNavigator
