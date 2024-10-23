# CameraPreview Component and Hooks

## Overview

The `CameraPreview` component allows users to capture photos and videos (currently disabled) using the device's camera. It manages camera permissions, configuration, and image cropping seamlessly. This project also includes custom hooks for handling media library permissions and fetching media assets from the device.

## Features

- Capture high-quality images.
- Request and manage camera and media library permissions.
- Crop images before saving to the media library.
- Toggle between front and back cameras.
- Enable or disable flash mode.
- Fetch and display media library albums and assets.

## Dependencies

- `react-native`
- `expo-camera`
- `expo-media-library`
- `react-native-image-crop-picker`
- `react-native-safe-area-context`
- `tamagui`

## Installation

To install the required dependencies, run:

```bash
npm install react-native expo-camera expo-media-library react-native-image-crop-picker react-native-safe-area-context tamagui
```

## Usage

### CameraPreview Component

The `CameraPreview` component enables users to capture high-quality images using the device's camera. It includes various features for managing camera functionality and image cropping.

**Props:**

- **onCapture**: Function that is called when a photo is successfully captured. It receives the captured image as an argument.
- **style**: Optional styling for the component.
- **cameraType**: Determines whether to use the front or back camera. Accepts values: `'front' | 'back'`. Defaults to `'back'`.
- **flashMode**: Determines the flash mode. Accepts values: `'on' | 'off' | 'auto'`. Defaults to `'off'`.

**Example Usage:**

```javascript
import React from "react";
import { CameraPreview } from "path/to/CameraPreview";

const MyCameraScreen = () => {
  const handleCapture = (image) => {
    console.log("Captured image:", image);
  };

  return (
    <CameraPreview
      onCapture={handleCapture}
      cameraType="back"
      flashMode="auto"
    />
  );
};
```

## Hooks

### useMediaLibraryPermissions

This hook manages media library permissions.

**Returns:**

- **isPermissionGranted**: Boolean indicating if the permission is granted.
- **isPermissionLimited**: Boolean indicating if the permission is limited.
- **requestPermissions**: Function to request media library permissions.
- **canAskAgain**: Boolean indicating if the app can ask for permissions again.

---

### useMediaLibraryAlbums

This hook fetches albums from the media library.

**Returns:**

- **albums**: An array of media library albums.
- **getAlbumsAsync**: Function to fetch albums asynchronously.

---

### useMedia

This hook fetches media assets from a specific album.

**Parameters:**

- **album**: The media library album to fetch assets from.
- **mediaType**: The type of media to fetch (e.g., photos, videos).
- **flashListRef**: A reference to the FlashList component.

**Returns:**

- **items**: An array of media assets.
- **fetchNextPage**: Function to fetch the next page of assets.

```

```
