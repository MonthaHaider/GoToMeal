// src/screens/SettingsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { auth, storage } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SettingsScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const user = auth.currentUser;
  const userId = user?.uid;

  // 📌 Pick Image from Gallery or Camera
  const pickImage = async (source) => {
    let result;

    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Camera permission is needed to take a photo.");
        return;
      }

      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
    }

    if (!result.canceled) {
      const sourceUri = result.assets[0].uri;
      setImage(sourceUri);
      uploadImage(sourceUri);
    }
  };

  // 📌 Upload selected image to Firebase Storage
  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profileImages/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      setImage(downloadURL);

      Alert.alert("Success", "Profile image updated!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // 📌 Firebase Logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => navigation.replace("Login"))
      .catch((error) => Alert.alert("Logout Failed", error.message));
  };

  return (
    <View style={styles.container}>
      {/* Profile */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={() => pickImage("gallery")}>
          {image ? (
            <Image source={{ uri: image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.editText}>Tap image to change</Text>

        {/* Camera & Gallery Buttons */}
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity onPress={() => pickImage("camera")} style={styles.pickButton}>
            <Text style={styles.pickButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => pickImage("gallery")} style={styles.pickButton}>
            <Text style={styles.pickButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Options */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("FavouriteScreen")}
        >
          <MaterialCommunityIcons name="heart" size={26} color="#333" />
          <Text style={styles.optionTitle}>Favourites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("Map")}
        >
          <FontAwesome5 name="map-marked-alt" size={26} color="#333" />
          <Text style={styles.optionTitle}>Map</Text>
        </TouchableOpacity>

        {/* New: Order Status */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("OrderStatus", { userId })}
        >
          <MaterialCommunityIcons name="clipboard-text-outline" size={26} color="#333" />
          <Text style={styles.optionTitle}>My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color="red" />
          <Text style={[styles.optionTitle, { color: "red" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f3f7" },

  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#1e90ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 40, fontWeight: "bold", color: "#fff" },
  email: { fontSize: 15, color: "#333", fontWeight: "600" },
  editText: { fontSize: 12, color: "gray", marginTop: 4 },

  pickButton: {
    backgroundColor: "#0077cc",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  pickButtonText: { color: "#fff", fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    marginTop: 25,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    elevation: 4,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionTitle: { marginLeft: 15, fontSize: 16, fontWeight: "600", color: "#333" },
});
