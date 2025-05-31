import React, { useState } from "react";
import Portal from "@/utils/Portal";
import { ClipLoader } from "react-spinners";
import AuthInput from "./AuthInput";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Check } from "lucide-react";

interface CreateAdminModalProps {
  onSuccess: () => void;
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<"credentials" | "verification">("credentials");

  const {
    loading,
    otpVerified,
    setOtpVerified,
    otpSent,
    setOtpSent,
    handleSendOTP,
    handleVerifyOTP,
    handleCreateAdmin,
  } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!otpSent) {
      if (pin.length < 6) newErrors.pin = "PIN must be 6 digits";
      if (pin !== confirmPin) newErrors.confirmPin = "PINs do not match";
      if (!email.includes("@")) newErrors.email = "Invalid email format";
    } else if (!otpVerified && otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (!validateForm()) return;

    if (!otpSent) {
      await handleSendOTP(email, pin, confirmPin);
      setCurrentStep("verification");
    } else if (!otpVerified) {
      await handleVerifyOTP(otp);
      await handleCreateAdmin({ email, pin, confirmPin });
      setTimeout(() => { 
        onSuccess();
      }, 1000);
    }
  };

  const handleBack = () => {
    if (otpVerified) {
      setOtpVerified(false);
    } else if (otpSent) {
      setOtpSent(false);
    }
    setCurrentStep("credentials");
    setOtp("")
    setErrors({});
  };

  const getButtonText = () => {
    if (loading) {
      if (!otpSent) return "Sending OTP...";
      if (!otpVerified) return "Verifying...";
      return "Creating...";
    }
    if (!otpSent) return "Send OTP";
    if (!otpVerified) return "Verify OTP";
    return "Admin Created";
  };

  return (
    <Portal>
      <div className="fixed inset-0 flex justify-center items-center select-none">
        <div className="relative w-[24rem] h-[35em] px-6 py-6 bg-white border-2 z-50 border-zinc-300 rounded-2xl shadow-md animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${currentStep === "credentials" ? "bg-accent text-white shadow-md" : "bg-gray-50 text-gray-400 border border-gray-200"}`}>
                {currentStep === "verification" ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <span className="font-medium">1</span>
                )}
              </div>
              <span className={`text-xs mt-2 font-medium ${currentStep === "credentials" ? "text-accent" : "text-gray-500"}`}>
                Credentials
              </span>
            </div>

            <div className={`h-1 w-12 transition-all ${currentStep === "verification" ? "bg-accent" : "bg-gray-200"}`} />

            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${currentStep === "verification" ? "bg-accent text-white shadow-md" : "bg-gray-50 text-gray-400 border border-gray-200"}`}>
                <span className="font-medium">2</span>
              </div>
              <span className={`text-xs mt-2 font-medium ${currentStep === "verification" ? "text-accent" : "text-gray-500"}`}>
                Verification
              </span>
            </div>
          </div>

          <header className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentStep === "credentials" ? "Create Admin Account" : "Verify Your Identity"}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {currentStep === "credentials"
                ? "Set up your admin credentials"
                : "Enter the 6-digit code sent to your email"}
            </p>
          </header>
          <div className="h-[16rem]">
            {!otpSent ? (
              <>
                <AuthInput
                  label="Enter Email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={setEmail}
                  type="email"
                  required
                  disabled={loading}
                  errors={errors}
                  setErrors={setErrors}
                />
                <AuthInput
                  label="PIN"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={setPin}
                  type="pin"
                  required
                  disabled={loading}
                  errors={errors}
                  setErrors={setErrors}
                />
                <AuthInput
                  label="Confirm PIN"
                  placeholder="Re-enter PIN"
                  value={confirmPin}
                  onChange={setConfirmPin}
                  type="confirmPin"
                  required
                  disabled={loading}
                  errors={errors}
                  setErrors={setErrors}
                />
              </>
            ) : (
              <AuthInput
                label="OTP"
                placeholder="Enter OTP sent to your email"
                value={otp}
                onChange={setOtp}
                type="otp"
                required
                disabled={otpVerified || loading}
                errors={errors}
                setErrors={setErrors}
              />
            )}
          </div>
          <div className="pt-10 border-t border-gray-100 mt-auto">
            <div className={`${otpSent ? "flex justify-between gap-3" : " flex justify-end gap-3"}`}>
              {(otpSent || otpVerified) && (
                <button
                  onClick={handleBack}
                  className={`px-4 py-2.5 text-gray-600 bg-gray-100 rounded-lg transition flex items-center gap-2 active:scale-98
                  ${(loading || otpVerified) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 cursor-pointer'}`}
                  disabled={loading || otpVerified}
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              )}
              <button
                onClick={handleNextStep}
                className={`px-6 py-2.5 text-white rounded-lg transition-all w-45 flex items-center justify-center active:scale-98
                ${otpVerified ? 'bg-green-500 hover:bg-green-600' : ''}
                ${loading ? 'bg-accent/60 cursor-wait' : 'shadow-md hover:shadow-lg bg-accent hover:bg-[#297885] cursor-pointer'}
                ${otpVerified ? 'cursor-default' : ''}`}
                disabled={loading || otpVerified}
              >
                {loading ? (
                  <>
                    <ClipLoader size={20} color="#fff" className="mr-2" />
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

export default CreateAdminModal;
