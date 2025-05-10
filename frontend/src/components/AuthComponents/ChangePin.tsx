import React, { useState } from "react";
import Portal from "@/utils/Portal";
import { ClipLoader } from "react-spinners";
import AuthInput from "./AuthInput";
import { useAuth } from "@/hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface ChangePinModalProps {
  onClose: () => void;
}

const ChangePinModal: React.FC<ChangePinModalProps> = ({ onClose }) => {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [currentPinVerified, setCurrentPinVerified] = useState(false);
  const { loading, updatePin, verifyPin, logout } = useAuth();
  const navigate = useNavigate();

  const handleVerifyCurrentPin = async () => {
      await verifyPin(currentPin);
      setCurrentPinVerified(true);
  };

  const handleUpdatePin = async () => {
    await updatePin(newPin);
    toast.success("PIN changed successfully. Please login again.", {
      autoClose: 1500,
      onClose: async () => {
        await logout();
        navigate("/login");
      }
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
  };

  return (
    <Portal>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      />
      <div className="flex fixed inset-0 justify-center items-center select-none z-50">
        <div className="relative px-6 py-4 w-[24rem] bg-white z-50 rounded-2xl border-2 shadow-sm border-zinc-300 animate-[fadeIn_0.2s_ease-out]">
          <header className="mb-4">
            <h2 className="text-2xl font-semibold text-cyan-800">Change PIN</h2>
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
              disabled={loading}
            />
          ) : (
            <>
              <AuthInput
                label="New PIN"
                value={newPin}
                type="password"
                onChange={setNewPin}
                isPin
                placeholder="Enter new PIN"
                required
                disabled={loading}
              />
            </>
          )}

          <div className="flex justify-end gap-2 mt-6">
            {currentPinVerified ? (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition cursor-pointer"
                disabled={loading}
              >
                Back
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleNextStep}
              className="px-4 py-2 text-white bg-cyan-700 rounded-md hover:bg-cyan-800 transition cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="#f4f4f4" />
              ) : !currentPinVerified ? (
                "Verify PIN"
              ) : (
                "Update PIN"
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

export default ChangePinModal;
