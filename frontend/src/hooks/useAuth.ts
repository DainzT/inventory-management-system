import { useState, useEffect } from "react";
import {
  checkPin,
  setupPin,
  login as loginAPI,
  changePin,
} from "../api/authAPI";

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
        setIsPinSet(data.isPinSet);
      } catch (err: any) {
        console.error("Error checking PIN status:", err);
        setError(err.message || "Failed to check PIN status.");
      } finally {
        setLoading(false);
      }
    };
    fetchPinStatus();
  }, []);

  const login = async (pin: string) => {
    try {
      setLoading(true);
      const data = await loginAPI(pin);
      if (data.token) {
        setToken(data.token);
        setError(null);
      } else {
        setError(data.message || "Invalid PIN");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Try again.");
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
      const data = await setupPin(pin);
      if (data.message === "Pin set successfully") {
        setIsPinSet(true);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to set PIN.");
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
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to change PIN.");
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
