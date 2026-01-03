import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export async function requestCameraPermission() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission Denied", "Camera access is required to use this feature.");
    return false;
  }
  return true;
}

export async function openCamera() {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7,
  });

  if (!result.canceled) {
    return result.assets[0].uri; // Return image URI
  }
  return null;
}
