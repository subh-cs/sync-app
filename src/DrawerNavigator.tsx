import React from 'react'
import { DrawerNavigationProp, createDrawerNavigator } from '@react-navigation/drawer';
import Playground from './screens/Playground';
import Subscription from './screens/Subscription';
import Usage from './screens/Usage';
import ApiKey from './screens/ApiKey';
import Avatar from './components/Avatar';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Image, TouchableOpacity, View } from 'react-native';
import { useUser } from '@clerk/clerk-expo';

interface Job {
  created_at: string;
  job_id: string;
  thumbnail_url: string;
  user_email: string;
}

const DrawerStack = createDrawerNavigator();

type Props = {
  navigation: DrawerNavigationProp<any>;
};

interface DrawerNavigationProps {
  allJobs?: Job[];
}

const LeftHeader = ({ navigation }: Props) => {
  return (
    <View className='flex flex-row justify-center items-center pl-2'>
      <TouchableOpacity onPress={() => navigation.openDrawer()} className='pr-2'><MaterialIcons name="menu" size={24} color="white" /></TouchableOpacity>
      <Image source={{ uri: "https://app.synclabs.so/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsync_logo_white.3adfc347.png&w=1080&q=50" }} style={{ width: 75, height: 25 }} />
    </View>
  );
};

const DrawerNavigator = (props: DrawerNavigationProps) => {
  const user = useUser();

  return (
    <DrawerStack.Navigator
      initialRouteName="Playground"
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: 'black'
        },
        drawerActiveBackgroundColor: 'white',
        drawerInactiveBackgroundColor: 'gray',
        drawerActiveTintColor: 'black',
        drawerInactiveTintColor: 'white',
        drawerStyle: {
          backgroundColor: 'black',
        },
        headerLeft: () => <LeftHeader navigation={navigation} />,
        headerRight: () => (
          <Avatar
            size={40}
            uri={user.user?.imageUrl}
            onPress={() => navigation.navigate("Profile")}
          />
        ),
        headerTitle: ''
      })}
    >
      <DrawerStack.Screen name="Playground" children={()=> <Playground allJobs={props.allJobs}/>} />
      <DrawerStack.Screen name="Subscription" component={Subscription} />
      <DrawerStack.Screen name="Usage" component={Usage} />
      <DrawerStack.Screen name="ApiKey" component={ApiKey} />
    </DrawerStack.Navigator>

  )
}

export default DrawerNavigator