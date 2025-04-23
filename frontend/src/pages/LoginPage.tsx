import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Logo } from "@/components/SidebarComponents/Logo";
import PinInput from "@/components/AuthComponents/PinInput";
import { ClipLoader } from "react-spinners";
import { login, checkAdminExists } from "@/api/authAPI";
import ChangePin from "@/components/AuthComponents/ChangePin";
import CreateAdmin from "@/components/AuthComponents/CreateAdmin";
import ForgotPin from "@/components/AuthComponents/ForgotPin";

interface LoginResponse {
  token?: string;
  message?: string;
}

interface ApiError {
  message: string;
}

const LoginPage: React.FC = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChangePin, setShowChangePin] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [showForgotPin, setShowForgotPin] = useState(false);

  const navigate = useNavigate();

  function isApiError(error: unknown): error is ApiError {
    return typeof error === "object" && error !== null && "message" in error;
  }

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const exists = await checkAdminExists();
        setShowCreateAdmin(!exists);
      } catch (err) {
        console.error("Failed to check admin status", err);
      }
    };
    fetchAdminStatus();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await login(pin);
      navigate("/inventory");
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (showCreateAdmin) {
    return <CreateAdmin onSuccess={() => setShowCreateAdmin(false)} />;
  }

  return (
    <main className="flex flex-col items-center justify-start h-screen w-screen bg-white">
      <Header />

      <section className="relative flex flex-col items-center justify-center flex-grow w-full">
        <Logo width={20} height={20} />
        <h1 className="text-4xl font-bold text-black mb-9">Welcome, Admin!</h1>

        <PinInput pin={pin} setPin={setPin} />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="button"
          onClick={() => setShowChangePin(true)}
          className="mt-2 text-sm text-cyan-700 underline hover:text-cyan-900"
        >
          Change PIN?
        </button>
        {showChangePin && <ChangePin onClose={() => setShowChangePin(false)} />}

        <div className="mb-3">
          <button
            type="button"
            onClick={() => setShowForgotPin(true)}
            className="mt-2 mb-4 text-sm text-cyan-700 underline hover:text-cyan-900"
          >
            Forgot PIN?
          </button>
        </div>

        {showForgotPin && <ForgotPin onClose={() => setShowForgotPin(false)} />}

        <button
          onClick={handleLogin}
          className="w-40 h-12 bg-accent rounded-[11px] text-xl font-semibold text-white"
        >
          {loading ? <ClipLoader color="#f4f4f4" size={20} /> : "Login"}
        </button>
      </section>
    </main>
  );
};

export default LoginPage;
