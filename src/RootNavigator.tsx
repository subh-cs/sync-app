import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import DrawerNavigator from './DrawerNavigator';
import Profile from './screens/Profile';
import VideoPlayer from './screens/VideoPlayer';
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import VideoGallery from './screens/VideoGallery';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from './utils/supabase';

const RootStack = createNativeStackNavigator();

interface Job {
    created_at: string;
    job_id: string;
    thumbnail_url: string;
    user_email: string;
}


const RootNavigator = () => {
    const user = useUser();
    const [allJobs, setAllJobs] = React.useState<Job[]>();
    const userEmailAddress = user.user?.emailAddresses[0].emailAddress;

    async function getAllJobs() {
        const resFromDb = await supabase
            .from('sync-job')
            .select('*')
            .eq('user_email', userEmailAddress);
        console.log("allJobsFromDB", resFromDb.data);
        const data = resFromDb.data?.reverse() as Job[];
        setAllJobs(data);
    }

    useEffect(() => {
        console.log("RootNavigator.tsx", user.user?.emailAddresses[0].emailAddress)
        if(user.isLoaded){
            getAllJobs();
        }
    }, [user.isLoaded])

    return (
        <>
            <SignedIn>
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    <RootStack.Screen name="DrawerNavigator" component={DrawerNavigator} />
                    <RootStack.Screen name="Profile" component={Profile} />
                    <RootStack.Screen name="VideoGallery" children={() => <VideoGallery allJobs={allJobs} />} />
                    <RootStack.Screen name="VideoPlayer" component={VideoPlayer} />
                </RootStack.Navigator>
            </SignedIn>
            <SignedOut>
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    <RootStack.Screen name="Login" component={Login} />
                </RootStack.Navigator>
            </SignedOut>
        </>
    )
}

export default RootNavigator
