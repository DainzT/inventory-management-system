import React, { useState } from "react";
import Portal from "@/utils/Portal";
import { ClipLoader } from "react-spinners";
import AuthInput from "./AuthInput";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

interface ChangePinModalProps {
  onClose: () => void;
}

const ChangePinModal: React.FC<ChangePinModalProps> = ({ onClose }) => {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [currentPinVerified, setCurrentPinVerified] = useState(false);
  const { loading, updatePin, verifyPin, logout } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const validateCurrentPin = () => {
    if (!/^\d{6}$/.test(currentPin)) {
      setErrors((prev) => ({ ...prev, pin: "PIN must be 6 digits" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, pin: "" }));
    return true;
  };

  const validateNewPin = () => {
    if (!/^\d{6}$/.test(newPin)) {
      setErrors((prev) => ({ ...prev, pin: "PIN must be 6 digits" }));
      return false;
    }
    if (newPin === currentPin) {
      setErrors((prev) => ({ ...prev, pin: "New PIN must be different" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, pin: "" }));
    return true;
  };

  const validateConfirmPin = () => {
    if (!confirmPin) {
      setErrors((prev) => ({ ...prev, confirmPin: "Please confirm your PIN" }));
      return false;
    }

    if (confirmPin !== newPin) {
      setErrors((prev) => ({ ...prev, confirmPin: "PINs don't match" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPin: "" }));
    return true;
  };

  const handleVerifyCurrentPin = async () => {
    if (!validateCurrentPin()) return;
    await verifyPin(currentPin);
    setCurrentPinVerified(true);
  };

  const handleUpdatePin = async () => {
    if (!validateNewPin() || !validateConfirmPin()) return;
    await updatePin(newPin);
    setSuccess(true);
    toast.success("PIN changed successfully. Please login again.", {
      autoClose: 1500,
      onClose: async () => {
        await logout();
        navigate("/login");
      },
    });
  };

  const handleNextStep = () => {
    if (!currentPinVerified) return handleVerifyCurrentPin();
    return handleUpdatePin();
  };

  const handleBack = () => {
    if (currentPinVerified) {
      setCurrentPinVerified(false);
    }
    setNewPin("");
    setConfirmPin("");
    setErrors({});
  };

  const getButtonText = () => {
    if (loading) {
      return currentPinVerified ? "Updating..." : "Verifying...";
    }
    return currentPinVerified ? "Update PIN" : "Verify PIN";
  };

  return (
    <Portal>
      <div className="flex fixed inset-0 justify-center items-center select-none z-50">
        <div className="relative w-[26rem] h-[28rem] bg-white rounded-2xl z-50 border border-gray-200 shadow-lg flex flex-col">
          <div className="px-6 py-5 flex-1 overflow-y-auto">
            <header className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Change Your PIN
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {!currentPinVerified
                  ? "Verify your current PIN to continue"
                  : "Create a new 6-digit PIN"}
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
            ) : (
              <>
                <AuthInput
                  label="New PIN"
                  value={newPin}
                  type="pin"
                  onChange={setNewPin}
                  placeholder="Enter new PIN"
                  required
                  disabled={loading || success}
                  errors={errors}
                  setErrors={setErrors}
                />
                <div className="mt-4">
                  <AuthInput
                    label="Confirm New PIN"
                    value={confirmPin}
                    type="confirmPin"
                    onChange={setConfirmPin}
                    placeholder="Re-enter new PIN"
                    required
                    disabled={loading || success}
                    errors={errors}
                    setErrors={setErrors}
                  />
                </div>
              </>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex justify-between gap-3">
              {currentPinVerified ? (
                <button
                  onClick={handleBack}
                  className={`px-4 py-2.5 text-gray-600 rounded-lg bg-gray-200 transition flex active:scale-[0.98] items-center gap-2 border border-gray-200
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
                  } px-4 active:scale-[0.98] py-2 text-gray-700  rounded-md transition`}
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

export default ChangePinModal;
