import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

import { LocationContext } from "../services/location/location.context";
import { RestaurantsContext } from "../services/resturants/resturants.context";

import { Search } from "../components/search.components";
import { MapCallout } from "../components/map-callout.component";

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchContainer: {
    position: "absolute",
    top: 40,
    width: "100%",
    zIndex: 100,
    paddingHorizontal: 10,
  },
});

const RestaurantMap = ({ navigation }) => {
  const { location } = useContext(LocationContext);
  const { restaurants = [] } = useContext(RestaurantsContext);
  const [latDelta, setLatDelta] = useState(0.05);

  const lat = location?.lat ?? 37.7749;
  const lng = location?.lng ?? -122.4194;
  const viewport = location?.viewport;

  useEffect(() => {
    if (!viewport) return;
    const northeastLat = viewport.northeast.lat;
    const southwestLat = viewport.southwest.lat;
    setLatDelta(northeastLat - southwestLat);
  }, [viewport]);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Search />
      </View>

      <MapView
        style={styles.map}
        region={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: latDelta,
          longitudeDelta: 0.02,
        }}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.name}
            coordinate={{
              latitude: restaurant.geometry.location.lat,
              longitude: restaurant.geometry.location.lng,
            }}
          >
            <Callout
              onPress={() =>
                navigation.navigate("ResturantDetailScreen", { restaurant })
              }
            >
              <MapCallout restaurant={restaurant} />
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const MapScreen = ({ navigation }) => {
  const { location } = useContext(LocationContext);

  if (!location) {
    return (
      <MapView
        style={styles.map}
        region={{
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />
    );
  }

  return <RestaurantMap navigation={navigation} />;
};

export default MapScreen;
