import axios from "axios";

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

export const checkAdminExists = async (): Promise<boolean> => {
  const res = await fetch(`${API_URL}/auth/check-pin`, {
    credentials: "include",
  });

  const data = await res.json();
  return data.isPinSet === true;
};

export const createAdmin = async (payload: {
  pin: string;
  confirmPin: string;
  backupPin: string;
  securityQuestions: { question: string; securityAnswers: string }[];
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

export async function resetPinWithBackup(
  backupPin: string,
  answers: { question: string; answer: string }[],
  newPin: string
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${API_URL}/auth/reset-pin-input`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ backupPin, securityAnswers: answers, newPin }),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to reset PIN");
  }

  return data;
}

export interface SecurityQuestion {
  question: string;
  securityAnswers: string[];
}

export async function getSecurityQuestions(): Promise<{
  questions: SecurityQuestion[];
}> {
  const response = await fetch(`${API_URL}/auth/security-questions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch security questions");
  }

  const data = await response.json();

  return {
    questions: data.questions as SecurityQuestion[], // Type assertion to ensure it's the expected shape
  };
}
