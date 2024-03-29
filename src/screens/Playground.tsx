import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert, ImageBackground } from 'react-native'
import React from 'react'
import { Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
const { useNavigation } = require('@react-navigation/native');
import * as VideoThumbnails from 'expo-video-thumbnails';
import { supabase } from '../../utils/supabase';
import { useUser } from '@clerk/clerk-expo';
import * as Crypto from 'expo-crypto';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer'
import { ActivityIndicator } from 'react-native-paper';
import { IJob, IUser } from '../../utils/interfaces';
import { IFile, UploadStrategy } from '../../utils/interfaces';
import env from '../../utils/env';

interface PlaygroundProps {
    allJobs?: IJob[];
    addJobToAllJobs: (job: IJob) => void;
    user: IUser
}

const uriToBase64 = async (uri: string) => {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    return base64;
}

const uploadYouTubeToS3 = async (url: string, pathPrefix: string, uploadAs: "video" | "audio") => {
    try {
        const response = await fetch(
            env.AWS_LAMBDA_UPLOAD_YOUTUBE_TO_S3_URL,
            {
                method: "POST",
                body: JSON.stringify({
                    url,
                    pathPrefix,
                    uploadAs,
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("youtubeVideoFromS3", data);
        return data; // or handle data as needed
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}

const UploadComp = ({ uploadStrategyState, showAlert, pickVideo, pickAudio }: { uploadStrategyState: UploadStrategy, showAlert: (url: string, strategy: UploadStrategy) => void, pickVideo: () => void, pickAudio: () => void }) => {

    const [youtubeInputUrl, setYoutubeInputUrl] = React.useState<string>("")
    const [otherInputUrl, setOtherInputUrl] = React.useState<string>("")

    if (uploadStrategyState === UploadStrategy.UPLOAD) {
        return (
            <View className='w-full flex flex-row justify-evenly items-center h-24 bg-black rounded-lg'>
                <TouchableOpacity className='bg-slate-100 p-2 rounded-lg' onPress={pickVideo}><Text>upload video</Text></TouchableOpacity>
                <TouchableOpacity className='bg-slate-100 p-2 rounded-lg' onPress={pickAudio}><Text>upload audio</Text></TouchableOpacity>
            </View>
        )
    } else if (uploadStrategyState === UploadStrategy.YOUTUBE) {
        return (
            <View className='flex justify-center items-center h-20 bg-black rounded-lg w-full'>
                <Text className='pb-2 text-white'>add youtube url</Text>
                <View className='w-full h-12 flex flex-row px-2 pb-2 justify-evenly'>
                    <TextInput value={youtubeInputUrl} onChangeText={setYoutubeInputUrl} className='w-4/6 h-full border border-slate-400 rounded-lg p-2 text-white' placeholder='add video url' />
                    <TouchableOpacity className='w-1/6 h-full bg-neutral-100 border flex justify-center items-center rounded-lg' onPress={() => { showAlert(youtubeInputUrl, UploadStrategy.YOUTUBE); setYoutubeInputUrl("") }}><Text>Add</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
    else if (uploadStrategyState === UploadStrategy.OTHER_URL) {
        return (
            <View className='flex justify-center items-center h-20 bg-black rounded-lg'>
                <Text className='pb-2 text-white'>add other url</Text>
                <View className='w-full h-12 flex flex-row px-2 pb-2 justify-evenly'>
                    <TextInput value={otherInputUrl} onChangeText={setOtherInputUrl} className='w-4/6 h-full border border-slate-400 rounded-lg p-2 text-white' placeholder='s3, dropbox video url' />
                    <TouchableOpacity className='w-1/6 h-full bg-neutral-100 border flex justify-center items-center rounded-lg' onPress={() => { showAlert(otherInputUrl, UploadStrategy.OTHER_URL); setOtherInputUrl("") }}><Text>Add</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
}

const Playground = (props: PlaygroundProps) => {
    const navigation = useNavigation();

    const [uploadStrategyState, setUploadStrategyState] = React.useState<UploadStrategy>(UploadStrategy.UPLOAD)

    const [videoFile, setVideoFile] = React.useState<IFile>()
    const [audioFile, setAudioFile] = React.useState<IFile>()

    const [uploading, setUploading] = React.useState<boolean>(false);
    const [progress, setProgress] = React.useState<number>(0);


    const pickVideo = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: 'video/*',
        });

        if (result.canceled === false) {
            console.log(result.assets[0]);
            console.log(typeof (result.assets[0]));
            const base64Data = await uriToBase64(result.assets[0].uri);
            console.log(base64Data);
            setVideoFile({
                strategy: UploadStrategy.UPLOAD,
                uri: result.assets[0].uri,
                type: "video",
                name: result.assets[0].name,
                data: base64Data,
            });
        }
    }

    const pickAudio = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: 'audio/*',
        });
        if (result.canceled === false) {
            console.log(result.assets[0]);
            const base64Data = await uriToBase64(result.assets[0].uri);
            console.log(base64Data);
            setAudioFile({
                strategy: UploadStrategy.UPLOAD,
                uri: result.assets[0].uri,
                type: "audio",
                name: result.assets[0].name,
                data: base64Data
            });
        }
    }

    const addUrl = (url: string, strategy: UploadStrategy, type: "video" | "audio") => {

        // if strategy is youtube, check if the url is a valid youtube url
        if (strategy === UploadStrategy.YOUTUBE) {
            if (!url.includes("https://youtu.be") && !url.includes("https://www.youtube.com/watch?v")) {
                Alert.alert(
                    'Invalid Youtube URL',
                    'Please enter a valid youtube URL',
                    [
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed'),
                            style: 'default',
                        },
                    ],
                    {
                        cancelable: true,
                    },
                );
                return;
            }
        }

        if (type === "video") {
            // if the video is not from youtube, check if it is a valid video format url
            if (strategy !== UploadStrategy.YOUTUBE) {
                if (!url.endsWith(".mp4") || !url.endsWith(".mov") || !url.endsWith(".avi") || !url.endsWith(".mkv") || !url.endsWith(".webm")) {
                    Alert.alert(
                        'Invalid Video format URL',
                        'Please enter a valid video format URL, supported formats are mp4, mov, avi, mkv, webm',
                        [
                            {
                                text: 'OK',
                                onPress: () => console.log('OK Pressed'),
                                style: 'default',
                            },
                        ],
                        {
                            cancelable: true,
                        },
                    );
                    return;
                }
            }
            setVideoFile({
                strategy: strategy,
                uri: url,
                type: type,
                data: "youtubeVideo",
            })
        } else if (type === "audio") {

            // if the audio is not from youtube, check if it is a valid audio format url
            if (strategy !== UploadStrategy.YOUTUBE) {
                if (!url.endsWith(".mp3") || !url.endsWith(".wav") || !url.endsWith(".ogg") || !url.endsWith(".m4a") || !url.endsWith(".aac")) {
                    Alert.alert(
                        'Invalid Audio format URL',
                        'Please enter a valid audio format URL, supported formats are mp3, wav, ogg, m4a, aac',
                        [
                            {
                                text: 'OK',
                                onPress: () => console.log('OK Pressed'),
                                style: 'default',
                            },
                        ],
                        {
                            cancelable: true,
                        },
                    );
                    return;
                }
            }

            setAudioFile({
                strategy: strategy,
                uri: url,
                type: type,
                data: "youtubeAudio"
            });
        }
    }

    const clearAudioFile = () => {
        if (!audioFile) return;
        Alert.alert(
            'Clear audio file',
            'Are you sure you want to clear the audio file?',
            [
                {
                    text: 'Yes',
                    onPress: () => setAudioFile(undefined),
                    style: 'default',
                },
                {
                    text: 'No',
                    onPress: () => console.log('OK Pressed'),
                    style: 'default',
                },
            ],
            {
                cancelable: true,
            },
        );
    }

    const clearVideoFile = () => {
        if (!videoFile) return;
        Alert.alert(
            'Clear video file',
            'Are you sure you want to clear the video file?',
            [
                {
                    text: 'Yes',
                    onPress: () => setVideoFile(undefined),
                    style: 'default',
                },
                {
                    text: 'No',
                    onPress: () => console.log('OK Pressed'),
                    style: 'default',
                },
            ],
            {
                cancelable: true,
            },
        );
    }

    const showAlert = (url: string, strategy: UploadStrategy) => {

        if (!url) {
            Alert.alert(
                'Empty URL',
                'Please enter a valid URL',
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                        style: 'default',
                    },
                ],
                {
                    cancelable: true,
                },
            );
            return;
        }

        Alert.alert(
            'Select media type',
            'Would you like to use this Youtube URL for the video or audio?',
            [
                {
                    text: 'Audio',
                    onPress: () => addUrl(url, strategy, "audio"),
                    style: 'default',
                },
                {
                    text: 'Video',
                    onPress: () => addUrl(url, strategy, "video"),
                    style: 'default',
                },
            ],
            {
                cancelable: true,
            },
        );
    }

    // generate thumbnail
    const generateThumbnail = async (hostedVideoUrl: string) => {
        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
                hostedVideoUrl,
                {
                    time: 1000,
                }
            );
            return uri
        } catch (e) {
            console.warn(e);
            throw e;
        }
    };

    const submitHandler = async () => {

        if (!videoFile || !audioFile) {
            Alert.alert(
                'Missing files',
                'Please select both video and audio files',
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                        style: 'default',
                    },
                ],
                {
                    cancelable: true,
                },
            );
            return;
        }

        console.log("submitting");
        setUploading(true);

        let videoUrlForSyncLabs = "";
        let audioUrlForSyncLabs = "";
        setProgress(0)
        // video 
        console.log(1);
        if (videoFile.strategy === UploadStrategy.UPLOAD) {
            // if strategy is upload, upload to supabase storage and get public url
            console.log(`video/${videoFile.uri.slice(-3)}`);
            console.log(2)
            const uploadVideoResFromSupabase = await supabase.storage.from("local").upload(`${props.user.email}/video/${videoFile?.name + Crypto.randomUUID()}.mp4`, decode(videoFile.data), {
                contentType: `video/mp4`
            });
            console.log(3)
            if (uploadVideoResFromSupabase.error) throw uploadVideoResFromSupabase.error;
            console.log(4)
            videoUrlForSyncLabs = await supabase.storage.from("local").getPublicUrl(uploadVideoResFromSupabase.data?.path ?? "").data.publicUrl;
            console.log(5)
            if (!videoUrlForSyncLabs) throw new Error("Video url not found");
        } else if (videoFile.strategy === UploadStrategy.YOUTUBE) {
            // if strategy is youtube, upload to s3 and get public url
            const youtubeToS3Res = await uploadYouTubeToS3(videoFile.uri, `${props.user.email}/video/${videoFile.uri + Crypto.randomUUID()}.mp4`, "video");
            console.log("youtubeToS3ResVid", youtubeToS3Res);
            if (youtubeToS3Res.successful === false) throw new Error("something went wrong with youtube to s3 during video upload");
            videoUrlForSyncLabs = youtubeToS3Res.data.url;
        } else if (videoFile.strategy === UploadStrategy.OTHER_URL) {
            // if strategy is other url, use the url as it is
            videoUrlForSyncLabs = videoFile.uri
        }
        // video done 
        setProgress(0.1)
        // audio
        console.log(6);
        if (audioFile.strategy === UploadStrategy.UPLOAD) {
            // console.log(audioFile)
            console.log(7);
            // if strategy is upload, upload to supabase storage and get public url
            const uploadAudioResFromSupabase = await supabase.storage.from("local").upload(`${props.user.email}/audio/${audioFile?.name + Crypto.randomUUID()}.mp3`, decode(audioFile.data), {
                contentType: `audio/mp3`
            });
            console.log(8);
            if (uploadAudioResFromSupabase.error) throw uploadAudioResFromSupabase.error;
            console.log(9);
            audioUrlForSyncLabs = await supabase.storage.from("local").getPublicUrl(uploadAudioResFromSupabase.data?.path ?? "").data.publicUrl;
            console.log(10);
            if (!audioUrlForSyncLabs) throw new Error("Audio url not found");
        } else if (audioFile.strategy === UploadStrategy.YOUTUBE) {
            // if strategy is youtube, upload to s3 and get public url
            const youtubeToS3Res = await uploadYouTubeToS3(audioFile.uri, `${props.user.email}/audio/${audioFile.uri + Crypto.randomUUID()}.mp3`, "audio");
            console.log("youtubeToS3ResAud", youtubeToS3Res);
            if (youtubeToS3Res.successful === false) throw new Error("something went wrong with youtube to s3 during audio upload");
            audioUrlForSyncLabs = youtubeToS3Res.data.url;
        } else if (audioFile.strategy === UploadStrategy.OTHER_URL) {
            // if strategy is other url, use the url as it is
            audioUrlForSyncLabs = audioFile.uri
        }
        setProgress(0.2)
        console.log(11);
        console.log("videoUrlForSyncLabs", videoUrlForSyncLabs);
        console.log("audioUrlForSyncLabs", audioUrlForSyncLabs);

        // make post api call to sync labs with api key as header
        const response = await fetch(env.SYNCLABS_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                "x-api-key": env.SYNCLABS_API_KEY,

            },
            body: JSON.stringify({
                // videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                videoUrl: videoUrlForSyncLabs,
                // audioUrl: "https://samplelib.com/lib/preview/mp3/sample-15s.mp3",
                audioUrl: audioUrlForSyncLabs,
                synergize: true,
                maxCredits: 20,
                webhookUrl: null
            }),
        });
        if (!response.ok) throw new Error("Sync labs api call failed");
        console.log(2);
        setProgress(0.3)
        const syncApiRes = await response.json();
        setProgress(0.4)
        console.log("syncres", JSON.stringify(syncApiRes));

        // generate thumbnail
        const thumbnailUrl = await generateThumbnail(syncApiRes.original_video_url);
        setProgress(0.5)
        console.log("thumbnailUrlLocal", thumbnailUrl);
        const base64Thumbnail = await uriToBase64(thumbnailUrl);
        setProgress(0.6)
        // upload thumbnail to supabase storage and get public url
        const uploadThumbnailResFromSupabase = await supabase.storage.from("thumbnails").upload(`${props.user.email}/${videoFile?.name + Crypto.randomUUID()}.jpg`, decode(base64Thumbnail), {
            contentType: `image/jpg`
        });
        setProgress(0.7)
        if (uploadThumbnailResFromSupabase.error) throw uploadThumbnailResFromSupabase.error;

        const thumbnailUrlFromSupabase = await supabase.storage.from("thumbnails").getPublicUrl(uploadThumbnailResFromSupabase.data?.path).data.publicUrl;
        console.log("thumbnailUrlFromSupabase", thumbnailUrlFromSupabase);
        setProgress(0.8)
        if (!thumbnailUrlFromSupabase) throw new Error("Thumbnail url not found");

        const newRowToSupabase = await supabase.from('sync-job').insert(
            {
                job_id: syncApiRes.id,
                user_email: props.user.email,
                thumbnail_url: thumbnailUrlFromSupabase, // USED FOR THUMBNAIL
            }
        ).select();
        console.log("database response", JSON.stringify(newRowToSupabase));
        console.log(7);
        if (newRowToSupabase.error) {
            console.log(newRowToSupabase.error);
            throw newRowToSupabase.error;
        }
        setProgress(0.9)
        setUploading(false);
        setAudioFile(undefined);
        setVideoFile(undefined);

        const latestJob: IJob = {
            job_id: syncApiRes.id,
            thumbnail_url: thumbnailUrlFromSupabase,
            user_email: props.user.email,
            created_at: new Date().toISOString(),
        }

        await props.addJobToAllJobs?.(latestJob);

        console.log(8);
        console.log("new row added to supabase");
        setProgress(1)
    }

    return (
        <SafeAreaView className='bg-black h-full'>
            <ScrollView className='flex flex-col'>
                <View className='p-2'>
                    <View>
                        <View>
                            <Text className="font-bold text-base border-b-0 text-white">videofile</Text>
                            <View className='flex flex-row justify-between items-center h-12'>
                                {videoFile ? (<View className='flex flex-row justify-between items-center'>
                                    <TouchableOpacity><Entypo name="video" size={30} color="white" /></TouchableOpacity>
                                    <Text className='px-2 text-white'>
                                        {
                                            videoFile.name ? videoFile.name.slice(0, 30) :
                                                videoFile.uri.slice(0, 30)
                                        }
                                    </Text>
                                </View>) : (
                                    <Text className='text-white'>No videoFile selected (required*)</Text>
                                )}
                                {videoFile && <TouchableOpacity className='bg-red-400 rounded-full' onPress={() => uploading ? null : clearVideoFile()}><MaterialIcons name="cancel" size={24} color="white" /></TouchableOpacity>}
                            </View>
                        </View>
                        <View >
                            <Text className="font-bold text-base text-white">audiofile</Text>
                            <View className='flex flex-row justify-between items-center h-12'>

                                {audioFile ? (<View className='flex flex-row justify-between items-center'>
                                    <TouchableOpacity><MaterialIcons name="audiotrack" size={30} color="white" /></TouchableOpacity>
                                    <Text className='px-2 text-white'>
                                        {/* only render 15 words */}
                                        {
                                            audioFile.name ? audioFile.name.slice(0, 30) :
                                                audioFile.uri.slice(0, 30)
                                        }
                                    </Text>
                                </View>) : (
                                    <Text className='text-white'>No audioFile selected (required*)</Text>
                                )}
                                {audioFile && <TouchableOpacity className='bg-red-400 rounded-full' onPress={() => uploading ? null : clearAudioFile()}><MaterialIcons name="cancel" size={24} color="white" /></TouchableOpacity>}
                            </View>
                        </View>
                    </View>
                    <View className="flex-grow border-t border-gray-900"></View>
                    <View className='flex justify-center items-center h-24 bg-black rounded-lg'>
                        {uploading ? (
                            <View className='flex justify-center items-center'>
                                <Text className='text-white'>Uploading in progress...</Text>
                            </View>
                        ) : (
                            <UploadComp uploadStrategyState={uploadStrategyState} showAlert={showAlert} pickVideo={pickVideo} pickAudio={pickAudio} />
                        )}
                    </View>
                    <View className='flex flex-row justify-evenly items-center py-2 w-full'>
                        <TouchableOpacity onPress={() => setUploadStrategyState(UploadStrategy.UPLOAD)} style={[uploadStrategyState === UploadStrategy.UPLOAD ? styles.selectedButton : styles.unselectedButton]} className='p-2 w-1/3 rounded-lg items-center'><Text style={[uploadStrategyState === UploadStrategy.UPLOAD ? styles.selectedButtonText : styles.unselectedButtonText]}>upload</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => setUploadStrategyState(UploadStrategy.YOUTUBE)} style={[uploadStrategyState === UploadStrategy.YOUTUBE ? styles.selectedButton : styles.unselectedButton]} className='p-2 w-1/3 rounded-lg items-center'><Text style={[uploadStrategyState === UploadStrategy.YOUTUBE ? styles.selectedButtonText : styles.unselectedButtonText]}>youtube</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => setUploadStrategyState(UploadStrategy.OTHER_URL)} style={[uploadStrategyState === UploadStrategy.OTHER_URL ? styles.selectedButton : styles.unselectedButton]} className='p-2 w-1/3 rounded-lg items-center'><Text style={[uploadStrategyState === UploadStrategy.OTHER_URL ? styles.selectedButtonText : styles.unselectedButtonText]}>other url</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity className='flex flex-row justify-center items-center bg-white py-4 rounded-lg' onPress={submitHandler} disabled={uploading}>
                        {uploading ? (<ActivityIndicator animating={true} color="black" />) : (<Text className='text-black font-semibold'>Submit</Text>)}
                    </TouchableOpacity>
                </View>
                {/* Thumbnail */}
                <View className='px-2 bg-black'
                >
                    <View className='flex flex-row justify-between items-center py-2'>
                        <Text className='text-white text-lg'>Latest Videos</Text>
                        <TouchableOpacity className='flex flex-row justify-between items-center gap-2' onPress={() => navigation.navigate("VideoGallery")}>
                            <Text className='text-white'>More</Text>
                            <AntDesign name="arrowright" size={32} color="white" />
                        </TouchableOpacity>
                    </View>
                    {/* map over only two jobs */}
                    <View className="flex-grow border-t border-gray-900"></View>
                    {props.allJobs?.length === 0 && <Text className='text-white text-center mt-12'>No videos found</Text>}
                    {props.allJobs?.slice(0, 2).map((job, index) => (
                        <TouchableOpacity key={index} className='py-2 items-center rounded-lg bg-black' onPress={() => navigation.navigate("VideoPlayer", { job_id: job.job_id })}>
                            <ImageBackground source={{ uri: job.thumbnail_url }} className='h-52 w-full rounded-lg opacity-50 flex justify-center items-center bg-black'>
                                <Entypo name="controller-play" size={60} color="white" />
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}

                </View>
            </ScrollView>
            <StatusBar style="light" />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    selectedButton: {
        backgroundColor: "white",
    },
    selectedButtonText: {
        color: "black",
    },
    unselectedButton: {
        backgroundColor: "black",
    },
    unselectedButtonText: {
        color: "white",
    }
});

export default Playground