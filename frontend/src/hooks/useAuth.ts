import { useState, useEffect } from "react";
import {
  checkPin,
  setupPin,
  loginAPI,
  changePin,
  sendOtpEmail as sendOtpEmailAPI,
  verifyOtp,
  verifyToken,
  refreshTokenAPI,
  logoutAPI,
} from "../api/authAPI";
import supabase from "@/services/supabaseClient";

interface AuthResponse {
  token?: string;
  message?: string;
  isPinSet?: boolean;
  isAuthenticated?: boolean;
}

interface ErrorWithMessage {
  message: string;
}

const TOKEN_KEY = "access_token";
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem(TOKEN_KEY);
  });
  const [isPinSet, setIsPinSet] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = !!token;

  useEffect(() => {
    const fetchPinStatus = async () => {
      try {
        const data = await checkPin();
        setIsPinSet(data.isPinSet ?? false);
        if (data.isAuthenticated && data.token) {
          sessionStorage.setItem(TOKEN_KEY, data.token);
          setToken(data.token);
        }
      } catch (err) {
        const error = err as ErrorWithMessage;
        setError(error.message || "Failed to check PIN status.");
      } finally {
        setLoading(false);
      }
    };
    fetchPinStatus();
  }, []);

  const login = async (pin: string) => {
    try {
      setLoading(true);
      const data: AuthResponse = await loginAPI(pin);
      if (data.token) {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setError(null);
      } else {
        setError(data.message || "Invalid PIN");
      }
    } catch (err) {
      const error = err as ErrorWithMessage;
      if (error.message === "Failed to fetch") {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(error.message || "Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutAPI();
      sessionStorage.removeItem(TOKEN_KEY);
      setToken(null);
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const setupNewPin = async (pin: string) => {
    try {
      setLoading(true);
      const data = await setupPin(pin);
      if (data.message === "Pin set successfully") {
        setIsPinSet(true);
        setError(null);
      } else {
        setError(data.message || "Unknown error occurred");
      }
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Failed to set PIN.");
    } finally {
      setLoading(false);
    }
  };

  const updatePin = async (oldPin: string, newPin: string) => {
    try {
      setLoading(true);
      const data = await changePin(oldPin, newPin);
      if (data.message === "Pin updated successfully") {
        setError(null);
      } else {
        setError(data.message || "Unknown error occurred");
      }
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Failed to change PIN.");
    } finally {
      setLoading(false);
    }
  };

  const sendOtpEmail = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      console.log("OTP sent to email");
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const loginWithOtp = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session || !session.access_token) {
        throw new Error("OTP login failed or no session found");
      }

      const data = await verifyToken(session.access_token);
      if (data.token) {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setError(null);
      } else {
        throw new Error("Invalid token returned from backend");
      }
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "OTP login failed");
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const data = await refreshTokenAPI();
      if (data.token) {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
      setToken(null);
    }
  };

  return {
    token,
    isAuthenticated,
    isPinSet,
    loading,
    error,
    login,
    logout,
    setupNewPin,
    updatePin,
    loginWithOtp,
    sendOtpEmail,
    refreshToken,
  };
};
