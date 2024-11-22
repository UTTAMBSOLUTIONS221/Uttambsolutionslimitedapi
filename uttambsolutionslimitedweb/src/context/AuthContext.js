import React, { createContext, useState, useContext } from "react";

// Create the AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Invalid user data in localStorage, resetting to null:", error);
      localStorage.removeItem("user"); // Clear invalid data
      return null;
    }
  });
  
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || null;
    } catch (error) {
      console.error("Error retrieving token from localStorage:", error);
      return null;
    }
  });

  const login = (responseData) => {
    const { token, usermodel } = responseData;

    // Update state and localStorage
    setUser(usermodel);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(usermodel));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    // Clear state and localStorage
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};