import React, { createContext, useState } from "react";
import { restaurantsRequest, restaurantsTransform } from "./resturants.service";

export const RestaurantsContext = createContext();

export const RestaurantsContextProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRestaurants = (location) => {
    if (!location) return;
    setIsLoading(true);
    setError(null);

    restaurantsRequest(location)
      .then(restaurantsTransform)
      .then((results) => {
        setRestaurants(results);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  };

  return (
    <RestaurantsContext.Provider value={{ restaurants, isLoading, error, getRestaurants }}>
      {children}
    </RestaurantsContext.Provider>
  );
};
