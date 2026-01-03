// src/screens/CartScreen.js
import React, { useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { CartContext } from "../Context/cartcontext";

export default function CartScreen({ navigation }) {
  const { cartItems, addToCart, removeFromCart, clearCart, triggerNotification } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Navigate to AddressSelectionScreen instead of Checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart is empty", "Please add some items to proceed.");
      return;
    }
    navigation.navigate("AddressSelectionScreen");
    triggerNotification("Order", "Proceeding to address & payment selection");
  };

  const handleClear = () => {
    clearCart();
    triggerNotification("Cart Update", "Cart cleared");
  };

  const increaseQuantity = (item) => {
    addToCart(item);
  };

  const decreaseQuantity = (item) => {
    removeFromCart(item.id, 1);
  };

  const handleRemove = (item) => {
    removeFromCart(item.id, item.quantity);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decreaseQuantity(item)} style={styles.qtyBtn}>
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyNumber}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(item)} style={styles.qtyBtn}>
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => handleRemove(item)} style={styles.removeBtn}>
        <Text style={{ color: "white" }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={{ fontSize: 18, textAlign: "center", marginTop: 50 }}>
          Your cart is empty
        </Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={{ color: "white", fontSize: 16 }}>Confirm Payment & Address</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
              <Text style={{ color: "white" }}>Clear Cart</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemPrice: { fontSize: 16 },
  removeBtn: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  footer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  totalText: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "right" },
  checkoutBtn: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  clearBtn: {
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  quantityContainer: { flexDirection: "row", alignItems: "center", marginRight: 10 },
  qtyBtn: {
    backgroundColor: "#ddd",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  qtyText: { fontSize: 18, fontWeight: "bold" },
  qtyNumber: { marginHorizontal: 8, fontSize: 16 },
});
