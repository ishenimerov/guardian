import React, { useCallback, useEffect, useRef, useState } from "react";
import { Linking } from "react-native"; // Used for opening app settings
import ImageCropPicker, { Image } from "react-native-image-crop-picker"; // Used for cropping images
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Used for handling safe area insets
import { Camera, CameraType, FlashMode } from "expo-camera"; // Expo Camera components
import { useRouter } from "expo-router"; // Used for navigation
import { YStack } from "tamagui";
import { TButtonPrimary, TText } from "@components/common/atoms/locale"; // Localization components
import { Header } from "@components/common/molecules/header/header"; // Header component
import { useCreatePostContext } from "@providers/create-post/create-post-provider"; // Context for creating posts
import { logger } from "@services/logger"; // Logger service for error handling
import { CameraActions } from "./camera-actions"; // Import camera actions component

/**
 * CameraPreview component allows users to capture photos and videos.
 * It handles permissions, camera configuration, and image cropping.
 */

export function CameraPreview() {
  const router = useRouter(); // Initialize router for navigation
  const cameraRef = useRef<Camera>(null); // Reference to the Camera component
  const [permission, requestPermission] = Camera.useCameraPermissions(); // Hook for camera permissions

  const [autoFocus, setAutoFocus] = useState(true); // State for controlling auto focus
  const insets = useSafeAreaInsets(); // Safe area insets for layout adjustments

  const [flash, setFlash] = useState(FlashMode.off); // State for flash mode
  const [type, setType] = useState(CameraType.front); // State for camera type (front or back)

  const { setSelectedMediaURI } = useCreatePostContext(); // Context to set the selected media URI

  // Extract permission status
  const { granted: grantedCamera, canAskAgain: canAskAgainCamera } =
    permission ?? {};

  const camera = grantedCamera;

  //// Function to handle image cropping
  const handleImageCrop = useCallback(async (mediaUri: string) => {
    if (mediaUri) {
      try {
        const image: Image = await ImageCropPicker.openCropper({
          path: mediaUri,
          width: 900,
          height: 1600,
          cropping: true,
          mediaType: "photo",
          compressImageQuality: 1,
        });

        return image.path; // Return the cropped image path
      } catch (ignored) {
        // User dismissed the crop view
      }
    }
  }, []);

  //Function to take a picture
  const takePicture = useCallback(async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        const croppedImage = await handleImageCrop(data.uri);
        if (!croppedImage) return;
        setSelectedMediaURI(croppedImage);
        router.push("/create-post/post-options/");
      } catch (e) {
        logger.error("[CAMERA] take picture fail with error", e);
      }
    }
  }, [handleImageCrop, router, setSelectedMediaURI]);

  //Function to take a video
  const takeVideo = useCallback(async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.recordAsync({
          maxDuration: 60,
        });

        setSelectedMediaURI(data.uri);
      } catch (e) {
        logger.error("[CAMERA] take video fail with error", e);
      }
    }
  }, [setSelectedMediaURI]);

  const stopVideo = useCallback(async () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  }, []);

  // Function to handle permission requests
  const handleRequestPermission = useCallback(() => {
    if (!grantedCamera) {
      if (canAskAgainCamera) {
        requestPermission();
      }

      Linking.openSettings();
    }
  }, [canAskAgainCamera, grantedCamera, requestPermission]);

  // Toggle camera type between front and back
  const toggleCameraType = useCallback(() => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }, []);

  // Toggle flash mode between on and off
  const toggleCameraFlash = useCallback(() => {
    setFlash((current) =>
      current === FlashMode.off ? FlashMode.on : FlashMode.off
    );
  }, []);

  // Handle press event for auto focus
  const handlePress = useCallback(async () => {
    // AutoFocus is stuck after the initial focus [ref: https://github.com/expo/expo/issues/26869]
    // As a workaround, we set the autoFocus to false, a side effect will then re-set it to true to re-initialize the autofocus
    setAutoFocus(false);
  }, []);

  // Request permission when component mounts or updates
  useEffect(() => {
    if (!grantedCamera) {
      requestPermission();
    }
  }, [grantedCamera, requestPermission]);

  // Effect to reset auto focus
  useEffect(() => {
    if (cameraRef.current && !autoFocus) {
      // Reset autoFocus to true to re-initialize the autofocus
      setAutoFocus(true);
    }
  }, [autoFocus]);

  // Render component
  return (
    <YStack backgroundColor="$neutralSoftBlack" flex={1} pt={insets.top}>
      <Header
        px="$3"
        subTitleKey="createPost.selectMedia.title"
        titleKey="createPost.title"
      />
      <YStack flex={1} mt="$3" overflow="hidden" onPress={handlePress}>
        {!camera && (
          <YStack ai="center" flex={1} justifyContent="center">
            <TText
              color="$white100"
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
        {camera && (
          <Camera
            ref={cameraRef}
            autoFocus={autoFocus}
            flashMode={flash}
            ratio="16:9"
            style={{ flex: 1 }}
            type={type}
          >
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
  );
}
