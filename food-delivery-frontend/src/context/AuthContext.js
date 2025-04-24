import React, { createContext, useState, useContext, useEffect } from "react";
import { login, register, logout, getCurrentUser } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only check authentication if we haven't done so already
    if (!authChecked) {
      checkUserLoggedIn();
    }
  }, [authChecked]);

  const checkUserLoggedIn = async () => {
    try {
      // Check if we have a token first to avoid unnecessary API calls
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        setAuthChecked(true);
        return;
      }

      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error("Auth check error:", err);
      setUser(null);
      // Clear invalid token
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  const loginUser = async (email, password) => {
    try {
      setError(null);
      const userData = await login({ email, password });
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login");
      throw err;
    }
  };

  const registerUser = async (userData) => {
    try {
      setError(null);
      const newUser = await register(userData);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during registration"
      );
      throw err;
    }
  };

  const logoutUser = () => {
    console.log("Logging out user...");

    // Call the logout function from auth service
    logout();

    // Clear local storage
    localStorage.removeItem("token");

    // Reset user state
    setUser(null);

    // Reset auth checked state to allow re-checking on next login
    setAuthChecked(false);

    // Force a page reload to clear any cached state
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
