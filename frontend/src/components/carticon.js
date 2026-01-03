import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CartContext } from "../Context/cartcontext";
import { useNavigation } from "@react-navigation/native";

export default function CartIcon() {
  const { cartItems } = useContext(CartContext);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("Cart")}
      activeOpacity={0.8}
    >
      <Ionicons name="cart-outline" size={28} color="black" />

      {cartItems.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {cartItems.length > 9 ? "9+" : cartItems.length}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "red",
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },

  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
