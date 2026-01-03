import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

export default function WelcomeScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0)).current; // start from 0
  const opacityAnim = useRef(new Animated.Value(0)).current; // hidden

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // 📌 Google Auth setup
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: "647613744950-br02h9u8ihrg4kk6kqhjbuhjvfqutf04.apps.googleusercontent.com",       // Expo Go ke liye
    iosClientId: "647613744950-b82fsq887tck2dfpght6e8uah8fd62bh.apps.googleusercontent.com",          // iOS ke liye
    androidClientId: "647613744950-m79n3us000snc5ha859j68tjo886ctdh.apps.googleusercontent.com",  // Android ke liye
    webClientId: "647613744950-g29aa5q39meq7q0ig0812o8d8fr6pps8.apps.googleusercontent.com",          // Web ke liye
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          navigation.replace("Resturant"); // navigate after successful login
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    }
  }, [response]);

  return (
    <ImageBackground
      source={require("../../assets/home_bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* ANIMATED LOGO */}
        <Animated.Image
          source={require("../../assets/Watermelon.png")}
          style={[
            styles.logo,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        />

        <Text style={styles.title}>Meals to go</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.buttonText}>Create an account</Text>
          </TouchableOpacity>

          {/* 📌 Google Login Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#DB4437" }]}
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <Text style={styles.buttonText}>Login with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  logo: { width: 400, height: 300, marginBottom: 5, resizeMode: "contain" },
  title: { fontSize: 26, fontWeight: "600", marginBottom: 40 },
  buttonsContainer: { width: "70%" },
  button: {
    backgroundColor: "#0077cc",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});