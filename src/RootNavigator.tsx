import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Playground from './screens/Playground';
import ApiKey from './screens/ApiKey';
import Subscription from './screens/Subscription';
import Usage from './screens/Usage';
import Login from './screens/Login';
import Signup from './screens/Signup';


const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const [isSignedIn, setIsSignedIn] = React.useState(true)

    return (
        <Stack.Navigator initialRouteName={isSignedIn ? "Playground" : "Login"} screenOptions={{ headerShown: false }}>
            {isSignedIn ? (
                <Stack.Group>
                    <Stack.Screen name="Playground" component={Playground} />
                    <Stack.Screen name="ApiKey" component={ApiKey} />
                    <Stack.Screen name='Subscription' component={Subscription} />
                    <Stack.Screen name='Usage' component={Usage} />
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
