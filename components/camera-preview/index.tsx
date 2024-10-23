import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Linking } from 'react-native'
import ImageCropPicker, { Image } from 'react-native-image-crop-picker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Camera, CameraType, FlashMode } from 'expo-camera'
import { useRouter } from 'expo-router'
import { YStack } from 'tamagui'
import { TButtonPrimary, TText } from '@components/common/atoms/locale'
import { Header } from '@components/common/molecules/header/header'
import { useCreatePostContext } from '@providers/create-post/create-post-provider'
import { logger } from '@services/logger'
import { CameraActions } from './camera-actions'

export function CameraPreview() {
  const router = useRouter()
  const cameraRef = useRef<Camera>(null)
  const [permission, requestPermission] = Camera.useCameraPermissions()
  // TODO: enable this when we support taking videos
  // const [audio, requestAudio] = Camera.useMicrophonePermissions()
  const [autoFocus, setAutoFocus] = useState(true)
  const insets = useSafeAreaInsets()

  const [flash, setFlash] = useState(FlashMode.off)
  const [type, setType] = useState(CameraType.front)

  const { setSelectedMediaURI } = useCreatePostContext()

  const { granted: grantedCamera, canAskAgain: canAskAgainCamera } = permission ?? {}
  // TODO: enable this when we support taking videos
  // const { granted: grantedAudio, canAskAgain: canAskAgainAudio } = audio ?? {}
  // const cameraAndAudio = grantedAudio && grantedCamera

  const camera = grantedCamera

  const handleImageCrop = useCallback(async (mediaUri: string) => {
    if (mediaUri) {
      try {
        const image: Image = await ImageCropPicker.openCropper({
          path: mediaUri,
          width: 900,
          height: 1600,
          cropping: true,
          mediaType: 'photo',
          compressImageQuality: 1,
        })

        return image.path
      } catch (ignored) {
        // User dismissed the crop view
      }
    }
  }, [])

  const takePicture = useCallback(async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync()
        const croppedImage = await handleImageCrop(data.uri)
        if (!croppedImage) return
        setSelectedMediaURI(croppedImage)
        router.push('/create-post/post-options/')
      } catch (e) {
        logger.error('[CAMERA] take picture fail with error', e)
      }
    }
  }, [handleImageCrop, router, setSelectedMediaURI])

  const takeVideo = useCallback(async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.recordAsync({
          maxDuration: 60,
        })

        setSelectedMediaURI(data.uri)
      } catch (e) {
        logger.error('[CAMERA] take video fail with error', e)
      }
    }
  }, [setSelectedMediaURI])

  const stopVideo = useCallback(async () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording()
    }
  }, [])

  const handleRequestPermission = useCallback(() => {
    // TODO: enable this when we support taking videos
    // if (!grantedCamera || !grantedAudio) {
    if (!grantedCamera) {
      if (canAskAgainCamera) {
        requestPermission()
      }
      // TODO: enable this when we support taking videos
      // if (canAskAgainAudio) {
      //   requestAudio()
      // }
      Linking.openSettings()
    }
  }, [canAskAgainCamera, grantedCamera, requestPermission])

  const toggleCameraType = useCallback(() => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
  }, [])

  const toggleCameraFlash = useCallback(() => {
    setFlash(current => (current === FlashMode.off ? FlashMode.on : FlashMode.off))
  }, [])

  const handlePress = useCallback(async () => {
    // AutoFocus is stuck after the initial focus [ref: https://github.com/expo/expo/issues/26869]
    // As a workaround, we set the autoFocus to false, a side effect will then re-set it to true to re-initialize the autofocus
    setAutoFocus(false)
  }, [])

  useEffect(() => {
    if (!grantedCamera) {
      requestPermission()
    }
  }, [grantedCamera, requestPermission])

  // TODO: enable this when we support taking videos
  // useEffect(() => {
  //   if (!grantedAudio) {
  //     requestAudio()
  //   }
  // }, [grantedAudio, requestAudio])

  useEffect(() => {
    if (cameraRef.current && !autoFocus) {
      // Reset autoFocus to true to re-initialize the autofocus
      setAutoFocus(true)
    }
  }, [autoFocus])

  return (
    <YStack backgroundColor="$neutralSoftBlack" flex={1} pt={insets.top}>
      <Header px="$3" subTitleKey="createPost.selectMedia.title" titleKey="createPost.title" />
      <YStack flex={1} mt="$3" overflow="hidden" onPress={handlePress}>
        {/* // TODO: enable this when we support taking videos */}
        {/* {!cameraAndAudio && ( */}
        {!camera && (
          <YStack ai="center" flex={1} justifyContent="center">
            <TText
              color="$white100"
              // TODO: enable this when we support taking videos
              // tKey={`cameraPreview.requestPermission.${grantedAudio ? 'camera' : 'audio'}Title`}
              tKey="cameraPreview.requestPermission.cameraTitle"
            />
            <TButtonPrimary
              backgroundColor="$neutralWhite"
              margin="$4"
              tKey="cameraPreview.requestPermission.button"
              onPress={handleRequestPermission}
            />
          </YStack>
        )}
        {/* // TODO: enable this when we support taking videos */}
        {/* {cameraAndAudio && ( */}
        {camera && (
          <Camera ref={cameraRef} autoFocus={autoFocus} flashMode={flash} ratio="16:9" style={{ flex: 1 }} type={type}>
            <CameraActions
              flash={flash}
              stopVideo={stopVideo}
              takePicture={takePicture}
              takeVideo={takeVideo}
              toggleFlash={toggleCameraFlash}
              toggleType={toggleCameraType}
              type={type}
            />
          </Camera>
        )}
      </YStack>
    </YStack>
  )
}
