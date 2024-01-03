import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Playground from './screens/Playground';
import Subscription from './screens/Subscription';
import Usage from './screens/Usage';
import ApiKey from './screens/ApiKey';
import Avatar from './components/Avatar';

const AVATAR_URI = 'https://gravatar.com/avatar/1f82b0492a0a938288c2d5b70534a1fb?s=400&d=robohash&r=x'

const DrawerStack = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <DrawerStack.Navigator initialRouteName="Playground" screenOptions={{ headerTitle: "Sync.labs", headerRight: () => <Avatar size={40} uri={AVATAR_URI} onPress={() => console.log("test")} /> }}>
      <DrawerStack.Screen name="Playground" component={Playground} />
      <DrawerStack.Screen name="Subscription" component={Subscription} />
      <DrawerStack.Screen name="Usage" component={Usage} />
      <DrawerStack.Screen name="ApiKey" component={ApiKey} />
    </DrawerStack.Navigator>
  )
}

export default DrawerNavigator