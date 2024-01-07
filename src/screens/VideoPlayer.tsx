import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Button, SafeAreaView } from 'react-native';
import { Video, ResizeMode, Audio } from 'expo-av';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

interface VideoPlayerProps {
    url: string
}

enum Tab {
    SYNCED = 'synced',
    VIDEO = 'video',
    AUDIO = 'audio'
}

const VideoPlayer = (props: VideoPlayerProps) => {
    const navigation = useNavigation();
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [tab, setTab] = React.useState<Tab>(Tab.SYNCED);

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
                    ref={video}
                    className='w-full h-1/2 bg-black'
                    source={{
                        uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
            }
            {tab === Tab.VIDEO &&
                <Video
                    ref={video}
                    className='w-full h-1/2 bg-black'
                    source={{
                        uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
            }
            {tab === Tab.AUDIO &&
                <Video
                    ref={video}
                    className='w-full h-1/2 bg-black'
                    source={{
                        uri: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
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
                <Text className='text-xl'>Date: 12th Jan 2024</Text>
                <Text className='text-xl'>Job-id: 12th Jan 2024</Text>
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
