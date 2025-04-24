const API_URL = `${import.meta.env.VITE_API_URL}/api`;

interface AuthResponse {
  token?: string;
  isPinSet?: boolean;
  isAuthenticated?: boolean;
  message?: string;
}

export const checkPin = async (): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/check-pin`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const setupPin = async (pin: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/setup-pin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pin }),
  });
  return res.json();
};

export const login = async (pin: string): Promise<AuthResponse> => {
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

export const changePin = async (
  oldPin: string,
  newPin: string
): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/change-pin`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ oldPin, newPin }),
    credentials: "include",
  });
  return res.json();
};

export const refreshToken = async () => {
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

export const checkAdminExists = async (): Promise<boolean> => {
  const res = await fetch(`${API_URL}/auth/check-pin`, {
    credentials: "include",
  });

  const data = await res.json();
  return data.isPinSet === true;
};

export const createAdmin = async (payload: {
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

export const sendOtpEmail = async (email: string): Promise<void> => {
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

export const verifyOtp = async (
  email: string,
  otp: string
): Promise<AuthResponse> => {
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

export const verifyToken = async (
  token: string
): Promise<{ token?: string }> => {
  const res = await fetch(`${API_URL}/auth/verify-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Token verification failed");
  }

  return res.json();
};

export const resetPin = async (
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
