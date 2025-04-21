import { useState, useEffect } from "react";
import {
  checkPin,
  setupPin,
  login as loginAPI,
  changePin,
} from "../api/authAPI";

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
        if (data.isAuthenticated) {
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
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      sessionStorage.removeItem(TOKEN_KEY);
      setToken(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const setupNewPin = async (pin: string) => {
    try {
      setLoading(true);
      const data: AuthResponse = await setupPin(pin);
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
      const data: AuthResponse = await changePin(oldPin, newPin);
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

  useEffect(() => {
    const refreshToken = async () => {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const res = await fetch(`${API_URL}/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
          });
          const data = await res.json();
          if (data.token) {
            sessionStorage.setItem(TOKEN_KEY, data.token);
            setToken(data.token);
          }
        } catch (err) {
          console.error("Token refresh failed:", err);
        }
      }
    };

    const tokenExpirationInterval = setInterval(refreshToken, 30 * 60 * 1000);

    return () => {
      clearInterval(tokenExpirationInterval);
    };
  }, []);

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
  };
};
