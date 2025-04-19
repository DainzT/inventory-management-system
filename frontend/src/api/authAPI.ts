const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const checkPin = async () => {
  const res = await fetch(`${API_URL}/auth/check-pin`, {
    credentials: "include",
  });
  return res.json();
};

export const setupPin = async (pin: string) => {
  const res = await fetch(`${API_URL}/auth/setup-pin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
    credentials: "include",
  });
  return res.json();
};

export const login = async (
  pin: string
): Promise<{ token?: string; message?: string }> => {
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

export const changePin = async (oldPin: string, newPin: string) => {
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
