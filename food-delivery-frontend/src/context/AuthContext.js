import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const user = auth.getCurrentUser();
        if (user) {
          setUser(user);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await auth.login(credentials);
      const { token, user } = response.data;

      // Store token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await auth.register(userData);
      const { token, user } = response.data;

      // Store token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
