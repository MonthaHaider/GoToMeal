import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from AsyncStorage on app start
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@favorites");
        if (jsonValue != null) {
          setFavorites(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.log("Error loading favorites:", e);
      }
    };
    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage whenever it changes
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem("@favorites", JSON.stringify(favorites));
      } catch (e) {
        console.log("Error saving favorites:", e);
      }
    };
    saveFavorites();
  }, [favorites]);

  const addFavorite = (restaurant) => {
    setFavorites((prev) => {
      if (!prev.some((item) => item.id === restaurant.id)) {
        return [...prev, restaurant];
      }
      return prev;
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const isFavorite = (id) => favorites.some((item) => item.id === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
