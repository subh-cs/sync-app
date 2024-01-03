import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react'
import LipSync from './LipSync';
import Random from './Random';

const Drawer = createDrawerNavigator();

const Playground = () => {
  return (
    <Drawer.Navigator initialRouteName="LipSync">
      <Drawer.Screen name="LipSync" component={LipSync} />
      <Drawer.Screen name="Random" component={Random} />
    </Drawer.Navigator>
  )
}

export default Playground