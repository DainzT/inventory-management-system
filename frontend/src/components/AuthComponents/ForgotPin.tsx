import React, { useState } from "react";
import Portal from "@/utils/Portal";
import { ClipLoader } from "react-spinners";
import { sendOtpEmail, verifyOtp, resetPin } from "@/api/authAPI";
import { useNavigate } from "react-router-dom";

interface ForgotPinProps {
  onClose: () => void;
}

const ForgotPin: React.FC<ForgotPinProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError("");
      await sendOtpEmail(email);
      setOtpSent(true);
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError("");
      await verifyOtp(email, otp);
      await resetPin(email, newPin);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "OTP verification failed. Please try again.");
      } else {
        setError("OTP verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <div className="flex fixed inset-0 justify-center items-center select-none">
        <div className="relative px-6 py-4 w-[24rem] bg-white rounded-2xl z-50 border-2 shadow-sm border-zinc-300 animate-[fadeIn_0.2s_ease-out]">
          <header className="mb-4">
            <h2 className="text-2xl font-semibold text-cyan-800">Forgot PIN</h2>
          </header>

          {!otpSent ? (
            <>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </>
          ) : (
            <>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <label className="block text-sm font-medium text-zinc-700 mb-1 mt-4">
                New PIN
              </label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Enter new PIN"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </>
          )}

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={otpSent ? handleVerifyOTP : handleSendOTP}
              className="px-4 py-2 text-white bg-cyan-700 rounded-md hover:bg-cyan-800 transition"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="#f4f4f4" />
              ) : otpSent ? (
                "Verify OTP"
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        </div>

        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      </div>
    </Portal>
  );
};

export default ForgotPin;
