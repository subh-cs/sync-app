import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react'
import LipSync from './LipSync';
import Random from './Random';
import { Avatar } from 'react-native-paper';
import { View, Text, TouchableOpacity } from 'react-native';

const Drawer = createDrawerNavigator();

const AvatarCom = () => {
  return (
    <View className='px-2'>
      <TouchableOpacity onPress={() => { }}>
        <Avatar.Image size={40} source={{ uri: "https://picsum.photos/200/300" }} />
      </TouchableOpacity>
    </View>
  );
}

const Playground = () => {
  return (
    <Drawer.Navigator initialRouteName="LipSync" screenOptions={{ headerTitle: "Sync.labs", headerRight: AvatarCom }}>
      <Drawer.Screen name="LipSync" component={LipSync} />
      <Drawer.Screen name="Random" component={Random} />
    </Drawer.Navigator>
  )
}

export default Playground