import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StripeProvider } from "@stripe/stripe-react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/firebase/firebase";

import { FavoritesProvider } from "./src/Context/FavouriteContext";
import { LocationContextProvider } from "./src/services/location/location.context";
import { RestaurantsContextProvider } from "./src/services/resturants/resturants.context";
import { CartProvider } from "./src/Context/cartcontext";
import AppNavigator from "./src/navigation/Appnavigator";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  if (loading) return null; // App load hone tak blank screen

  return (
    <StripeProvider publishableKey="pk_test_51SXHJGCliGTSzvYM2HRhbp8BWVtlnDlh9F7anpfIOnCsMJRu9ezjIeZG8WVOpNqFwVwK9ytuuqbtDy1RXXamI8wg00k00uL35V">
      <CartProvider>
        <FavoritesProvider>
          <LocationContextProvider>
            <RestaurantsContextProvider>
              <StatusBar style="dark" />
              <AppNavigator user={user} />
            </RestaurantsContextProvider>
          </LocationContextProvider>
        </FavoritesProvider>
      </CartProvider>
    </StripeProvider>
  );
}
