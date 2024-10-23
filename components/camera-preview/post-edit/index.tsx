import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '@constants/colors'
import { useNavigation, useRouter } from 'expo-router'
import { MediaConfirmBackModal } from 'src/components/modal/media-confirm-back-modal'
import { YStack } from 'tamagui'
import { MediaPreview } from '@components/camera-preview/media-preview'
import { Header } from '@components/common/molecules/header/header'
import { useModal } from '@components/modal'
import { useCreatePostContext } from '@providers/create-post/create-post-provider'
import { Actions } from './actions'
import { MediaEdit } from './media-edit'

export function PostEdit() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { selectedMediaURI, clearPostData } = useCreatePostContext()
  const navigation = useNavigation()
  const confirmBackModal = useModal({ withLogo: false })
  const [confirmationAction, setConfirmationAction] = useState<() => void>()

  useEffect(() => {
    const removeListener = navigation.addListener('beforeRemove', e => {
      const payload = e.data.action?.payload as { params: { params: { params: { confirmed?: 1 | never } } } }
      const confirmed = !!payload?.params?.params?.params?.confirmed

      if (selectedMediaURI && !confirmed) {
        e.preventDefault()
        confirmBackModal.openModal()
        setConfirmationAction(() => () => {
          clearPostData()
          confirmBackModal.closeModal()
          navigation.dispatch(e.data.action)
        })
      }

      return () => {
        removeListener()
      }
    })
  }, [clearPostData, confirmBackModal, navigation, selectedMediaURI])

  if (!selectedMediaURI) {
    router.back()

    return null
  }

  return (
    <>
      <YStack bc={COLORS.neutralSoftBlack} flex={1} paddingTop={insets.top}>
        <Header marginBottom="$3" px="$3" subTitleKey="createPost.selectMedia.title" titleKey="createPost.title" />
        <MediaEdit uri={selectedMediaURI} />
        <MediaPreview uri={selectedMediaURI} />
        <Actions />
      </YStack>
      {confirmationAction && <MediaConfirmBackModal {...confirmBackModal} onConfirmDiscard={confirmationAction} />}
    </>
  )
}
