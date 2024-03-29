import React from 'react'
import { DrawerNavigationProp, createDrawerNavigator } from '@react-navigation/drawer';
import Playground from './screens/Playground';
import Subscription from './screens/Subscription';
import Usage from './screens/Usage';
import Avatar from './components/Avatar';
import { MaterialIcons } from '@expo/vector-icons';
import { Image, TouchableOpacity, View } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { IJob, IUser } from '../utils/interfaces';

const DrawerStack = createDrawerNavigator();

type LeftHeaderProps = {
    navigation: DrawerNavigationProp<any>;
};

interface DrawerNavigationProps {
    user: IUser;
    allJobs?: IJob[];
    addJobToAllJobs: (job: IJob) => void;
}

const LeftHeader = (props: LeftHeaderProps) => {
    return (
        <View className='flex flex-row justify-center items-center pl-2'>
            <TouchableOpacity onPress={() => props.navigation.openDrawer()} className='pr-2'><MaterialIcons name="menu" size={24} color="white" /></TouchableOpacity>
            <Image source={{ uri: "https://app.synclabs.so/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsync_logo_white.3adfc347.png&w=1080&q=50" }} style={{ width: 75, height: 25 }} />
        </View>
    );
};

const DrawerNavigator = (props: DrawerNavigationProps) => {
    // const user = useUser();

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
                        uri={props.user.picture}
                        onPress={() => navigation.navigate("Profile")}
                    />
                ),
                headerTitle: ''
            })}
        >
            <DrawerStack.Screen name="Playground" children={() => <Playground allJobs={props.allJobs} addJobToAllJobs={props.addJobToAllJobs} user={props.user}/>} />
            {/* TODO : will be implemented later when we have automated apiKey generation */}
            {/*<DrawerStack.Screen name="Subscription" component={Subscription} />
      <DrawerStack.Screen name="Usage" component={Usage} /> */}
        </DrawerStack.Navigator>
    )
}

export default DrawerNavigator