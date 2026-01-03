import React, { useContext } from "react";
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
import { FavoritesContext } from "../Context/FavouriteContext";
import { useNavigation } from "@react-navigation/native";

export default function FavouriteScreen() {
  const { favorites, removeFavorite } = useContext(FavoritesContext);
  const navigation = useNavigation();

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favourites added yet!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {favorites.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              navigation.navigate("ResturantDetailScreen", { restaurant: item })
            }
            activeOpacity={0.8}
          >
            <View style={styles.card}>
              <Image
                source={
                  typeof item.image === "string" ? { uri: item.image } : item.image
                }
                style={styles.cardImage}
              />

              <TouchableOpacity
                style={styles.heart}
                onPress={() => removeFavorite(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.heartBg}>
                  <Text style={{ fontSize: 20, color: "red" }}>❤️</Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.name}>{item.name}</Text>

              <View style={styles.row}>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Text key={i} style={styles.star}>⭐</Text>
                ))}
              </View>

              <Text style={styles.address}>{item.address}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 8,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },

  cardImage: {
    width: "100%",
    height: 170,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  heart: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  heartBg: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 4,
    borderRadius: 20,
  },

  name: {
    marginTop: 10,
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    marginLeft: 12,
    marginTop: 3,
  },
  star: {
    fontSize: 16,
    color: "gold",
  },

  address: {
    marginLeft: 12,
    marginTop: 5,
    color: "#555",
  },
});
