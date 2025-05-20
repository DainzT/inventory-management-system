import React, { useState } from "react";
import Portal from "@/utils/Portal";
import { ClipLoader } from "react-spinners";
import AuthInput from "./AuthInput";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { ArrowLeft, Check } from "lucide-react";

interface ChangeEmailModalProps {
  onClose: () => void;
}

const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({ onClose }) => {
  const [currentPin, setCurrentPin] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [currentPinVerified, setCurrentPinVerified] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    otpSent,
    setOtpSent,
    otpVerified,
    setOtpVerified,
    loading,
    verifyPin,
    handleVerifyEmail,
    handleVerifyOTP,
    changeEmail,
  } = useAuth();

  const validateCurrentPin = () => {
    if (!/^\d{6}$/.test(currentPin)) {
      setErrors((prev) => ({ ...prev, pin: "PIN must be 6 digits" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, pin: "" }));
    return true;
  };

  const validateCurrentEmail = () => {
    if (!currentEmail) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validateNewEmail = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return false;
    }
    if (newEmail === currentEmail) {
      setErrors((prev) => ({ ...prev, email: "New email must be different" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validateOTP = () => {
    if (!otp) {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      return false;
    }
    if (!/^\d{6}$/.test(otp)) {
      setErrors((prev) => ({ ...prev, otp: "OTP must be 6 digits" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, otp: "" }));
    return true;
  };

  const handleVerifyCurrentPin = async () => {
    if (!validateCurrentPin()) return;
    await verifyPin(currentPin);
    setCurrentPinVerified(true);
  };

  const handleSendOTP = async () => {
    if (!validateCurrentEmail()) return;
    await handleVerifyEmail(currentEmail);
  };

  const VerifyOTP = async () => {
    if (!validateOTP()) return;
    await handleVerifyOTP(otp);
  };

  const handleUpdateEmail = async () => {
    if (!validateNewEmail()) return;
    await changeEmail(currentEmail, newEmail);
    setSuccess(true);
    toast.success("Closing modal...", {
      autoClose: 1500,
      onClose,
    });
  };

  const handleNextStep = () => {
    if (!currentPinVerified) return handleVerifyCurrentPin();
    if (!otpSent) return handleSendOTP();
    if (!otpVerified) return VerifyOTP();
    return handleUpdateEmail();
  };

  const handleBack = () => {
    if (otpVerified) {
      setOtpVerified(false);
    } else if (otpSent) {
      setOtpSent(false);
    } else if (currentPinVerified) {
      setCurrentPinVerified(false);
    }
    setCurrentEmail("");
    setOtp("");
    setNewEmail("");
    setErrors({});
  };

  const getButtonText = () => {
    if (loading) {
      if (!currentPinVerified) return "Verifying...";
      if (!otpSent) return "Sending...";
      if (!otpVerified) return "Verifying...";
      return "Updating...";
    }
    if (!currentPinVerified) return "Verify PIN";
    if (!otpSent) return "Send OTP";
    if (!otpVerified) return "Verify OTP";
    return "Change Email";
  };

  const getStepDescription = () => {
    if (!currentPinVerified) return "Verify your current PIN to continue";
    if (!otpSent)
      return "Enter your current email to receive a verification code";
    if (!otpVerified) return "Enter the OTP sent to your email";
    return "Enter your new email address";
  };

  return (
    <Portal>
      <div className="flex fixed inset-0 justify-center items-center select-none z-50">
        <div className="relative w-[26rem] h-[28rem] bg-white rounded-2xl z-50 border border-gray-200 shadow-lg flex flex-col">
          <div className="px-6 py-5 flex-1 overflow-y-auto">
            <header className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Change Email Address
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {getStepDescription()}
              </p>
            </header>

            {!currentPinVerified ? (
              <AuthInput
                label="Current PIN"
                value={currentPin}
                type="pin"
                onChange={setCurrentPin}
                placeholder="Enter current PIN"
                required
                disabled={loading}
                errors={errors}
                setErrors={setErrors}
              />
            ) : !otpSent ? (
              <AuthInput
                label="Current Email"
                value={currentEmail}
                type="email"
                onChange={setCurrentEmail}
                placeholder="Enter your current email"
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
                placeholder="Enter OTP sent to your email"
                required
                disabled={loading}
                errors={errors}
                setErrors={setErrors}
              />
            ) : (
              <AuthInput
                label="New Email"
                value={newEmail}
                type="email"
                onChange={setNewEmail}
                placeholder="Enter new email"
                required
                disabled={loading || success}
                errors={errors}
                setErrors={setErrors}
              />
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex justify-between gap-3">
              {currentPinVerified ? (
                <button
                  onClick={handleBack}
                  className={`px-4 py-2.5 text-gray-600 rounded-lg bg-gray-200 transition  active:scale-[0.98] flex items-center gap-2 border border-gray-200
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
                  } px-4 active:scale-[0.98] py-2 text-gray-700  rounded-md transition cursor-pointer`}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleNextStep}
                className={`px-6 py-2.5 text-white rounded-lg transition-all flex-1 max-w-[11rem] flex items-center justify-center gap-2
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

export default ChangeEmailModal;
