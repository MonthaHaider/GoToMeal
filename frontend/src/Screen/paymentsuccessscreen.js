// src/screens/PaymentSuccessScreen.js
import React from "react";
import { View, Text, Button } from "react-native";

export default function PaymentSuccessScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Payment Successful!</Text>
      <Button title="Back to Home" onPress={() => navigation.navigate("Resturant")} />
    </View>
  );
}
