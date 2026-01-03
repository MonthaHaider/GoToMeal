import React, { useContext, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { FavoritesContext } from "../Context/FavouriteContext";
import { CartContext } from "../Context/cartcontext";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RestaurantsScreen() {
  const navigation = useNavigation();
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);
  const { cartItems, cartBadge } = useContext(CartContext);

  const [restaurants, setRestaurants] = useState([
    { id: 1, name: "Zuni Café", image: require("../../assets/food1.png"), rating: 5, address: "1633 Market Street, San Francisco" },
    { id: 2, name: "Brenda's French Soul Food", image: require("../../assets/food2.png"), rating: 5, address: "652 Polk Street, San Francisco" },
    { id: 3, name: "Cafe de la Paix", image: require("../../assets/food3.png"), rating: 5, address: "Paris, France" },
    { id: 4, name: "Blue Hill", image: require("../../assets/food4.png"), rating: 5, address: "New York, USA" },
  ]);

  const [search, setSearch] = useState("");

  const toggleFavorite = (item) => {
    isFavorite(item.id) ? removeFavorite(item.id) : addFavorite(item);
  };

  const updateRating = (id, newRating) => {
    setRestaurants((prev) =>
      prev.map((item) => (item.id === id ? { ...item, rating: newRating } : item))
    );
  };

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, restaurants]);

  const totalCart = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#777"
          />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
          {filteredRestaurants.map((item) => {
            const favorite = isFavorite(item.id);

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("ResturantDetailScreen", { restaurant: item })}
              >
                <Image source={item.image} style={styles.cardImage} />

                <TouchableOpacity
                  style={styles.heart}
                  onPress={() => toggleFavorite(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={favorite ? "heart" : "heart-outline"}
                    size={28}
                    color={favorite ? "red" : "gray"}
                  />
                </TouchableOpacity>

                <Text style={styles.name}>{item.name}</Text>

                <View style={styles.row}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => updateRating(item.id, i + 1)}
                      activeOpacity={0.7}
                      style={{ paddingHorizontal: 3 }}
                    >
                      <Ionicons
                        name={i < (item.rating || 0) ? "star" : "star-outline"}
                        size={22}
                        color={i < (item.rating || 0) ? "gold" : "#bbb"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.address}>{item.address}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bottom Tab */}
        <View style={styles.bottomTab}>
          <TouchableOpacity onPress={() => navigation.navigate("ResturantScreen")} style={styles.tabItem}>
            <Text style={styles.tabIcon}>🍔</Text>
            <Text style={styles.tabText}>Restaurants</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Map")} style={styles.tabItem}>
            <Text style={styles.tabIcon}>🗺️</Text>
            <Text style={styles.tabText}>Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Cart", { total: totalCart })}
            style={styles.tabItem}
          >
            <View>
              <Text style={styles.tabIcon}>🛒</Text>
              {cartBadge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartBadge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.tabText}>Checkout</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Settings")} style={styles.tabItem}>
            <Text style={styles.tabIcon}>⚙️</Text>
            <Text style={styles.tabText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 0,
  },
  container: { flex: 1 },
  searchContainer: { paddingTop: 16, paddingHorizontal: 20 },
  searchInput: { backgroundColor: "#f1f1f1", borderRadius: 25, padding: 12, fontSize: 16, paddingLeft: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 15,
    marginVertical: 10,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardImage: { width: "100%", height: 180 },
  heart: { position: "absolute", top: 12, right: 12 },
  name: { fontSize: 18, fontWeight: "700", marginLeft: 12, marginTop: 10 },
  row: { flexDirection: "row", marginLeft: 12, marginTop: 5 },
  address: { marginLeft: 12, marginTop: 5, color: "#666", marginBottom: 12 },

  bottomTab: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingBottom: Platform.OS === "android" ? 20 : 30, // extra space for Android buttons
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  tabItem: { alignItems: "center" },
  tabIcon: { fontSize: 22 },
  tabText: { fontSize: 12, color: "#444", marginTop: 2 },
  badge: {
    position: "absolute",
    right: -10,
    top: -5,
    backgroundColor: "red",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "white", fontSize: 10, fontWeight: "bold" },
});
