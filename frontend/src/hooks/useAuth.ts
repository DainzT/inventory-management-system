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
}

interface ErrorWithMessage {
  message: string;
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isPinSet, setIsPinSet] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    const fetchPinStatus = async () => {
      try {
        const data = await checkPin();
        setIsPinSet(data.isPinSet ?? false);
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
        setToken(data.token);
        setError(null);
      } else {
        setError(data.message || "Invalid PIN");
      }
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
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

  return {
    token,
    isPinSet,
    loading,
    error,
    login,
    logout,
    setupNewPin,
    updatePin,
  };
};
