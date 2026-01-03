import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { CartContext } from "../Context/cartcontext";

export default function AddressSelectionScreen({ navigation }) {
  const { cartItems } = useContext(CartContext);

  const [selectedType, setSelectedType] = useState(null);
  const [details, setDetails] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleConfirm = () => {
    if (!selectedType || !details || !paymentMethod) {
      Alert.alert(
        "Incomplete",
        "Please select address type, enter address and choose payment method"
      );
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert("Cart Empty", "Please add items to cart");
      return;
    }

    const address = { type: selectedType, details };

    if (paymentMethod === "Card") {
      navigation.navigate("Checkout", { address });
    } else {
      // Navigate to CashOnDelivery screen
      navigation.navigate("CashOnDelivery", { address });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Address Type</Text>

      {["Home", "Office"].map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.optionBtn,
            selectedType === type && styles.selectedBtn,
          ]}
          onPress={() => setSelectedType(type)}
        >
          <Text style={styles.optionText}>{type}</Text>
        </TouchableOpacity>
      ))}

      {selectedType && (
        <>
          <Text style={styles.title}>Address Details</Text>
          <TextInput
            placeholder="Street, City, Area"
            style={styles.input}
            value={details}
            onChangeText={setDetails}
          />

          <Text style={styles.title}>Payment Method</Text>

          {["Cash on Delivery", "Card"].map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.optionBtn,
                paymentMethod === method && styles.selectedBtn,
              ]}
              onPress={() => setPaymentMethod(method)}
            >
              <Text style={styles.optionText}>{method}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Continue</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  optionBtn: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedBtn: {
    borderColor: "#4CAF50",
    backgroundColor: "#e8f5e9",
  },
  optionText: { fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  confirmBtn: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
