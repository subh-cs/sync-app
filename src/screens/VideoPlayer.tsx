import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Button, SafeAreaView } from 'react-native';
import { Video, ResizeMode, Audio } from 'expo-av';
import { Appbar } from 'react-native-paper';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from "expo-constants"
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

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

interface ApiResponse {
    id: string;
    url: string;
    original_audio_url: string;
    original_video_url: string;
    status: string;
    synergize: boolean;
    credits_deducted: number;
}

const VideoPlayer: React.FC<VideoPlayerScreenProps> = ({ route }) => {
    const { job_id } = route.params;
    const navigation = useNavigation();
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [tab, setTab] = React.useState<Tab>(Tab.SYNCED);

    const [loading, setLoading] = React.useState(false);

    const [syncData, setSyncData] = React.useState<ApiResponse>();

    const SYNC_API_KEY = Constants?.expoConfig?.extra?.syncLabsApiKey;
    const SYNC_API_ENDPOINT = Constants?.expoConfig?.extra?.syncLabsApiUrl

    const getJobDetails = async (): Promise<ApiResponse> => {
        setLoading(true);
        const resFromSync = await fetch(`${SYNC_API_ENDPOINT}/${job_id}`, {
            headers: {
                accept: 'application/json',
                'x-api-key': SYNC_API_KEY
            }
        });
        const res = await resFromSync.json();
        setLoading(false);
        return res;
    }

    React.useEffect(() => {
        console.log("VideoPlayer.tsx", job_id);

        getJobDetails().then((res) => {
            console.log("res", res);
            setSyncData(res);
        })
    }, [])

    return (
        <SafeAreaView className='h-full'>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Content title="Dynamic Title" />
            </Appbar.Header>
            <View className='flex flex-row justify-evenly w-full'>
                <TouchableOpacity className='w-1/3 items-center py-2' style={[tab === Tab.SYNCED ? styles.selectedTab : null]} onPress={() => setTab(Tab.SYNCED)}>
                    <Text>synced</Text>
                </TouchableOpacity >
                <TouchableOpacity className='w-1/3 items-center py-2' style={[tab === Tab.VIDEO ? styles.selectedTab : null]} onPress={() => setTab(Tab.VIDEO)}>
                    <Text>video</Text>
                </TouchableOpacity>
                <TouchableOpacity className='w-1/3 items-center py-2' style={[tab === Tab.AUDIO ? styles.selectedTab : null]} onPress={() => setTab(Tab.AUDIO)}>
                    <Text>audio</Text>
                </TouchableOpacity>
            </View>
            {tab === Tab.SYNCED &&
                <Video
                    className='w-full h-1/2 bg-black'
                    source={{
                        uri: syncData?.url ?? ""
                        // uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
            }
            {tab === Tab.VIDEO &&
                <Video
                    className='w-full h-1/2 bg-black'
                    source={{
                        uri: syncData?.original_video_url ?? ""
                        // uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
            }
            {tab === Tab.AUDIO &&
                <Video
                    className='w-full h-1/2 bg-black'
                    source={{
                        uri: syncData?.original_audio_url ?? ""
                        // uri: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
            }


            <View className='flex flex-row justify-start items-center w-full p-2 gap-2'>
                <TouchableOpacity className='w-1/5 bg-slate-400 items-center p-2 rounded-lg'>
                    <AntDesign name="like1" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className='w-1/5 bg-slate-400 items-center p-2 rounded-lg'>
                    <AntDesign name="dislike1" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className='w-1/5 bg-slate-400 items-center p-2 rounded-lg'>
                    <FontAwesome name="share" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className='w-1/5 bg-slate-400 items-center p-2 rounded-lg'>
                    <MaterialIcons name="delete" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View className='p-2'>
                <Text className='text-xl'>Job-id: {syncData?.id}</Text>
            </View>
        </SafeAreaView>
    );
}

export default VideoPlayer

const styles = StyleSheet.create({
    selectedTab: {
        backgroundColor: "rgb(148 163 184)",
    }
});
