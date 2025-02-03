import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const FAKE_USER = {
  name: "Mehran",
  email: "mehran@gmail.com",
  password: "qwerty",
  // avatar: "https://i.pravatar.cc/100?u=zz",
  // avatar:
  // "https://sxfujarrjiocolrakium.supabase.co/storage/v1/object/public/tripLog//user%20icon.png",
  avatar:
    "https://sxfujarrjiocolrakium.supabase.co/storage/v1/object/public/tripLog//user-icon-2.png",
};

const initialState = {
  user: null,
  isAuthenticated: false,
};
function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return initialState;
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, isAuthenticated } = state;

  function login(email, password) {
    if (!email || !password) return;
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  }
  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
