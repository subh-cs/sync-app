import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, SafeAreaView, TextInput, Alert } from 'react-native'
import React from 'react'
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
const { useNavigation } = require('@react-navigation/native');
import Constants from "expo-constants"
import * as VideoThumbnails from 'expo-video-thumbnails';
import { supabase } from '../utils/supabase';
import { useUser } from '@clerk/clerk-expo';
import * as Crypto from 'expo-crypto';

enum UploadStrategy {
  UPLOAD = "UPLOAD",
  YOUTUBE = "YOUTUBE",
  OTHER_URL = "OTHER_URL"
}

interface IFile {
  strategy?: UploadStrategy;
  uri: string;
  name?: string;
  type: "video" | "audio";
  file: File;
}

const UploadComp = ({ uploadStrategyState, showAlert, pickVideo, pickAudio }: { uploadStrategyState: UploadStrategy, showAlert: (url: string, strategy: UploadStrategy) => void, pickVideo: () => void, pickAudio: () => void }) => {

  const [youtubeInputUrl, setYoutubeInputUrl] = React.useState<string>("")
  const [otherInputUrl, setOtherInputUrl] = React.useState<string>("")

  if (uploadStrategyState === UploadStrategy.UPLOAD) {
    return (
      <View className='w-full flex flex-row justify-evenly items-center h-24 bg-slate-400 rounded-lg'>
        <TouchableOpacity className='bg-slate-100 p-2 rounded-lg' onPress={pickVideo}><Text>upload video</Text></TouchableOpacity>
        <TouchableOpacity className='bg-slate-100 p-2 rounded-lg' onPress={pickAudio}><Text>upload audio</Text></TouchableOpacity>
      </View>
    )
  } else if (uploadStrategyState === UploadStrategy.YOUTUBE) {
    return (
      <View className='flex justify-center items-center h-20 bg-slate-400 rounded-lg w-full'>
        <Text className='pb-2'>add youtube url</Text>
        <View className='w-full h-12 flex flex-row px-2 pb-2 justify-evenly'>
          <TextInput value={youtubeInputUrl} onChangeText={setYoutubeInputUrl} className='w-4/6 h-full border border-slate-800 rounded-lg p-2' placeholder='add video url' />
          <TouchableOpacity className='w-1/6 h-full bg-neutral-100 border flex justify-center items-center rounded-lg' onPress={() => { showAlert(youtubeInputUrl, UploadStrategy.YOUTUBE); setYoutubeInputUrl("") }}><Text>Add</Text></TouchableOpacity>
        </View>
      </View>
    )
  }
  else if (uploadStrategyState === UploadStrategy.OTHER_URL) {
    return (
      <View className='flex justify-center items-center h-20 bg-slate-400 rounded-lg'>
        <Text className='pb-2'>add other url</Text>
        <View className='w-full h-12 flex flex-row px-2 pb-2 justify-evenly'>
          <TextInput value={otherInputUrl} onChangeText={setOtherInputUrl} className='w-4/6 h-full border border-slate-800 rounded-lg p-2' placeholder='s3, dropbox video url' />
          <TouchableOpacity className='w-1/6 h-full bg-neutral-100 border flex justify-center items-center rounded-lg' onPress={() => { showAlert(otherInputUrl, UploadStrategy.OTHER_URL); setOtherInputUrl("") }}><Text>Add</Text></TouchableOpacity>
        </View>
      </View>
    )
  }
}

const Playground = () => {
  const navigation = useNavigation();

  const [uploadStrategyState, setUploadStrategyState] = React.useState<UploadStrategy>(UploadStrategy.UPLOAD)

  const [videoFile, setVideoFile] = React.useState<IFile>()
  const [audioFile, setAudioFile] = React.useState<IFile>()

  const [thumbnail, setThumbnail] = React.useState<string>("")

  const user = useUser();


  const pickVideo = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
    });

    if (result.canceled === false) {
      console.log(result.assets[0]);
      console.log(typeof (result.assets[0]));
      setVideoFile({
        strategy: UploadStrategy.UPLOAD,
        uri: result.assets[0].uri,
        type: "video",
        name: result.assets[0].name,
        file: result.assets[0].file as File
      });
    }
  }

  const pickAudio = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
    });
    if (result.canceled === false) {
      console.log(result.assets[0]);
      setAudioFile({
        strategy: UploadStrategy.UPLOAD,
        uri: result.assets[0].uri,
        type: "audio",
        name: result.assets[0].name,
        file: result.assets[0].file as File
      });
    }
  }

  const addUrl = (url: string, strategy: UploadStrategy, type: "video" | "audio") => {

    if (type === "video") {
      setVideoFile({
        strategy: strategy,
        uri: url,
        type: type,
        file: new File([], "video")
      })
    } else if (type === "audio") {
      setAudioFile({
        strategy: strategy,
        uri: url,
        type: type,
        file: new File([], "audio")
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
        'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        {
          time: 2000,
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

    if (uploadStrategyState === UploadStrategy.UPLOAD) {
      // upload video to supabase
      const uploadVideoResFromSupabase = await supabase.storage.from("local").upload(`${user.user?.emailAddresses[0].emailAddress}/video/${videoFile.name + Crypto.randomUUID()}.mp4`, videoFile.file);
      // upload audio to supabase
      const uploadAudioResFromSupabase = await supabase.storage.from("local").upload(`${user.user?.emailAddresses[0].emailAddress}/audio/${videoFile.name + Crypto.randomUUID()}.mp4`, videoFile.file);

      // get video url
      const videoUrl = await supabase.storage.from("local").getPublicUrl(uploadVideoResFromSupabase.data?.path ?? "");
      // get audio url
      const audioUrl = await supabase.storage.from("local").getPublicUrl(uploadAudioResFromSupabase.data?.path ?? "");
    }

    const SYNC_API_KEY = Constants?.expoConfig?.extra?.syncLabsApiKey;
    const SYNC_API_ENDPOINT = "https://api.synclabs.so/video";

    console.log(1);
    console.log("API KEY", SYNC_API_KEY);
    // make post api call to sync labs with api key as header
    const response = await fetch(SYNC_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "x-api-key": SYNC_API_KEY,

      },
      body: JSON.stringify({
        videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        audioUrl: "https://samplelib.com/lib/preview/mp3/sample-15s.mp3",
        synergize: true,
        maxCredits: 20,
        webhookUrl: null
      }),
    });
    console.log(2);
    const syncApiRes = await response.json();
    console.log("syncres", JSON.stringify(syncApiRes));

    const newRowToSupabase = await supabase.from('sync-job').insert(
      {
        job_id: syncApiRes.id,
        user_email: user.user?.emailAddresses[0].emailAddress,
        original_video_url: syncApiRes.original_video_url,
      }
    ).select();
    console.log("database response", JSON.stringify(newRowToSupabase));
    console.log(7);
    if (newRowToSupabase.error) {
      console.log(newRowToSupabase.error);
      throw newRowToSupabase.error;
      return;
    }
    console.log(8);
    console.log("new row added to supabase");
  }

  return (
    <SafeAreaView>
      <ScrollView className='flex'>
        <View className='px-2'>
        </View>

        <View className='p-2'>
          <View className=''>
            <View>
              <Text className="font-bold text-base border-b-0">videofile</Text>
              <View className='flex flex-row justify-between items-center h-12'>
                {videoFile ? (<View className='flex flex-row justify-between items-center'>
                  <TouchableOpacity><Entypo name="video" size={30} color="black" /></TouchableOpacity>
                  <Text className='px-2'>
                    {/* only render 15 words */}
                    {
                      videoFile.name ? videoFile.name.slice(0, 30) :
                        videoFile.uri.slice(0, 30)
                    }
                  </Text>
                </View>) : (
                  <Text>No videoFile selected (required*)</Text>
                )}
                {videoFile && <TouchableOpacity className='bg-red-400 rounded-full' onPress={clearVideoFile}><MaterialIcons name="cancel" size={24} color="white" /></TouchableOpacity>}
              </View>
            </View>
            <View >
              <Text className="font-bold text-base">audiofile</Text>
              <View className='flex flex-row justify-between items-center h-12'>

                {audioFile ? (<View className='flex flex-row justify-between items-center'>
                  <TouchableOpacity><MaterialIcons name="audiotrack" size={30} color="black" /></TouchableOpacity>
                  <Text className='px-2'>
                    {/* only render 15 words */}
                    {
                      audioFile.name ? audioFile.name.slice(0, 30) :
                        audioFile.uri.slice(0, 30)
                    }
                  </Text>
                </View>) : (
                  <Text>No audioFile selected (required*)</Text>
                )}
                {audioFile && <TouchableOpacity className='bg-red-400 rounded-full' onPress={clearAudioFile}><MaterialIcons name="cancel" size={24} color="white" /></TouchableOpacity>}
              </View>
            </View>
          </View>
          <View className='flex justify-center items-center h-24 bg-slate-400 rounded-lg'>
            <UploadComp uploadStrategyState={uploadStrategyState} showAlert={showAlert} pickVideo={pickVideo} pickAudio={pickAudio} />
          </View>
          <View className='flex flex-row justify-evenly items-center py-2 w-full'>
            <TouchableOpacity onPress={() => setUploadStrategyState(UploadStrategy.UPLOAD)} style={[uploadStrategyState === UploadStrategy.UPLOAD ? styles.selectedButton : styles.unselectedButton]} className='p-2 w-1/3 rounded-lg items-center'><Text>upload</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setUploadStrategyState(UploadStrategy.YOUTUBE)} style={[uploadStrategyState === UploadStrategy.YOUTUBE ? styles.selectedButton : styles.unselectedButton]} className='p-2 w-1/3 rounded-lg items-center'><Text>youtube</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setUploadStrategyState(UploadStrategy.OTHER_URL)} style={[uploadStrategyState === UploadStrategy.OTHER_URL ? styles.selectedButton : styles.unselectedButton]} className='p-2 w-1/3 rounded-lg items-center'><Text>other url</Text></TouchableOpacity>
          </View>
          <TouchableOpacity className='flex flex-row justify-center items-center bg-slate-400 py-4 rounded-lg' onPress={submitHandler}><Text className='text-white'>Submit</Text></TouchableOpacity>
        </View>
        {/* Thumbnail */}
        <View className='px-2'
        >
          <View>
            <TouchableOpacity className='py-2 items-center' onPress={() => navigation.navigate("VideoPlayer")}>
              <Image source={{ uri: "https://datasets-server.huggingface.co/assets/daspartho/mrbeast-thumbnails/--/default/train/24/image/image.jpg" }} className='h-52 w-full rounded-lg' />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity className='py-2 items-center' onPress={() => navigation.navigate("VideoPlayer")}>
              <Image source={{ uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }} className='h-52 w-full rounded-lg' />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity className='py-2 items-center' onPress={() => navigation.navigate("VideoPlayer")}>
              <Image source={{ uri: "https://datasets-server.huggingface.co/assets/daspartho/mrbeast-thumbnails/--/default/train/24/image/image.jpg" }} className='h-52 w-full rounded-lg' />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity className='py-2 items-center' onPress={() => navigation.navigate("VideoPlayer")}>
              <Image source={{ uri: "https://datasets-server.huggingface.co/assets/daspartho/mrbeast-thumbnails/--/default/train/24/image/image.jpg" }} className='h-52 w-full rounded-lg' />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity className='py-2 items-center' onPress={() => navigation.navigate("VideoPlayer")}>
              <Image source={{ uri: "https://datasets-server.huggingface.co/assets/daspartho/mrbeast-thumbnails/--/default/train/24/image/image.jpg" }} className='h-52 w-full rounded-lg' />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  selectedButton: {
    backgroundColor: "rgb(148 163 184)",
  },
  unselectedButton: {
  },
});

export default Playground