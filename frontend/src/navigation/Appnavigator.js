import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Screens
import WelcomeScreen from "../Screen/WelcomeScreen";
import ForgotPasswordScreen from "../Screen/ForgotPasswordScreen";
import LoginScreen from "../Screen/LoginScreen";
import RegisterScreen from "../Screen/RegisterScreen";
import ResturantScreen from "../Screen/ResturantScreen";
import ResturantDetailScreen from "../Screen/ResturantDetailScreen";
import FavouriteScreen from "../Screen/FavouriteScreen";
import MapScreen from "../Screen/MapScreen";
import SettingsScreen from "../Screen/SettingScreen";
import CartScreen from "../Screen/cartscreen";
import AddressSelectionScreen from "../Screen/AddressSelectionScreen";
import CashOnDeliveryScreen from "../Screen/CashOnDeliveryScreen";

import CheckoutScreen from "../Screen/CheckoutScreen";
import PaymentSuccessScreen from "../Screen/paymentsuccessscreen";
import OrderStatusScreen from "../Screen/orderstatusscreen";
const Stack = createStackNavigator();

export default function AppNavigator({ user }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // User logged in
          <>
            <Stack.Screen name="Resturantscreen" component={ResturantScreen} />
            <Stack.Screen name="ResturantDetailScreen" component={ResturantDetailScreen} />
            <Stack.Screen name="FavouriteScreen" component={FavouriteScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="AddressSelectionScreen" component={AddressSelectionScreen} />
            <Stack.Screen name="CashOnDelivery" component={CashOnDeliveryScreen}
/>

            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
             <Stack.Screen name="OrderStatus" component={OrderStatusScreen} options={{ title: "Order Status" }} />
          </>
        ) : (
          // User not logged in
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
