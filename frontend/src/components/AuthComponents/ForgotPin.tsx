import React, { useState } from "react";
import Portal from "@/utils/Portal";
import { ClipLoader } from "react-spinners";
import AuthInput from "@/components/AuthComponents/AuthInput";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { ArrowLeft, Check } from "lucide-react";

interface ForgotPinProps {
  onClose: () => void;
}

const ForgotPin: React.FC<ForgotPinProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    loading,
    otpSent,
    setOtpSent,
    otpVerified,
    handleVerifyEmail,
    handleVerifyOTP,
    ResetPin,
  } = useAuth();
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validateOTP = () => {
    if (!/^\d{6}$/.test(otp)) {
      setErrors((prev) => ({ ...prev, otp: "OTP must be 6 digits" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, otp: "" }));
    return true;
  };

  const validateNewPin = () => {
    if (!/^\d{6}$/.test(newPin)) {
      setErrors((prev) => ({ ...prev, newPin: "PIN must be 6 digits" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, newPin: "" }));
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateEmail()) return;
    await handleVerifyEmail(email);
  };

  const handleOTPVerification = async () => {
    if (!validateOTP()) return;
    await handleVerifyOTP(otp);
  };

  const handleResetPin = async () => {
    if (!validateNewPin()) return;
    await ResetPin(email, newPin);
    setSuccess(true);
    toast.success("Closing modal...", {
      autoClose: 1500,
      onClose,
    });
  };

  const handleBack = () => {
    setOtpSent(false);
    setOtp("");
    setErrors({});
  };

  const getButtonText = () => {
    if (loading) {
      if (!otpSent) return "Sending OTP...";
      if (!otpVerified) return "Verifying...";
      return "Resetting...";
    }
    if (!otpSent) return "Send OTP";
    if (!otpVerified) return "Verify OTP";
    return "Reset PIN";
  };

  return (
    <Portal>
      <div className="flex fixed inset-0 justify-center items-center select-none">
        <div className="relative w-[26rem] h-72 bg-white rounded-2xl z-50 border border-gray-200 shadow-lg flex flex-col">
          <div className="px-6 py-5 flex-1 overflow-y-auto">
            <header className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Forgot your PIN?
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {!otpSent
                  ? "Enter your email to receive a verification code"
                  : !otpVerified
                  ? "Enter the OTP sent to your email"
                  : "Create a new 6-digit PIN"}
              </p>
            </header>
            {!otpSent ? (
              <AuthInput
                label="Email"
                value={email}
                type="email"
                onChange={setEmail}
                placeholder="Enter your email"
                required
                disabled={loading}
                errors={errors}
                setErrors={setErrors}
              />
            ) : !otpVerified ? (
              <AuthInput
                label="OTP"
                value={otp}
                type="otp"
                onChange={setOtp}
                placeholder="Enter 6-digit code"
                required
                disabled={loading}
                errors={errors}
                setErrors={setErrors}
              />
            ) : (
              <AuthInput
                label="New PIN"
                value={newPin}
                type="pin"
                onChange={setNewPin}
                placeholder="Enter new 6-digit PIN"
                required
                disabled={loading || success}
                errors={errors}
                setErrors={setErrors}
              />
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex justify-between gap-3">
              {otpSent ? (
                <button
                  onClick={handleBack}
                  className={`px-4 py-2.5 text-gray-600 rounded-lg bg-gray-200 transition flex items-center gap-2 active:scale-[0.98] border border-gray-200
                    ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-300 cursor-pointer"
                    }`}
                  disabled={loading || success}
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className={` ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  } px-4 py-2 text-gray-700 active:scale-[0.98] rounded-md transition `}
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
                className={`px-6 py-2.5 text-white rounded-lg transition-all flex-1 max-w-[11.58rem] flex items-center justify-center gap-2
                  ${
                    loading
                      ? "bg-accent/60 cursor-wait"
                      : "bg-accent hover:bg-[#297885] shadow-md hover:shadow-lg cursor-pointer"
                  }
                  active:scale-[0.98]`}
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <ClipLoader size={20} color="#fff" className="mr-2" />
                    {getButtonText()}
                  </>
                ) : success ? (
                  <>
                    <Check size={18} className="mr-1" />
                    {getButtonText()}
                  </>
                ) : (
                  getButtonText()
                )}
              </button>
            </div>
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
