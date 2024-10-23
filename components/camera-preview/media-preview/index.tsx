import React, { useRef } from 'react'
import { ResizeMode, Video } from 'expo-av'
import { Image, YStack } from 'tamagui'

export function MediaPreview(props: { uri: string }) {
  const video = useRef<Video>(null)

  if (!isVideo(props.uri)) {
    return (
      <YStack flex={1} overflow="hidden">
        <Image overflow="hidden" source={props} style={{ flex: 1 }} />
      </YStack>
    )
  }

  return (
    <YStack borderRadius="$5" flex={1} overflow="hidden">
      <Video
        ref={video}
        resizeMode={ResizeMode.COVER}
        source={props}
        style={{ width: '100%', height: '100%' }}
        isLooping
        shouldPlay
        useNativeControls
      />
    </YStack>
  )
}

function isVideo(uri: string) {
  return uri.endsWith('.mov')
}
