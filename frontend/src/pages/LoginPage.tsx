import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Logo } from "@/components/SidebarComponents/Logo";
import LoginInput from "@/components/AuthComponents/LoginInput";
import CreateAdmin from "@/components/AuthComponents/CreateAdmin";
import ForgotPin from "@/components/AuthComponents/ForgotPin";
import { ToastContainer } from "react-toastify";

const LoginPage: React.FC = () => {
  const [pin, setPin] = useState("");
  const [showForgotPin, setShowForgotPin] = useState(false);
  const { login, showCreateAdmin, setShowCreateAdmin } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async () => {
    const success = await login(pin);
    if (success) {
      navigate("/inventory");
    }
  };

  if (showCreateAdmin) {
    return <CreateAdmin onSuccess={() => setShowCreateAdmin(false)} />;
  }

  return (
    <main className="flex flex-col items-center justify-start h-screen w-screen bg-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Header />

      <section className="relative flex flex-col items-center justify-center flex-grow w-full">
        <Logo width={20} height={20} />
        <h1 className="text-4xl font-bold text-black mb-9">Welcome, Admin!</h1>

        <LoginInput pin={pin} setPin={setPin} />

        <div className="mb-3">
          <button
            type="button"
            onClick={() => setShowForgotPin(true)}
            className="mb-4 text-sm text-cyan-700 underline hover:text-accent-light cursor-pointer flex justify-end w-96 px-2"
          >
            Forgot PIN?
          </button>
        </div>

        {showForgotPin && <ForgotPin onClose={() => setShowForgotPin(false)} />}

        <button
          onClick={handleLogin}
          className="w-40 h-12 bg-accent rounded-[11px] hover:bg-accent-dark cursor-pointer active:scale-95 text-xl font-semibold text-white hover:text-white transition-all duration-200"
        >
          Login
        </button>
      </section>
    </main>
  );
};

export default LoginPage;
