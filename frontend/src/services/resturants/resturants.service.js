// src/services/resturants/restaurants.service.js

// Mock Data (testing ke liye)
const mockRestaurants = [
  {
    id: 1,
    name: "Zuni Café",
    address: "1633 Market Street, San Francisco",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Mission Chinese Food",
    address: "2234 Mission Street, San Francisco",
    rating: 4.2,
  },
  {
    id: 3,
    name: "La Taqueria",
    address: "2889 Mission Street, San Francisco",
    rating: 4.8,
  },
];

// Fetch function (real API ke liye, agar available ho to)
export const restaurantsRequest = async (location) => {
  try {
    // Agar real API ho, yahan fetch kar sakte ho
    // Example:
    // const response = await fetch(`https://myapi.com/restaurants?location=${location}`);
    // const data = await response.json();
    // return data.restaurants;

    // Abhi mock data return kar rahe hain
    return mockRestaurants;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
};

// Transform data agar zarurat ho to (e.g., format change karna)
export const restaurantsTransform = (results) => {
  return results.map((restaurant) => {
    return {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      rating: restaurant.rating,
    };
  });
};
