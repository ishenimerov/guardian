import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { FlashList } from '@shopify/flash-list'
import * as MediaLibrary from 'expo-media-library'
import { Asset, AssetsOptions } from 'expo-media-library/src/MediaLibrary'
import { useAppReopened } from '@hooks/common'
import { logger } from '@services/logger'

type UseMediaResponse = {
  items: MediaLibrary.Asset[]
  fetchNextPage: () => Promise<void>
}

type UseMedia = {
  album?: MediaLibrary.Album
  mediaType?: AssetsOptions['mediaType']
  flashListRef: MutableRefObject<FlashList<Asset> | null>
}

export const useMedia = ({ album, mediaType, flashListRef }: UseMedia): UseMediaResponse => {
  const fetching = useRef(false)
  const pagedInfo = useRef<MediaLibrary.PagedInfo<Asset>>()
  const [localItems, setLocalItems] = useState<MediaLibrary.Asset[]>([])

  const fetchAssets = useCallback(async () => {
    fetching.current = true
    if (flashListRef.current) {
      flashListRef.current.scrollToOffset({ animated: false, offset: 0 })
    }
    MediaLibrary.getAssetsAsync({ album, mediaType, first: 10, sortBy: MediaLibrary.SortBy.creationTime })
      .then(items => {
        setLocalItems(items.assets)
        pagedInfo.current = { ...items }
      })
      .catch(error => {
        logger.error(`[MEDIA_LIBRARY] fail with error: ${error?.message}`, error)
      })
      .finally(() => {
        fetching.current = false
      })
  }, [album, flashListRef, mediaType])

  const fetchNextPage = useCallback(async () => {
    if (pagedInfo.current?.hasNextPage && !fetching.current) {
      fetching.current = true
      try {
        const nextPage = await MediaLibrary.getAssetsAsync({
          album,
          first: 10,
          after: pagedInfo.current.endCursor,
          sortBy: MediaLibrary.SortBy.creationTime,
        })

        setLocalItems(currentItems => [...currentItems, ...nextPage.assets])
        pagedInfo.current = { ...nextPage }
      } catch (error) {
      } finally {
        fetching.current = false
      }
    }
  }, [album])

  useEffect(() => {
    fetchAssets()
  }, [album, fetchAssets])

  useAppReopened(fetchAssets)

  return {
    items: localItems,
    fetchNextPage,
  }
}
