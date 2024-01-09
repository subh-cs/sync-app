import { SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, Text } from 'react-native'
import React from 'react'
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

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
    <SafeAreaView className='h-full bg-black'>
      <Appbar.Header className='bg-black'>
        <Appbar.BackAction onPress={() => { navigation.goBack() }} iconColor='white' />
        <Appbar.Content title="Video Gallery" color='white' />
      </Appbar.Header>
      <ScrollView>
        {props.allJobs?.length === 0 && <Text className='text-white text-center mt-12'>No videos found</Text>}
        {props.allJobs?.map((job, index) => (
          <TouchableOpacity key={index} className='py-2 items-center rounded-lg' onPress={() => navigation.navigate("VideoPlayer", { job_id: job.job_id })}>
            <ImageBackground source={{ uri: job.thumbnail_url }} className='h-52 w-full rounded-lg opacity-50 flex justify-center items-center'>
              <Entypo name="controller-play" size={60} color="white" />
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  )
}

export default VideoGallery