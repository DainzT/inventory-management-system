import React, { useState } from "react";
import Portal from "@/utils/Portal";
import { sendOtpEmail, verifyOtp, createAdmin } from "@/api/authAPI";
import { ClipLoader } from "react-spinners";
import CreateAdminInput from "@/components/AuthComponents/CreateAdminInput";

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
  const [error, setError] = useState("");

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
      setOtpVerified(true);
    } catch {
      setError("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (pin !== confirmPin) {
      setError("PIN and Confirm PIN do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await createAdmin({ email, pin, confirmPin });
      onSuccess();
    } catch {
      setError("Failed to create admin. Please try again.");
    } finally {
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
            <CreateAdminInput
              label="Email"
              placeholder="Enter admin email first"
              value={email}
              onChange={setEmail}
              type="text"
            />
          ) : !otpVerified ? (
            <CreateAdminInput
              label="OTP"
              placeholder="Enter OTP sent to your email"
              value={otp}
              onChange={setOtp}
              type="text"
            />
          ) : (
            <>
              <CreateAdminInput
                label="PIN"
                placeholder="Enter PIN"
                value={pin}
                onChange={setPin}
                type="password"
                isPin
              />
              <CreateAdminInput
                label="Confirm PIN"
                placeholder="Re-enter PIN"
                value={confirmPin}
                onChange={setConfirmPin}
                type="password"
                isPin
              />
            </>
          )}

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

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
