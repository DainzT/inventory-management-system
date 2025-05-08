import React, { useState } from "react";
import Portal from "@/utils/Portal";
import { ClipLoader } from "react-spinners";
import AuthInput from "@/components/AuthComponents/AuthInput";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

interface ForgotPinProps {
  onClose: () => void;
}

const ForgotPin: React.FC<ForgotPinProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const {
    loading,
    otpSent,
    setOtpSent,
    otpVerified,
    handleVerifyEmail,
    handleVerifyOTP,
    ResetPin,
  } = useAuth();

  const handleSendOTP = async () => {
    await handleVerifyEmail(email);
  };

  const handleOTPVerification = async () => {
    await handleVerifyOTP(otp);
  };

  const handleResetPin = async () => {
    await ResetPin(email, newPin);
    toast.success("Closing modal...", {
      autoClose: 1500,
      onClose,
    });
  };

  const handleBack = () => {
    setOtpSent(false);
  };

  return (
    <Portal>
      <div className="flex fixed inset-0 justify-center items-center select-none">
        <div className="relative px-6 py-4 w-[24rem] bg-white rounded-2xl z-50 border-2 shadow-sm border-zinc-300 animate-[fadeIn_0.2s_ease-out]">
          <header className="mb-4">
            <h2 className="text-2xl font-semibold text-cyan-800">
              Forgot your PIN?
            </h2>
          </header>
          {!otpSent ? (
            <AuthInput
              label="Email"
              value={email}
              type="text"
              onChange={setEmail}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          ) : !otpVerified ? (
            <AuthInput
              label="OTP"
              value={otp}
              type="text"
              onChange={setOtp}
              placeholder="Enter OTP"
              required
              disabled={loading}
            />
          ) : (
            <AuthInput
              label="New PIN"
              value={newPin}
              type="password"
              onChange={setNewPin}
              placeholder="Enter new PIN"
              isPin
              required
              disabled={loading}
            />
          )}

          <div className="flex justify-end gap-2 mt-6">
            {otpSent ? (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition cursor-pointer"
                disabled={loading}
              >
                Back
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
            )}
            <button
              onClick={
                otpSent
                  ? otpVerified
                    ? handleResetPin
                    : handleOTPVerification
                  : handleSendOTP
              }
              className="px-4 py-2 text-white bg-cyan-700 rounded-md hover:bg-cyan-800 transition cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="#f4f4f4" />
              ) : otpSent ? (
                otpVerified ? (
                  "Reset PIN"
                ) : (
                  "Verify OTP"
                )
              ) : (
                "Send OTP"
              )}
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

export default ForgotPin;
