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
  logoutAPI,
  changeEmailAPI,
  resetPinAPI,
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateAdmin, setShowCreateAdmin] = useState<boolean>(false);
  const { showErrorToast, showLoadingToast, showSuccessToast } = useToast();
  const isAuthenticated = !!token;

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

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
    showLoadingToast(loginId, "Attempting to login...");
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
      await changePinAPI(newPin, accessToken);
      showSuccessToast(updatePinId, "PIN updated successfully.");
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Failed to change PIN.");
      showErrorToast(updatePinId, error.message || "Failed to change PIN.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (payload: {
    email: string;
    pin: string;
    confirmPin: string;
  }) => {
    const createAdminId = "create-admin-toast";
    try {
      setLoading(true);
      showLoadingToast(createAdminId, "Creating account for Admin.");
      await createAdminAPI(payload);
      showSuccessToast(createAdminId, "Admin account created successfully.");
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Failed to create admin");
      showErrorToast(createAdminId, error.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (
    email: string,
    pin: string,
    confirmPin: string
  ) => {
    const sendOtpId = "send-otp-toast";
    showLoadingToast(sendOtpId, "Sending OTP...");
    try {
      setLoading(true);
      await sendOtpEmailAPI(email, pin, confirmPin);
      showSuccessToast(sendOtpId, "OTP sent to email.");
      setOtpSent(true);
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Failed to send OTP");
      showErrorToast(sendOtpId, error.message || "Failed to send OTP");
      throw err;
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
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "PIN verification failed");
      showErrorToast(verifyPinId, error.message || "PIN verification failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (email: string) => {
    const verifyEmailId = "verify-email-toast";
    showLoadingToast(verifyEmailId, "Verifying email...");
    try {
      setLoading(true);
      const data = await verifyEmailAPI(email);
      setOtpSent(true);
      showSuccessToast(
        verifyEmailId,
        data.message || "Email verified successfully."
      );
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

  const handleVerifyOTP = async (otp: string) => {
    const verifyOtpId = "verify-otp-toast";
    showLoadingToast(verifyOtpId, "Verifying OTP...");
    try {
      setLoading(true);
      await verifyOtpAPI(otp);
      setOtpVerified(true);
      showSuccessToast(verifyOtpId, "OTP verified successfully.");
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "OTP verification failed");
      showErrorToast(verifyOtpId, error.message || "OTP verification failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const ResetPin = async (email: string, newPin: string) => {
    const verifyResetId = "verify-reset-toast";
    showLoadingToast(verifyResetId, "Resetting PIN...");
    try {
      setLoading(true);
      await resetPinAPI(email, newPin);
      showSuccessToast(verifyResetId, "PIN reset successfully.");
      setIsPinSet(true);
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "PIN reset failed");
      showErrorToast(verifyResetId, error.message || "PIN reset failed");
      throw error;
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

    try {
      setLoading(true);
      await changeEmailAPI(oldEmail, newEmail, accessToken);
      showSuccessToast(toastId, "Email updated successfully.");
    } catch (err) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Failed to change email.");
      showErrorToast(toastId, error.message || "Failed to change email.");
      throw error;
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
    otpSent,
    otpVerified,
    setOtpSent,
    setOtpVerified,
    setShowCreateAdmin,
    setIsPinSet,
    handleCreateAdmin,
    login,
    logout,
    setLoading,
    updatePin,
    handleSendOTP,
    verifyPin,
    handleVerifyEmail,
    handleVerifyOTP,
    ResetPin,
    changeEmail,
    refreshToken,
    setError,
  };
};
