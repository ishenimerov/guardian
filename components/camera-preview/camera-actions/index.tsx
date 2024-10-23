import { useCallback, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '@constants/colors'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { CameraType, FlashMode } from 'expo-camera'
import { Stack, XStack, YStack } from 'tamagui'
import { PressableYStack } from '@components/common/atoms/pressable'

export type CameraActionsProps = {
  flash: FlashMode
  toggleFlash: () => void
  type: CameraType
  toggleType: () => void
  takePicture: () => void
  takeVideo: () => Promise<void>
  stopVideo: () => void
}

export function CameraActions(props: CameraActionsProps) {
  const [isFilming, setIsFilming] = useState(false)
  const insets = useSafeAreaInsets()

  const handleLongPress = useCallback(async () => {
    setIsFilming(true)
    await props.takeVideo()
    setIsFilming(false)
  }, [props])

  return (
    <YStack flex={1} justifyContent="flex-end" pb={insets.bottom}>
      <XStack alignItems="center" justifyContent="space-evenly" mb="$2" width="100%">
        <PressableYStack bc="$black050" br={100} p="$2" onPress={props.toggleFlash}>
          <Ionicons
            color={props.flash === FlashMode.on ? COLORS.lightOrange100 : COLORS.white100}
            name={props.flash === FlashMode.on ? 'flash' : 'flash-outline'}
            opacity={1}
            size={30}
          />
        </PressableYStack>
        <PressableYStack onLongPress={handleLongPress} onPress={props.takePicture} onPressOut={props.stopVideo}>
          <XStack ai="center" borderColor="$white100" borderWidth="$1.5" br={100} jc="center">
            <Stack backgroundColor={isFilming ? COLORS.red100 : COLORS.white100} br={100} h="$6" m="$1" w="$6" />
          </XStack>
        </PressableYStack>

        <PressableYStack bc="$black050" br={100} p="$2" onPress={props.toggleType}>
          <Ionicons
            color={props.type === CameraType.back ? COLORS.lightOrange100 : COLORS.white100}
            name="sync-outline"
            opacity={1}
            size={30}
          />
        </PressableYStack>
      </XStack>
    </YStack>
  )
}
