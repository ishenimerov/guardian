import React, { useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GRADIENTS } from '@constants/colors'
import { useRouter } from 'expo-router'
import { YStack } from 'tamagui'
import { ButtonPrimary } from '@components/common/atoms/button'
import { useTranslations } from '@providers/i18n-provider/i18n-provider'

export function Actions() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { t } = useTranslations()

  const handleSave = useCallback(() => {
    router.push('/create-post/post-options/')
  }, [router])

  return (
    <YStack backgroundColor="$black060" bottom={0} left={0} pb={insets.bottom} position="absolute" right={0}>
      <YStack p="$3" pb="$6">
        <ButtonPrimary
          backgroundColor="$white100"
          borderRadius="$8"
          contentColor="dark"
          gradient={GRADIENTS.primary}
          onPress={handleSave}>
          {t('createPost.next')}
        </ButtonPrimary>
      </YStack>
    </YStack>
  )
}
