import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Logo } from "@/components/SidebarComponents/Logo";
import PinInput from "@/components/AuthComponents/PinInput";
import { ClipLoader } from "react-spinners";
import { login } from "@/api/authAPI";

const LoginPage: React.FC = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await login(pin);
      if (response.token) {
        localStorage.setItem("token", response.token);
        navigate("/inventory");
      } else {
        setError(response.message || "Invalid PIN");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-start h-screen w-screen bg-white">
      <Header />

      <section className="relative flex flex-col items-center justify-center flex-grow w-full">
        <Logo width={20} height={20} />

        <h1 className="text-4xl font-bold text-black mb-9">Welcome, Admin!</h1>

        <PinInput pin={pin} setPin={setPin} />
        {error && <p className="text-red-500 text-sm">{error}</p>}

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
