import React, { useState } from "react";
import Portal from "@/utils/Portal";
import { ClipLoader } from "react-spinners";
import AuthInput from "@/components/AuthComponents/AuthInput";
import { useAuth } from "@/hooks/useAuth";

interface ForgotPinProps {
  onClose: () => void;
}

const ForgotPin: React.FC<ForgotPinProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sendOtpEmail, verifyAndResetPin, verifyEmail } = useAuth();

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      await verifyEmail(email);
      await sendOtpEmail(email);
      setOtpSent(true);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      await verifyAndResetPin(email, otp, newPin);
      setLoading(false);
      onClose();
    } catch {
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
              <AuthInput
                label="Email"
                value={email}
                type="text"
                onChange={setEmail}
                placeholder="Enter your email"
                required
              />
            </>
          ) : (
            <>
              <AuthInput
                label="OTP"
                value={otp}
                type="text"
                onChange={setOtp}
                placeholder="Enter OTP"
                required
              />
              <AuthInput
                label="New PIN"
                value={newPin}
                type="password"
                onChange={setNewPin}
                placeholder="Enter new PIN"
                isPin
                required
              />
            </>
          )}

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
