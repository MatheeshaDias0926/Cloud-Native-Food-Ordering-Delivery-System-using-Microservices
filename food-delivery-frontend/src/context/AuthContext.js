import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, getMe } from "../services/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await getMe();
          setUser(userData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const { token, user } = await loginUser(email, password);
    localStorage.setItem("token", token);
    setUser(user);
    navigate("/restaurants");
  };

  const register = async (name, email, password, role) => {
    const { token, user } = await registerUser(name, email, password, role);
    localStorage.setItem("token", token);
    setUser(user);
    navigate(role === "restaurant" ? "/my-restaurant" : "/restaurants");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
