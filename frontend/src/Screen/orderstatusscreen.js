// src/screens/OrderStatusScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function OrderStatusScreen({ navigation, route }) {
  const { userId } = route.params || {};
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setOrders(list);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleCancel = async (orderId) => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await updateDoc(doc(db, "orders", orderId), {
                status: "Cancelled",
              });
            } catch (e) {
              Alert.alert("Error", "Unable to cancel order");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.orderBox}>
      <Text style={styles.text}>Order ID: {item.id}</Text>
      <Text style={styles.text}>Address: {item.address?.details}</Text>
      <Text style={styles.text}>Payment: {item.paymentMethod}</Text>
      <Text style={styles.text}>Status: {item.status}</Text>

      {item.status === "Pending" && (
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => handleCancel(item.id)}
        >
          <Text style={styles.cancelText}>Cancel Order</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text style={styles.empty}>No orders found</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  orderBox: {
    backgroundColor: "#f3f3f3",
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
  },
  text: {
    fontSize: 15,
    marginBottom: 4,
  },
  cancelBtn: {
    marginTop: 10,
    backgroundColor: "#e53935",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
