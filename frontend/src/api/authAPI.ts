const API_URL = import.meta.env.VITE_API_URL;

export const checkPin = async () => {
  const res = await fetch(`${API_URL}/api/auth/check-pin`);
  return res.json();
};

export const setupPin = async (pin: string) => {
  const res = await fetch(`${API_URL}/api/auth/setup-pin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
  });
  return res.json();
};

export const login = async (
  pin: string
): Promise<{ token?: string; message?: string }> => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Login failed");
  }

  return res.json();
};

export const changePin = async (oldPin: string, newPin: string) => {
  const res = await fetch(`${API_URL}/api/auth/change-pin`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ oldPin, newPin }),
  });
  return res.json();
};
