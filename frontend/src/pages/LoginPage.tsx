import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Logo } from "@/components/SidebarComponents/Logo";
import LoginInput from "@/components/AuthComponents/LoginInput";
import CreateAdmin from "@/components/AuthComponents/CreateAdmin";
import ForgotPin from "@/components/AuthComponents/ForgotPin";
import { ClipLoader } from "react-spinners";
import { AlertCircle } from "lucide-react";

const LoginPage: React.FC = () => {
  const [pin, setPin] = useState("");
  const [showForgotPin, setShowForgotPin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    login,
    showCreateAdmin,
    setShowCreateAdmin,
    loading,
    error,
    setError,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async () => {
    const success = await login(pin);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/inventory");
      }, 1500);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && pin && !loading && !isSuccess) {
        handleLogin();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pin, loading, isSuccess]);

  if (showCreateAdmin) {
    return <CreateAdmin onSuccess={() => setShowCreateAdmin(false)} />;
  }

  return (
    <main className="flex flex-col items-center justify-start h-screen w-screen">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center px-4 mb-8">
        <section className="w-full max-w-md">
          <div className="flex flex-col items-center mb-4">
            <Logo width={20} height={20} />
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500">Admin Portal</p>
          </div>
          <div className="space-y-2">
            <LoginInput
              pin={pin}
              setPin={setPin}
              disabled={loading || isSuccess}
              error={error!}
              setError={setError}
              onEnterPress={() => {
                if (pin && !loading && !isSuccess) {
                  handleLogin();
                }
              }}
            />
            <div className="w-full flex justify-between -mt-1 mb-2">
              <div
                className={`transition-all duration-200 ease-in-out ${
                  error ? "max-h-10 opacity-100 mt-1" : "max-h-0 opacity-0"
                }`}
              >
                {error && (
                  <p className="text-xs text-red-500 flex items-center -mt-1">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {error}
                  </p>
                )}
              </div>
              <button
                onClick={() => !isSuccess && setShowForgotPin(true)}
                disabled={isSuccess || loading}
                className={`text-sm font-medium flex justify-end hover:underline underline-offset-2 ${
                  isSuccess || loading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-500"
                }`}
              >
                Forgot PIN?
              </button>
            </div>
            {showForgotPin && (
              <ForgotPin onClose={() => setShowForgotPin(false)} />
            )}
            <button
              onClick={handleLogin}
              disabled={loading || !pin || isSuccess}
              className={`w-full h-10 rounded-xl text-lg font-semibold text-white transition-all duration-200 flex items-center justify-center ${
                loading ? "cursor-wait" : ""
              }
                ${
                  !pin || isSuccess
                    ? "bg-accent/60 cursor-not-allowed"
                    : "bg-accent   hover:bg-[#297885] active:scale-[0.98] shadow-md hover:shadow-lg"
                }`}
            >
              {loading ? (
                <>
                  <ClipLoader color="#ffffff" size={20} className="mr-2" />
                  Logging in...
                </>
              ) : isSuccess ? (
                "Success!"
              ) : (
                "Login"
              )}
            </button>
          </div>
        </section>
      </div>
      <footer className="py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Vicmar Fishing Portal. All rights reserved.
      </footer>
    </main>
  );
};

export default LoginPage;
