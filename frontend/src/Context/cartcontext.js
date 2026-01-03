// src/Context/cartcontext.js
import React, { createContext, useState, useEffect } from "react";
import * as Notifications from "expo-notifications";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartBadge, setCartBadge] = useState(0);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Notification permission required");
      }
    };
    requestPermissions();
  }, []);

  const triggerNotification = async (title, body) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: { title, body },
        trigger: null,
      });
    } catch (e) {
      console.log("Notification error", e);
    }
  };

  const addToCart = (item) => {
    setCartItems((prev) => {
      const found = prev.find((i) => i.id === item.id);

      if (found) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });

    setCartBadge((b) => b + 1);
    triggerNotification("Cart", `${item.name} added`);
  };

  const removeFromCart = (id, qty = 1) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;

      if (item.quantity > qty) {
        return prev.map((i) =>
          i.id === id
            ? { ...i, quantity: i.quantity - qty }
            : i
        );
      }

      return prev.filter((i) => i.id !== id);
    });

    setCartBadge((b) => (b - qty >= 0 ? b - qty : 0));
  };

  const clearCart = () => {
    setCartItems([]);
    setCartBadge(0);
    triggerNotification("Cart", "Cart cleared");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartBadge,
        triggerNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
