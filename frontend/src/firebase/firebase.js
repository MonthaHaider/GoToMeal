// src/firebase/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDvhQhXrqfEps88OkMZawWla-5HNU3uQ8Y",
  authDomain: "mealstogo-55fe4.firebaseapp.com",
  projectId: "mealstogo-55fe4",
  storageBucket: "mealstogo-55fe4.appspot.com",
  messagingSenderId: "150018400838",
  appId: "1:150018400838:web:c457f53225be3d6213a047",
  measurementId: "G-7VSHC54KFE",
};

// App init (safe)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Auth init (Expo safe)
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

// Firestore
const db = getFirestore(app);

export { app, auth, db };
