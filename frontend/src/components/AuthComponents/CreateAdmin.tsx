import React, { useState } from "react";
import Portal from "@/utils/Portal";
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

  const handleCreateAdmin = async () => {
    try {
      setLoading(true);
      const success = await createAdmin({ email, pin, confirmPin });
      if (success) {
        await sendOtpEmail(email);
        setOtpSent(true);
        setLoading(false);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      await verifyOtp(otp);
      setOtpVerified(true);
      setLoading(false);
      onSuccess();
    } catch {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (!otpSent) return handleCreateAdmin();
    if (!otpVerified) return handleVerifyOTP();
  };

  const handleBack = () => {
    if (otpVerified) {
      setOtpVerified(false);
    } else if (otpSent) {
      setOtpSent(false);
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
              <AuthInput
                label="Enter Email"
                placeholder="Enter your email"
                value={email}
                onChange={setEmail}
                type="text"
              />
            </>
          ) : (
            <AuthInput
              label="OTP"
              placeholder="Enter OTP sent to your email"
              value={otp}
              onChange={setOtp}
              type="text"
            />
          )}

          <div className="flex justify-end gap-2 mt-6">
            {otpSent && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNextStep}
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
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />
      </div>
    </Portal>
  );
};

export default CreateAdminModal;
