import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Appbar } from 'react-native-paper';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from "expo-constants"
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { ApiResponse } from '../../utils/interfaces';

type RootStackParamList = {
  VideoPlayer: {
    job_id: string;
  };
};

interface VideoPlayerScreenProps {
  route: RouteProp<RootStackParamList, 'VideoPlayer'>;
}

enum Tab {
  SYNCED = 'synced',
  VIDEO = 'video',
  AUDIO = 'audio'
}

const VideoPlayer: React.FC<VideoPlayerScreenProps> = ({ route }) => {
  const { job_id } = route.params;
  const navigation = useNavigation();
  const [status, setStatus] = React.useState({});
  const [tab, setTab] = React.useState<Tab>(Tab.SYNCED);
  const [videoLoader, setVideoLoader] = React.useState<boolean>();
  const [syncData, setSyncData] = React.useState<ApiResponse>();

  const SYNC_API_KEY = Constants?.expoConfig?.extra?.syncLabsApiKey;
  const SYNC_API_ENDPOINT = Constants?.expoConfig?.extra?.syncLabsApiUrl

  const getJobDetails = async (): Promise<ApiResponse> => {
    const resFromSync = await fetch(`${SYNC_API_ENDPOINT}/${job_id}`, {
      headers: {
        accept: 'application/json',
        'x-api-key': SYNC_API_KEY
      }
    });
    const res = await resFromSync.json();
    return res;
  }

  React.useEffect(() => {
    getJobDetails().then((res) => {
      setSyncData(res);
    })
  }, [])

  return (
    <SafeAreaView className='h-full bg-black'>
      <Appbar.Header className='bg-black'>
        <Appbar.BackAction onPress={() => { navigation.goBack() }} iconColor='white' />
        <Appbar.Content title="LipSync Job" color='white' />
      </Appbar.Header>
      <View className='flex flex-row justify-evenly w-full'>
        <TouchableOpacity className='w-1/3 items-center py-2' style={[tab === Tab.SYNCED ? styles.selectedTab : null]} onPress={() => setTab(Tab.SYNCED)}>
          <Text style={[tab === Tab.SYNCED ? styles.seletedTabText : styles.unselectedTabText]}>synced</Text>
        </TouchableOpacity >
        <TouchableOpacity className='w-1/3 items-center py-2' style={[tab === Tab.VIDEO ? styles.selectedTab : null]} onPress={() => setTab(Tab.VIDEO)}>
          <Text style={[tab === Tab.VIDEO ? styles.seletedTabText : styles.unselectedTabText]}>video</Text>
        </TouchableOpacity>
        <TouchableOpacity className='w-1/3 items-center py-2' style={[tab === Tab.AUDIO ? styles.selectedTab : null]} onPress={() => setTab(Tab.AUDIO)}>
          <Text style={[tab === Tab.AUDIO ? styles.seletedTabText : styles.unselectedTabText]}>audio</Text>
        </TouchableOpacity>
      </View>
      {tab === Tab.SYNCED &&
        ((!syncData?.url && syncData?.original_video_url) ?
          <View className='w-full h-1/3 bg-black flex justify-center items-center'>
            <ActivityIndicator animating={true} color={MD2Colors.white} />
            <Text className='pt-2 text-white'>Sync generation is in progress..</Text>
          </View>
          :
          <Video
            className='w-full h-1/3 bg-black'
            onLoadStart={() => setVideoLoader(true)}
            onLoad={() => setVideoLoader(false)}
            source={{
              uri: syncData?.url ?? ""
            }}
            useNativeControls
            shouldPlay
            resizeMode={ResizeMode.CONTAIN}
            onPlaybackStatusUpdate={status => setStatus(() => status)}
          />
        )
      }
      {tab === Tab.VIDEO &&
        <Video
          className='w-full h-1/3 bg-black'
          onLoadStart={() => setVideoLoader(true)}
          onLoad={() => setVideoLoader(false)}
          source={{
            uri: syncData?.original_video_url ?? ""
          }}
          useNativeControls
          shouldPlay
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      }
      {tab === Tab.AUDIO &&
        <Video
          className='w-full h-1/3 bg-black'
          onLoadStart={() => setVideoLoader(true)}
          onLoad={() => setVideoLoader(false)}
          source={{
            uri: syncData?.original_audio_url ?? ""
          }}
          shouldPlay
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      }
      <View className='h-8 flex px-3 w-full'>
        {videoLoader ?
          <View className='items-start'>          
            <ActivityIndicator animating={true} color={MD2Colors.white} size={25} />
          </View>
          :
          <Text className='text-white'>enjoy the video!!</Text>
        }
      </View>
      <View className='flex flex-row justify-start items-center w-full p-2 gap-2'>
        <TouchableOpacity className='w-1/5 items-center p-2 rounded-lg border border-white'>
          <AntDesign name="like1" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className='w-1/5 items-center p-2 rounded-lg border  border-white'>
          <AntDesign name="dislike1" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className='w-1/5 items-center p-2 rounded-lg  border border-white'>
          <FontAwesome name="share" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className='w-1/5 items-center p-2 rounded-lg  border border-white'>
          <MaterialIcons name="delete" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

export default VideoPlayer

const styles = StyleSheet.create({
  selectedTab: {
    backgroundColor: "white",
    borderRadius: 10,
  },
  seletedTabText: {
    color: "black"
  },
  unselectedTabText: {
    color: "white"
  },
});
