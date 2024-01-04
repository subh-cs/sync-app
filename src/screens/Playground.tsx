import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, SafeAreaView, TextInput } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';

enum UploadStrategy {
  UPLOAD = "UPLOAD",
  YOUTUBE = "YOUTUBE",
  OTHER_URL = "OTHER_URL"
}

const UploadComp = ({ uploadStrategyState }: { uploadStrategyState: UploadStrategy }) => {
  if (uploadStrategyState === UploadStrategy.UPLOAD) {
    return (
      <View className='flex justify-center items-center h-24 bg-slate-400 rounded-lg'>
        <Feather name="upload" size={24} color="white" />
        <Text className='text-white'>(*must upload both audio and video file)</Text>
      </View>
    )
  } else if (uploadStrategyState === UploadStrategy.YOUTUBE) {
    return (
      <View className='flex justify-center items-center h-20 bg-slate-400 rounded-lg w-full'>
        <Text className='pb-2'>add youtube url</Text>
        <View className='w-full h-12 flex flex-row px-2 pb-2'>
          <TextInput className='w-3/4 h-full border border-slate-800 rounded-lg p-2' placeholder='add video url' />
          <TouchableOpacity className='w-1/4 h-full bg-neutral-100 border flex justify-center items-center rounded-lg'><Text>Add</Text></TouchableOpacity>
        </View>
        {/* <Text className='text-white'>(*must upload both audio and video file)</Text> */}
      </View>
    )
  }
  else if (uploadStrategyState === UploadStrategy.OTHER_URL) {
    return (
      <View className='flex justify-center items-center h-20 bg-slate-400 rounded-lg'>
        <Text className='pb-2'>add other url</Text>
        <View className='w-full h-12 flex flex-row px-2 pb-2'>
          <TextInput className='w-3/4 h-full border border-slate-800 rounded-lg p-2' placeholder='s3, dropbox video url' />
          <TouchableOpacity className='w-1/4 h-full bg-neutral-100 border flex justify-center items-center rounded-lg'><Text>Add</Text></TouchableOpacity>
        </View>
      </View>
    )
  }
}

const Playground = () => {

  const [uploadStrategyState, setUploadStrategyState] = React.useState<UploadStrategy>(UploadStrategy.UPLOAD)

  return (
    <SafeAreaView>
      <ScrollView className='w-full flex' contentContainerStyle={{ alignItems: "center", justifyContent: "flex-start" }}>
        <Text className='py-4 text-xl font-bold'>sync any video to any language</Text>
        <View className='w-full p-2 pt-4'>
          <Text>Video Url* : https://www.youtube.com/</Text>
          <Text>Audio Url* : https://www.youtube.com </Text>
          <View className='flex justify-center items-center h-24 bg-slate-400 rounded-lg'>
            <UploadComp uploadStrategyState={uploadStrategyState} />
          </View>
          <View className='flex flex-row justify-between items-center py-2'>
            <TouchableOpacity onPress={() => setUploadStrategyState(UploadStrategy.UPLOAD)} style={[uploadStrategyState === UploadStrategy.UPLOAD ? styles.selectedButton : styles.unselectedButton]} className='p-2 px-4 rounded-lg'><Text>upload</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setUploadStrategyState(UploadStrategy.YOUTUBE)} style={[uploadStrategyState === UploadStrategy.YOUTUBE ? styles.selectedButton : styles.unselectedButton]} className='p-2 px-4 rounded-lg'><Text>youtube</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setUploadStrategyState(UploadStrategy.OTHER_URL)} style={[uploadStrategyState === UploadStrategy.OTHER_URL ? styles.selectedButton : styles.unselectedButton]} className='p-2 px-4 rounded-lg'><Text>other url</Text></TouchableOpacity>
          </View>
          <TouchableOpacity className='flex flex-row justify-center items-center bg-slate-400 py-4 rounded-lg'><Text className='text-white'>Submit</Text></TouchableOpacity>
        </View>
        <View className='w-full p-2'>
          <Text className=''>Videos(4)</Text>
          {/* Thumbnail */}
          <TouchableOpacity className='py-2'>
            <Image source={{ uri: "https://datasets-server.huggingface.co/assets/daspartho/mrbeast-thumbnails/--/default/train/24/image/image.jpg" }} className='h-52 w-full rounded-lg' />
          </TouchableOpacity>
          <TouchableOpacity className='py-2'>
            <Image source={{ uri: "https://datasets-server.huggingface.co/assets/daspartho/mrbeast-thumbnails/--/default/train/24/image/image.jpg" }} className='h-52 w-full rounded-lg' />
          </TouchableOpacity>
          <TouchableOpacity className='py-2'>
            <Image source={{ uri: "https://datasets-server.huggingface.co/assets/daspartho/mrbeast-thumbnails/--/default/train/24/image/image.jpg" }} className='h-52 w-full rounded-lg' />
          </TouchableOpacity>
          <TouchableOpacity className='py-2'>
            <Image source={{ uri: "https://datasets-server.huggingface.co/assets/daspartho/mrbeast-thumbnails/--/default/train/24/image/image.jpg" }} className='h-52 w-full rounded-lg' />
          </TouchableOpacity>
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