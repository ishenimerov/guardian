import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as MediaLibrary from 'expo-media-library'
import { Album } from 'expo-media-library'
import { useAppReopened } from '@hooks/common'
import { logger } from '@services/logger'
import { useMediaLibraryPermissions } from './use-media-library-permissions'

type UseMediaLibraryAlbumsType = { getAlbumsAsync: () => Promise<Album[]>; albums: Album[] }

export const useMediaLibraryAlbums = (): UseMediaLibraryAlbumsType => {
  const { t } = useTranslation()
  const { isPermissionGranted, isPermissionLimited } = useMediaLibraryPermissions()
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([])
  const fetchAlbums = useCallback(async () => {
    if (isPermissionGranted && !isPermissionLimited) {
      MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true })
        .then(albumsResponse => {
          setAlbums(albumsResponse)
        })
        .catch(error => {
          logger.error(`[MEDIA LIBRARY] profile edit failed with error: ${error?.message}`, error)
        })
    }
  }, [isPermissionGranted, isPermissionLimited])

  useEffect(() => {
    fetchAlbums()
  }, [fetchAlbums, isPermissionGranted])

  useEffect(() => {
    if (isPermissionLimited) {
      setAlbums([
        {
          id: 'all-photos',
          title: t('common.allPhotos'),
          assetCount: 0,
          type: 'smartAlbum',
          startTime: 0,
          endTime: 0,
        },
      ])
    }
  }, [isPermissionLimited, t])

  useAppReopened(fetchAlbums)

  return {
    getAlbumsAsync: MediaLibrary.getAlbumsAsync,
    albums,
  }
}
