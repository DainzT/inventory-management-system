import React, { useState } from "react";
import Portal from "@/utils/Portal";
import { sendOtpEmailAPI, verifyOtpAPI, createAdminAPI } from "@/api/authAPI";
import { ClipLoader } from "react-spinners";
import AuthInput from "@/components/AuthComponents/AuthInput";
import { useAuth } from "@/hooks/useAuth";

interface CreateAdminModalProps {
  onSuccess: () => void;
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sendOtpEmail, verifyOtp, createAdmin } = useAuth();

  const handleSendOTP = async () => {
    try {
      setLoading(true);
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
      await verifyOtp(email, otp);
      setOtpVerified(true);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    try {
      setLoading(true);
      await createAdmin({ email, pin, confirmPin });
      setLoading(false);
      onSuccess();
    } catch {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 flex justify-center items-center select-none">
        <div className="relative w-[24rem] px-6 py-6 bg-white border-2 z-50 border-zinc-300 rounded-2xl shadow-md animate-[fadeIn_0.2s_ease-out]">
          <header className="mb-4">
            <h2 className="text-2xl font-semibold text-cyan-800">
              Create Admin
            </h2>
          </header>

          {!otpSent ? (
            <AuthInput
              label="Email"
              placeholder="Enter admin email first"
              value={email}
              onChange={setEmail}
              type="text"
            />
          ) : !otpVerified ? (
            <AuthInput
              label="OTP"
              placeholder="Enter OTP sent to your email"
              value={otp}
              onChange={setOtp}
              type="text"
            />
          ) : (
            <>
              <AuthInput
                label="PIN"
                placeholder="Enter PIN"
                value={pin}
                onChange={setPin}
                type="password"
                isPin
              />
              <AuthInput
                label="Confirm PIN"
                placeholder="Re-enter PIN"
                value={confirmPin}
                onChange={setConfirmPin}
                type="password"
                isPin
              />
            </>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={
                !otpSent
                  ? handleSendOTP
                  : !otpVerified
                  ? handleVerifyOTP
                  : handleCreateAdmin
              }
              className="px-4 py-2 text-white bg-cyan-700 rounded-md hover:bg-cyan-800 transition"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="#f4f4f4" />
              ) : otpVerified ? (
                "Create"
              ) : otpSent ? (
                "Verify OTP"
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default CreateAdminModal;
