import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Avatar as AvatarComp } from 'react-native-paper';

interface AvatarProps {
    size?: number,
    uri?: string,
    onPress(): void
}

const Avatar = (props: AvatarProps) => {
    return (
        <View className='px-2'>
            <TouchableOpacity onPress={() => props.onPress()}>
                <AvatarComp.Image size={props.size} source={{ uri: props.uri }} />
            </TouchableOpacity>
        </View>
    )
}

export default Avatar