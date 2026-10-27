import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await authService.initAuth();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to initialize auth:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      setCurrentUser(res.user);
      toast.success("Welcome Back!", `Logged in as ${res.user.name}`);
      return res;
    } catch (err) {
      toast.error("Login Failed", err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      setCurrentUser(res.user);
      toast.success("Account Created!", "Welcome to Campus Shield university network.");
      return res;
    } catch (err) {
      toast.error("Registration Failed", err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      toast.info("Logged Out", "You have been signed out securely.");
    } catch (err) {
      toast.error("Error", "Could not complete logout.");
    }
  };

  const updateProfile = async (updates) => {
    try {
      const updated = await authService.updateProfile(updates);
      setCurrentUser(updated);
      toast.success("Profile Updated", "Your campus profile changes were saved.");
      return updated;
    } catch (err) {
      toast.error("Update Failed", err.message);
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await authService.forgotPassword(email);
      toast.info("Recovery Email Sent", res.message);
      return res;
    } catch (err) {
      toast.error("Error", err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword
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
