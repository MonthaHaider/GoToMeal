import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { CartContext } from "../Context/cartcontext";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CashOnDeliveryScreen({ navigation, route }) {
  const { cartItems, clearCart } = useContext(CartContext);
  const { address } = route.params;

  const [loading, setLoading] = useState(false);

  const userId = auth.currentUser?.uid;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart Empty", "No items in cart");
      return;
    }

    if (!userId || !address) {
      Alert.alert("Error", "Missing user or address");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        userId,
        cartItems,
        address,
        paymentMethod: "Cash on Delivery",
        status: "Pending",
        total,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);

      clearCart();

      Alert.alert("Order Placed", "Your order has been placed successfully");

      // Push OrderStatus screen instead of reset
      navigation.navigate("OrderStatus", { userId });
    } catch (e) {
      Alert.alert("Error", "Order could not be placed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Confirm Order</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Delivery Address</Text>
        <Text style={styles.value}>
          {address.type}, {address.details}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Payment Method</Text>
        <Text style={styles.value}>Cash on Delivery</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Order Items</Text>
        {cartItems.map((item, index) => (
          <Text key={index} style={styles.value}>
            {item.name} x {item.quantity}
          </Text>
        ))}
        <Text style={styles.total}>Total Rs {total.toFixed(0)}</Text>
      </View>

      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={placeOrder}
        disabled={loading}
      >
        <Text style={styles.confirmText}>
          {loading ? "Placing Order..." : "Place Order"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  value: { fontSize: 15, marginBottom: 2 },
  total: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
  confirmBtn: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
