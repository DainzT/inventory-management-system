import React, { useState } from "react";
import Portal from "@/utils/Portal";
import { ClipLoader } from "react-spinners";
import AuthInput from "./AuthInput";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ChangeEmailModalProps {
  onClose: () => void;
}

const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({ onClose }) => {
  const [currentPin, setCurrentPin] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPinVerified, setCurrentPinVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const { verifyPin, verifyEmail, sendOtpEmail, verifyOtp, changeEmail } =
    useAuth();
  const navigate = useNavigate();

  const handleVerifyCurrentPin = async () => {
    try {
      setLoading(true);
      await verifyPin(currentPin);
      setCurrentPinVerified(true);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      await verifyEmail(currentEmail);
      await sendOtpEmail(currentEmail);
      setOtpSent(true);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleVerifyOTPAndUpdateEmail = async () => {
    try {
      setLoading(true);
      await verifyOtp(currentEmail, otp);
      await changeEmail(currentEmail, newEmail);
      setLoading(false);
      onClose();
      navigate("/login");
    } catch {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (!currentPinVerified) return handleVerifyCurrentPin();
    if (!otpSent) return handleSendOTP();
    return handleVerifyOTPAndUpdateEmail();
  };

  return (
    <Portal>
      <div className="flex fixed inset-0 justify-center items-center select-none z-50">
        <div className="relative px-6 py-4 w-[24rem] bg-white z-50 rounded-2xl border-2 shadow-sm border-zinc-300 animate-[fadeIn_0.2s_ease-out]">
          <header className="mb-4">
            <h2 className="text-2xl font-semibold text-cyan-800">
              Change Email
            </h2>
          </header>

          {!currentPinVerified ? (
            <AuthInput
              label="Current PIN"
              value={currentPin}
              type="password"
              onChange={setCurrentPin}
              isPin
              placeholder="Enter current PIN"
              required
            />
          ) : !otpSent ? (
            <AuthInput
              label="Current Email"
              value={currentEmail}
              type="text"
              onChange={setCurrentEmail}
              placeholder="Enter your current email"
              required
            />
          ) : (
            <>
              <AuthInput
                label="OTP"
                value={otp}
                type="text"
                onChange={setOtp}
                placeholder="Enter OTP sent to your email"
                required
              />
              <AuthInput
                label="New Email"
                value={newEmail}
                type="text"
                onChange={setNewEmail}
                placeholder="Enter new email"
                required
              />
            </>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleNextStep}
              className="px-4 py-2 text-white bg-cyan-700 rounded-md hover:bg-cyan-800 transition cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="#f4f4f4" />
              ) : !currentPinVerified ? (
                "Verify PIN"
              ) : !otpSent ? (
                "Send OTP"
              ) : (
                "Change Email"
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

export default ChangeEmailModal;
