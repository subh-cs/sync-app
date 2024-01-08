import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

interface Job {
    created_at: string;
    job_id: string;
    thumbnail_url: string;
    user_email: string;
}

interface VideoGalleryProps {
    allJobs?: Job[];
}

const VideoGallery = (props: VideoGalleryProps) => {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView className='h-full'>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Content title="Videos" />
            </Appbar.Header>
            <ScrollView>
                {props.allJobs?.map((job: Job, index) => {
                    return (
                        <TouchableOpacity className='p-2 items-center' onPress={() => navigation.navigate("VideoPlayer", { job_id: job.job_id })} key={index}>
                            <Image source={{ uri: job.thumbnail_url }} className='h-52 w-full rounded-lg' />
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </SafeAreaView>
    )
}

export default VideoGallery