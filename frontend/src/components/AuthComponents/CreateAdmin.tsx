import React, { useState } from "react";
import Portal from "@/utils/Portal";
import { ClipLoader } from "react-spinners";
import AuthInput from "@/components/AuthComponents/AuthInput";
import { useAuth } from "@/hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";

interface CreateAdminModalProps {
  onSuccess: () => void;
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const {
    loading,
    otpVerified, setOtpVerified,
    otpSent, setOtpSent,
    handleSendOTP,
    handleVerifyOTP,
    handleCreateAdmin,
  } = useAuth();

  const handleNextStep = async () => {
    if (!otpSent) {
      await handleSendOTP(email, pin, confirmPin);
    } else if (!otpVerified) {
      await handleVerifyOTP(otp);
      await handleCreateAdmin({ email, pin, confirmPin });
      toast.success("Redirecting to login", {
        onClose: () => onSuccess()
      });
    }
  };

  const handleBack = () => {
    if (otpVerified) {
      setOtpVerified(false);
    } else if (otpSent) {
      setOtpSent(false);
    }
  };

  const getButtonText = () => {
    if (loading) return <ClipLoader size={20} color="#fff" />;
    if (!otpSent) return "Send OTP";
    if (!otpVerified) return "Verify OTP";
    return "Admin Created";
  };

  return (
    <Portal>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      />

      <div className="fixed inset-0 flex justify-center items-center select-none">
        <div className="relative w-[24rem] px-6 py-6 bg-white border-2 z-50 border-zinc-300 rounded-2xl shadow-md animate-[fadeIn_0.2s_ease-out]">
          <header className="mb-4">
            <h2 className="text-2xl font-semibold text-cyan-800">
              Create Admin
            </h2>
          </header>

          {!otpSent ? (
            <>
              <AuthInput
                label="PIN"
                placeholder="Enter PIN"
                value={pin}
                onChange={setPin}
                type="password"
                isPin
                required
                disabled={loading}
              />
              <AuthInput
                label="Confirm PIN"
                placeholder="Re-enter PIN"
                value={confirmPin}
                onChange={setConfirmPin}
                type="password"
                isPin
                required
                disabled={loading}
              />
              <AuthInput
                label="Enter Email"
                placeholder="Enter your email"
                value={email}
                onChange={setEmail}
                type="text"
                required
                disabled={loading}
              />
            </>
          ) : (
            <AuthInput
              label="OTP"
              placeholder="Enter OTP sent to your email"
              value={otp}
              onChange={setOtp}
              type="text"
              required
              disabled={otpVerified || loading}
            />
          )}

          <div className="flex justify-end gap-2 mt-6">
            {!otpSent && !otpVerified && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                disabled={loading}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNextStep}
              className="px-4 py-2 text-white bg-cyan-700 rounded-md hover:bg-cyan-800 transition w-36 flex items-center justify-center"
              disabled={loading}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />
      </div>
    </Portal>
  );
};

export default CreateAdminModal;
