import { createContext, useContext, useEffect, useReducer } from "react";

const BASE_URL = "http://localhost:8000";
const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "currentCity":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "loading":
      return { ...state, isLoading: true };
    case "rejected":
      return { ...state, error: action.payload };
    default:
      throw new Error("Unknown action");
  }
}

const SUPABASE_URL = "https://sxfujarrjiocolrakium.supabase.co/rest/v1/cities";
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZnVqYXJyamlvY29scmFraXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxNzYxNTcsImV4cCI6MjA1Mzc1MjE1N30.UZg6RnrseDywydCUAOs4Hr-thbuR45QI5Hm0kSGju98"; // Replace with your actual API key

function CitiesProvider({ children }) {
  // useEffect(function () {
  //   // dispatch({ type: "loading" });
  //   async function fetchCities2() {
  //     try {
  //       const response = await fetch(SUPABASE_URL, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           apikey: SUPABASE_API_KEY, // Required for authentication
  //         },
  //       });

  //       const data = await response.json();
  //       console.log(data);
  //     } catch (error) {
  //       console.error("Error fetching cities:", error);
  //     }
  //   }
  //   fetchCities2();
  // }, []);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, currentCity } = state;

  async function getCity(id) {
    if (Number(id) === Number(currentCity.id)) return;
    dispatch({ type: "loading" });

    try {
      // const res = await fetch(`${BASE_URL}/cities/${id}`);
      const res = await fetch(`${SUPABASE_URL}?id=eq.${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_API_KEY,
        },
      });
      const data = await res.json();
      dispatch({ type: "currentCity", payload: data[0] });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was some error while fetching city",
      });
    }
  }

  // useEffect(function () {
  //   dispatch({ type: "loading" });
  //   async function fetchCities() {
  //     try {
  //       const res = await fetch(`${BASE_URL}/cities`);
  //       const data = await res.json();
  //       console.log(data);
  //       dispatch({ type: "cities/loaded", payload: data });
  //     } catch {
  //       dispatch({
  //         type: "rejected",
  //         payload: "There was some error while fetching cities",
  //       });
  //     }
  //   }
  //   fetchCities();
  // }, []);

  useEffect(function () {
    dispatch({ type: "loading" });
    async function fetchCities() {
      try {
        const res = await fetch(SUPABASE_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_API_KEY,
          },
        });
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was some error while fetching cities",
        });
      }
    }
    fetchCities();
  }, []);

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(SUPABASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_API_KEY,
          Prefer: "return=representation",
        },
        body: JSON.stringify(newCity),
      });
      await res.json();

      dispatch({ type: "city/created", payload: newCity });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was some error while adding city",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${SUPABASE_URL}?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_API_KEY,
        },
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was some error while deleting city",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  return context;
}

// const countryCodeToEmoji = (countryCode) => {
//   return countryCode
//     .toUpperCase() // Ensure uppercase (ISO 3166-1 standard)
//     .split("") // Split into individual letters
//     .map((char) => String.fromCodePoint(127397 + char.charCodeAt())) // Convert to flag emoji
//     .join(""); // Join back into a string
// };

// // Example usage:
// console.log(countryCodeToEmoji("PT")); // 🇵🇹
// console.log(countryCodeToEmoji("FR")); // 🇫🇷
// console.log(countryCodeToEmoji("US")); // 🇺🇸

export { CitiesProvider, useCities };
