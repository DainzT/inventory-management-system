const API_URL = `${import.meta.env.VITE_API_URL}/api`;

interface AuthResponse {
  token?: string;
  isPinSet?: boolean;
  isAuthenticated?: boolean;
  message?: string;
}

export const checkUserAPI = async (): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/check-user`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const setupPinAPI = async (pin: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/setup-pin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pin }),
  });
  return res.json();
};

export const loginAPI = async (pin: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Login failed");
  }

  return res.json();
};

export const logoutAPI = async (): Promise<void> => {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Logout failed");
  }
};

export const changePinAPI = async (
  oldPin: string,
  newPin: string,
  accessToken: string
): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/change-pin`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ oldPin, newPin }),
    credentials: "include",
  });

  return res.json();
};

export const refreshTokenAPI = async () => {
  const res = await fetch(`${API_URL}/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to refresh token");
  }

  return res.json();
};

export const createAdminAPI = async (payload: {
  email: string;
  pin: string;
  confirmPin: string;
}) => {
  const res = await fetch(`${API_URL}/auth/create-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create admin");
  }

  return res.json();
};

export const sendOtpEmailAPI = async (email: string): Promise<void> => {
  const res = await fetch(`${API_URL}/auth/send-otp-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Failed to parse JSON response from server.");
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Failed to send OTP email.");
  }
};

export const verifyPinAPI = async (
  pin: string
): Promise<{ message: string }> => {
  const res = await fetch(`${API_URL}/auth/verify-pin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pin }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "PIN verification failed");
  }

  return res.json();
};

export const verifyEmailAPI = async (
  email: string
): Promise<{ message: string }> => {
  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Email verification failed");
  }

  return res.json();
};

export const verifyOtpAPI = async (email: string, otp: string) => {
  const res = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "OTP verification failed");
  }

  return res.json();
};

export const resetPinAPI = async (
  email: string,
  newPin: string
): Promise<void> => {
  const res = await fetch(`${API_URL}/auth/reset-pin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, newPin }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to reset PIN");
  }
};

export const changeEmailAPI = async (
  oldEmail: string,
  newEmail: string,
  accessToken: string
) => {
  const res = await fetch(`${API_URL}/auth/change-email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ oldEmail, newEmail }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to change email.");
  }

  return res.json();
};
