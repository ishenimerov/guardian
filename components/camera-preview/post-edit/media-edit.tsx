import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, ImageBackground } from 'react-native'
import ImageCropPicker, { Image } from 'react-native-image-crop-picker'
import { useRouter } from 'expo-router'
import { Stack } from 'tamagui'
import { ButtonPrimary } from '@components/common/atoms/button'

interface MediaEditState {
  isVisible: boolean
  uri: string
}

export function MediaEdit(props: { uri: string }) {
  const router = useRouter()

  const [state, setState] = useState<MediaEditState>({
    isVisible: false,
    uri: props.uri,
  })

  useEffect(() => {
    // Cleanup if the component unmounts
    return () => {
      ImageCropPicker.clean()
    }
  }, [])

  const onToggleModal = () => {
    setState(prevState => ({ ...prevState, isVisible: !prevState.isVisible }))
  }

  const handleImageCrop = async () => {
    try {
      const image: Image = await ImageCropPicker.openCropper({
        path: state.uri,
        width: 900,
        height: 1600,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 1,
      })

      setState(prevState => ({ ...prevState, uri: `data:image/jpeg;base64,${image.data}` }))
    } catch (ignored) {
      // User dismissed the crop view
    }
  }

  useEffect(() => {
    handleImageCrop()
  }, [])

  return <Stack />
}
