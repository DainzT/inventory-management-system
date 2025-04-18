import React, { useState } from "react";
import Portal from "@/utils/Portal";
import { ClipLoader } from "react-spinners";
import ChangePinInput from "@/components/AuthComponents/ChangePinInput";
import { changePin } from "@/api/authAPI";

interface ChangePinModalProps {
  onClose: () => void;
}

const ChangePinModal: React.FC<ChangePinModalProps> = ({ onClose }) => {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await changePin(currentPin, newPin);
      if (response.message === "Pin updated successfully") {
        onClose();
      } else {
        setError(response.message || "Something went wrong.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to change PIN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <div className="flex fixed inset-0 justify-center items-center  select-none">
        <div className="relative px-6 py-4 w-[24rem] bg-white z-50 rounded-2xl border-2 shadow-sm border-zinc-300 animate-[fadeIn_0.2s_ease-out]">
          <header className="mb-4">
            <h2 className="text-2xl font-semibold text-cyan-800">Change PIN</h2>
          </header>

          <ChangePinInput
            label="Current PIN"
            placeholder="Enter current PIN"
            value={currentPin}
            onChange={(e) => setCurrentPin(e.target.value)}
            required
          />

          <ChangePinInput
            label="New PIN"
            placeholder="Enter new PIN"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-cyan-700 rounded-md hover:bg-cyan-800 transition"
            >
              {loading ? <ClipLoader size={20} color="#f4f4f4" /> : "Submit"}
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

export default ChangePinModal;
