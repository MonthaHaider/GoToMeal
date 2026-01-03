import React from "react";
import { View, Text, Image } from "react-native";
import { WebView } from "react-native-webview";

export const MapCallout = ({ restaurant }) => {
  return (
    <View
      style={{
        width: 150,
        padding: 10,
        alignItems: "center",
      }}
    >
      {restaurant.photos && restaurant.photos.length ? (
        <View
          style={{
            width: 120,
            height: 100,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <WebView
            source={{ uri: restaurant.photos[0] }}
            style={{ flex: 1 }}
          />
        </View>
      ) : (
        <Image
          source={require("../../assets/food1.png")}
          style={{ width: 120, height: 100, borderRadius: 10 }}
        />
      )}

      <Text style={{ marginTop: 5, fontWeight: "bold", textAlign: "center" }}>
        {restaurant.name}
      </Text>
    </View>
  );
};
