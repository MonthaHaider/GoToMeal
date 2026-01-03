// src/Screen/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setLoading(false);
      // Reset stack to Resturant
      navigation.reset({
        index: 0,
        routes: [{ name: "Resturant" }],
      });
    } catch (error) {
      setLoading(false);
      let message = "Login failed. Check credentials.";
      if (error.code === "auth/user-not-found") {
        message = "No account found for this email.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address.";
      }
      Alert.alert("Login Error", message);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/home_bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
          source={require("../../assets/logo-meals.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.formBox}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#555"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
  <Text style={{ color: "blue", marginTop: 10 }}>Forgot Password?</Text>
</TouchableOpacity>


          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Create an account</Text>
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
  logo: { width: 180, height: 120, marginBottom: 20 },
  formBox: {
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 20,
    borderRadius: 10,
  },
  input: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#7a3cff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0077cc",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#0077cc",
    fontSize: 15,
    fontWeight: "600",
  },
});
