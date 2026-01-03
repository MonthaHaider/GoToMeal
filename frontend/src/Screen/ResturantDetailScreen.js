import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CartContext } from "../Context/cartcontext";
import CartIcon from "../components/carticon";

export default function RestaurantDetailScreen({ route, navigation }) {
  const { addToCart } = useContext(CartContext);
  const { restaurant } = route.params;

  const [menu] = useState({
    Breakfast: [
      { id: 1, name: "Pancakes", price: 5.99 },
      { id: 2, name: "Omelette", price: 4.99 },
    ],
    Lunch: [
      { id: 3, name: "Burger", price: 8.99 },
      { id: 4, name: "Salad", price: 6.99 },
    ],
    Dinner: [
      { id: 5, name: "Steak", price: 15.99 },
      { id: 6, name: "Pasta", price: 12.99 },
    ],
    Drinks: [
      { id: 7, name: "Coke", price: 1.99 },
      { id: 8, name: "Coffee", price: 2.49 },
    ],
  });

  const [expanded, setExpanded] = useState({});

  const toggleCategory = (category) =>
    setExpanded({ ...expanded, [category]: !expanded[category] });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Image + Cart icon */}
        <View style={styles.imageWrapper}>
          <Image source={restaurant.image} style={styles.image} />

          {/* Floating Cart Icon overlay */}
          <View style={styles.cartOverlay}>
            <CartIcon />
          </View>
        </View>

        <View style={{ padding: 15 }}>
          <Text style={styles.name}>{restaurant.name}</Text>

          <View style={styles.row}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < restaurant.rating ? "star" : "star-outline"}
                size={20}
                color={i < restaurant.rating ? "gold" : "#bbb"}
              />
            ))}
          </View>

          <Text style={styles.address}>{restaurant.address}</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {Object.keys(menu).map((category) => (
            <View key={category} style={styles.categoryContainer}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleCategory(category)}
              >
                <Text style={styles.categoryTitle}>{category}</Text>
                <Ionicons
                  name={expanded[category] ? "chevron-up" : "chevron-down"}
                  size={20}
                />
              </TouchableOpacity>

              {expanded[category] &&
                menu[category].map((item) => (
                  <View key={item.id} style={styles.menuItem}>
                    <Text>{item.name}</Text>
                    <Text>${item.price.toFixed(2)}</Text>
                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={() => addToCart({ ...item, id: Date.now() })}
                    >
                      <Text style={{ color: "white" }}>Add</Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate("Cart")}
        >
          <Text style={styles.checkoutText}>View Your Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  container: { flex: 1 },

  imageWrapper: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  cartOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 999,
    elevation: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 6,
    borderRadius: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },

  address: {
    color: "#666",
    marginTop: 5,
  },

  row: {
    flexDirection: "row",
  },

  categoryContainer: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },

  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    alignItems: "center",
  },

  addBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  checkoutBtn: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 12,
    margin: 20,
    alignItems: "center",
  },

  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
