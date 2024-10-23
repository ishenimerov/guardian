import * as MediaLibrary from 'expo-media-library'

type UseMediaLibraryPermissionsType = {
  isPermissionGranted: boolean
  isPermissionLimited: boolean
  requestPermissions: () => Promise<MediaLibrary.PermissionResponse>
  canAskAgain: boolean
}

export const useMediaLibraryPermissions = (): UseMediaLibraryPermissionsType => {
  const [permissionResponse, requestPermissions] = MediaLibrary.usePermissions()

  return {
    isPermissionGranted: permissionResponse?.granted === true,
    isPermissionLimited: permissionResponse?.granted === true && permissionResponse.accessPrivileges === 'limited',
    requestPermissions,
    canAskAgain: permissionResponse?.canAskAgain === true,
  }
}
