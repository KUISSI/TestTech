import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Laisser api.js gérer l'ajout du token au header
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("/users/me");
      setUser(response.data);
      setIsAuthenticated(true);
    } catch {
      logout();
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await api.post("/token", formData);
      const token = response.data.access_token;

      localStorage.setItem("accessToken", token);
      setIsAuthenticated(true);

      await fetchUser();
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e.response?.data?.detail || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
