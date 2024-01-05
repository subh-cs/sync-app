import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Signup from './screens/Signup';
import DrawerNavigator from './DrawerNavigator';
import Profile from './screens/Profile';
import VideoPlayer from './screens/VideoPlayer';

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
        <RootStack.Navigator initialRouteName={isSignedIn ? "Playground" : "Login"} screenOptions={{ headerShown: false }}>
            {isSignedIn ? (
                <RootStack.Group>
                    <RootStack.Screen name="DrawerNavigator" children={() => <DrawerNavigator />} />
                    <RootStack.Screen name="Profile" children={() => <Profile onLogout={onLogout} />} />
                    <RootStack.Screen name="VideoPlayer" children={() => <VideoPlayer url={"https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"} />} />
                </RootStack.Group>
            ) : (
                <RootStack.Group>
                    <RootStack.Screen name="Login" children={() => <Login onLogin={onLogin} />} />
                    <RootStack.Screen name="SignUp" component={Signup} />
                </RootStack.Group>
            )}
        </RootStack.Navigator>
    )
}

export default RootNavigator
