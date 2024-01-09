import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import Profile from './screens/Profile';
import VideoPlayer from './screens/VideoPlayer';
import VideoGallery from './screens/VideoGallery';
import { useUser } from '@clerk/clerk-expo';
import { IJob } from '../utils/interfaces';
import { supabase } from '../utils/supabase';

const InAppScreenStack = createNativeStackNavigator();

const InAppScreenNavigator = () => {

    const user = useUser();
    const [allJobs, setAllJobs] = React.useState<IJob[]>();

    async function getAllJobs() {
        const userEmailAddress = user.user?.emailAddresses[0].emailAddress;
        const resFromDb = await supabase
            .from('sync-job')
            .select('*')
            .eq('user_email', userEmailAddress);
        console.log("allJobsFromDB", resFromDb.data);
        const data = resFromDb.data?.reverse() as IJob[];
        setAllJobs(data);
    }

    // add latest job to top of allJobs
    function addJobToAllJobs(job: IJob) {
        setAllJobs((prevAllJobs) => {
            return [job, ...prevAllJobs!];
        })
    }

    useEffect(() => {
        if (user.isLoaded === true && user.isSignedIn === true) {
            getAllJobs();
        }
    }, [])

    return (
        <InAppScreenStack.Navigator screenOptions={{ headerShown: false }}>
            <InAppScreenStack.Screen name="DrawerNavigator" children={() => <DrawerNavigator allJobs={allJobs} addJobToAllJobs={addJobToAllJobs} />} />
            <InAppScreenStack.Screen name="Profile" component={Profile} />
            <InAppScreenStack.Screen name="VideoGallery" children={() => <VideoGallery allJobs={allJobs} />} />
            <InAppScreenStack.Screen name="VideoPlayer" component={VideoPlayer} />
        </InAppScreenStack.Navigator>
    )
}

export default InAppScreenNavigator