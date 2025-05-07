import { useState, useEffect } from "react";
import {
  checkUserAPI,
  loginAPI,
  changePinAPI,
  sendOtpEmailAPI,
  verifyPinAPI,
  verifyEmailAPI,
  verifyOtpAPI,
  createAdminAPI,
  refreshTokenAPI,
  resetPinAPI,
  logoutAPI,
  changeEmailAPI,
} from "../api/authAPI";
import { useToast } from "./useToast";

interface AuthResponse {
  accessToken?: string;
  message?: string;
  isPinSet?: boolean;
  isAuthenticated?: boolean;
}

interface ErrorWithMessage {
  message: string;
}

const TOKEN_KEY = "access_token";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem(TOKEN_KEY);
  });
  const [isPinSet, setIsPinSet] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateAdmin, setShowCreateAdmin] = useState<boolean>(false);
  const { showErrorToast, showLoadingToast, showSuccessToast } = useToast();
  const isAuthenticated = !!token;

  useEffect(() => {
    const statusId = "pin-status-toast";
    const fetchUserStatus = async () => {
      // showLoadingToast(statusId, "Checking PIN status...");
      try {
        const data = await checkUserAPI();
        setIsPinSet(data.isPinSet ?? false);
        setShowCreateAdmin(!data.isPinSet);
        if (data.isAuthenticated && data.token) {
          sessionStorage.setItem(TOKEN_KEY, data.token);
          setToken(data.token);
        }
        // showSuccessToast(statusId, "PIN status checked successfully.");
      } catch (err) {
        const error = err as ErrorWithMessage;
        setError(error.message || "Failed to check PIN status.");
        showErrorToast(
          statusId,
          error.message || "Failed to check PIN status."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserStatus();
  }, []);

  const login = async (pin: string) => {
    const loginId = "login-toast";
    showLoadingToast(loginId, "Logging in...");
    if (!pin || pin.trim() === "") {
      showErrorToast(loginId, "PIN input cannot be empty.");
      setLoading(false);
      return false;
    }
    try {
      setLoading(true);
      const data: AuthResponse = await loginAPI(pin);
      if (data.accessToken) {
        sessionStorage.setItem(TOKEN_KEY, data.accessToken);
        setToken(data.accessToken);
        setError(null);
        showSuccessToast(loginId, "Login successful.");
        return true;
      } else {
        setError(data.message || "Invalid PIN");
        showErrorToast(loginId, data.message || "Invalid PIN");
        return false;
      }
    } catch (err) {
      const error = err as ErrorWithMessage;
      const message =
        error.message === "Failed to fetch"
          ? "Network error. Please check your internet connection."
          : error.message || "Login failed. Try again.";
      setError(message);
      showErrorToast(loginId, message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const logoutId = "logout-toast";
    showLoadingToast(logoutId, "Logging out...");
    try {
      setLoading(true);
      await logoutAPI();
      sessionStorage.removeItem(TOKEN_KEY);
      setToken(null);
      showSuccessToast(logoutId, "Logout successful.");
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message);
      showErrorToast(logoutId, "Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updatePin = async (newPin: string) => {
    const updatePinId = "update-pin-toast";
    showLoadingToast(updatePinId, "Updating PIN...");

    const accessToken = sessionStorage.getItem(TOKEN_KEY);
    if (!accessToken) {
      showErrorToast(
        updatePinId,
        "No access token found. Please log in again."
      );
      return;
    }

    try {
      setLoading(true);
      const data: AuthResponse = await changePinAPI(newPin, accessToken);

      if (data.message === "PIN updated successfully") {
        setError(null);
        showSuccessToast(updatePinId, "PIN updated successfully.");
        return true;
      } else {
        setError(data.message || "Unknown error occurred");
        showErrorToast(updatePinId, data.message || "Unknown error occurred.");
        return false;
      }
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Failed to change PIN.");
      showErrorToast(updatePinId, error.message || "Failed to change PIN.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async (payload: {
    email: string;
    pin: string;
    confirmPin: string;
  }) => {
    const createAdminId = "create-admin-toast";
    showLoadingToast(createAdminId, "Creating admin account...");
    if (payload.pin !== payload.confirmPin) {
      setError("PIN and Confirm PIN do not match.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      showErrorToast(createAdminId, "Old email format is invalid.");
      return;
    }

    if (!emailRegex.test(payload.email)) {
      showErrorToast(createAdminId, "New email format is invalid.");
      return;
    }
    try {
      setLoading(true);
      const data = await createAdminAPI(payload);
      showSuccessToast(
        createAdminId,
        "Admin account created successfully.\nEnter OTP to verify."
      );
      return data;
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Failed to create admin");
      showErrorToast(createAdminId, error.message || "Failed to create admin");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendOtpEmail = async (email: string) => {
    const sendOtpId = "send-otp-toast";
    showLoadingToast(sendOtpId, "Sending OTP...");
    try {
      setLoading(true);
      await sendOtpEmailAPI(email);
      showSuccessToast(sendOtpId, "OTP sent to email.");
      return true;
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Failed to send OTP");
      showErrorToast(sendOtpId, error.message || "Failed to send OTP");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyPin = async (pin: string) => {
    const verifyPinId = "verify-pin-toast";
    showLoadingToast(verifyPinId, "Verifying PIN...");
    try {
      setLoading(true);
      const data = await verifyPinAPI(pin);
      showSuccessToast(
        verifyPinId,
        data.message || "PIN verified successfully."
      );
      setError(null);
      return data;
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "PIN verification failed");
      showErrorToast(verifyPinId, error.message || "PIN verification failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email: string) => {
    const verifyEmailId = "verify-email-toast";
    showLoadingToast(verifyEmailId, "Verifying email...");
    try {
      setLoading(true);
      const data = await verifyEmailAPI(email);

      showSuccessToast(
        verifyEmailId,
        data.message || "Email verified successfully."
      );
      setError(null);
      return data;
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Email verification failed");
      showErrorToast(
        verifyEmailId,
        error.message || "Email verification failed"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    const verifyOtpId = "verify-otp-toast";
    showLoadingToast(verifyOtpId, "Verifying OTP...");

    try {
      setLoading(true);
      const data = await verifyOtpAPI(otp);

      if (data.message === "OTP verified successfully") {
        showSuccessToast(verifyOtpId, "OTP verified successfully.");
      } else {
        showErrorToast(verifyOtpId, data.message || "OTP verification failed");
      }
      return data;
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "OTP verification failed");
      showErrorToast(verifyOtpId, error.message || "OTP verification failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyAndResetPin = async (
    email: string,
    otp: string,
    newPin: string
  ) => {
    const verifyResetId = "verify-reset-toast";
    showLoadingToast(verifyResetId, "Verifying and resetting PIN...");
    try {
      setLoading(true);
      setError(null);
      await verifyOtpAPI(otp);
      await resetPinAPI(email, newPin);
      showSuccessToast(verifyResetId, "PIN reset successfully.");
      setIsPinSet(true);
      return true;
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "PIN reset failed");
      showErrorToast(verifyResetId, error.message || "PIN reset failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changeEmail = async (oldEmail: string, newEmail: string) => {
    const toastId = "change-email-toast";
    showLoadingToast(toastId, "Changing email...");

    const accessToken = sessionStorage.getItem(TOKEN_KEY);
    if (!accessToken) {
      showErrorToast(toastId, "No access token found. Please log in again.");
      return;
    }

    if (!newEmail || !newEmail.trim()) {
      showErrorToast(toastId, "New email is required.");
      setLoading(false);
      return;
    }

    if (!oldEmail || !newEmail || oldEmail === "" || newEmail === "") {
      showErrorToast(toastId, "Both old and new email are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(oldEmail)) {
      showErrorToast(toastId, "Old email format is invalid.");
      return;
    }

    if (!emailRegex.test(newEmail)) {
      showErrorToast(toastId, "New email format is invalid.");
      return;
    }

    if (oldEmail === newEmail) {
      showErrorToast(toastId, "New email must be different from old email.");
      return;
    }

    try {
      setLoading(true);
      const data: AuthResponse = await changeEmailAPI(
        oldEmail,
        newEmail,
        accessToken
      );

      if (data.message === "Email updated successfully.") {
        setError(null);
        showSuccessToast(toastId, "Email updated successfully.");
        return true;
      } else {
        setError(data.message || "Unknown error occurred");
        showErrorToast(toastId, data.message || "Unknown error occurred.");
        return false;
      }
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Failed to change email.");
      showErrorToast(toastId, error.message || "Failed to change email.");
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async (showToast = false) => {
    try {
      const data = await refreshTokenAPI();
      if (data.accessToken) {
        sessionStorage.setItem(TOKEN_KEY, data.accessToken);
        setToken(data.accessToken);
        if (showToast) showSuccessToast("refresh-toast", "Token refreshed");
      }
    } catch (err) {
      const error = err as ErrorWithMessage;
      if (showToast) {
        showErrorToast(
          "refresh-toast",
          error.message || "Token refresh failed"
        );
      }
      setError(error.message || "Failed to refresh token.");
      setToken(null);
    }
  };

  useEffect(() => {
    if (!token) return;

    refreshToken();

    const interval = setInterval(() => {
      refreshToken();
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  return {
    token,
    isAuthenticated,
    isPinSet,
    loading,
    error,
    showCreateAdmin,
    setShowCreateAdmin,
    setIsPinSet,
    createAdmin,
    login,
    logout,
    // setupNewPin,
    updatePin,
    sendOtpEmail,
    verifyPin,
    verifyEmail,
    verifyOtp,
    verifyAndResetPin,
    changeEmail,
    refreshToken,
  };
};
