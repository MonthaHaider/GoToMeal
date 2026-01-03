// src/screens/CheckoutScreen.js
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CartContext } from "../Context/cartcontext";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase/firebase";

export default function CheckoutScreen({ navigation, route }) {
  const { cartItems, clearCart } = useContext(CartContext);
  const { confirmPayment } = useStripe();
  const { address } = route.params || {};

  const [name, setName] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = auth.currentUser?.uid;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const disabled = !name || !cardComplete || loading;

  const onPay = async () => {
    if (!address || !userId) {
      Alert.alert("Error", "Missing user or address");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://192.168.100.246:3000/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(total * 100),
            userId,
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const { error: confirmError } = await confirmPayment(
        data.clientSecret,
        {
          paymentMethodType: "Card",
          billingDetails: { name },
        }
      );

      if (confirmError) throw new Error(confirmError.message);

      const orderData = {
        userId,
        items: cartItems,
        address,
        paymentMethod: "Card",
        paymentStatus: "Paid",
        status: "Pending",
        total,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);

      clearCart();

      Alert.alert("Success", "Order placed successfully");

      navigation.replace("OrderStatus", {
        userId,
      });
    } catch (e) {
      Alert.alert("Error", e.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.orderBox}>
        <Text style={styles.title}>Your Order</Text>

        {cartItems.length === 0 ? (
          <Text style={styles.empty}>Cart is empty</Text>
        ) : (
          cartItems.map((item) => (
            <Text key={item.id} style={styles.item}>
              {item.name} x {item.quantity}  ${item.price.toFixed(2)}
            </Text>
          ))
        )}

        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      </View>

      <TextInput
        placeholder="Name on card"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <CardField
        postalCodeEnabled={false}
        style={styles.card}
        onCardChange={(card) => setCardComplete(card.complete)}
      />

      <TouchableOpacity
        style={[styles.payBtn, disabled && { opacity: 0.6 }]}
        disabled={disabled}
        onPress={onPay}
      >
        <Text style={styles.payText}>
          {loading ? "Processing..." : "Pay Now"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  orderBox: { padding: 15 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  item: { fontSize: 16, marginBottom: 4 },
  total: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
  empty: { fontSize: 16, color: "#888" },
  input: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
  card: {
    height: 55,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  payBtn: {
    margin: 15,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  payText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
