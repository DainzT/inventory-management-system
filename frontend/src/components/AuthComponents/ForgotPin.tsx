import React, { useEffect, useState } from "react";
import {
  resetPinWithBackup,
  getSecurityQuestions,
  SecurityQuestion,
} from "@/api/authAPI";
import ForgotPinInput from "./ForgotPinInput";
import NewPinInput from "./NewPinInput";
import { motion } from "framer-motion";

interface ForgotPinProps {
  onClose: () => void;
}

const ForgotPin: React.FC<ForgotPinProps> = ({ onClose }) => {
  const [backupPin, setBackupPin] = useState("");
  const [securityAnswers, setSecurityAnswers] = useState<string[]>([]);
  const [securityQuestions, setSecurityQuestions] = useState<
    SecurityQuestion[]
  >([]);
  const [newPin, setNewPin] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getSecurityQuestions();
        setSecurityQuestions(response.questions);
        setSecurityAnswers(new Array(response.questions.length).fill(""));
      } catch (error) {
        console.error("Failed to fetch security questions", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleVerifyBackup = () => {
    if (!backupPin.trim() || securityAnswers.some((ans) => !ans.trim())) {
      setError("Please fill out all backup PIN and security answers.");
      return;
    }

    setError("");
    setStep(2);
  };

  const handleSubmitNewPin = async () => {
    setLoading(true);
    setError("");

    try {
      const formattedAnswers = securityQuestions.map((q, index) => ({
        question: q.question,
        answer: securityAnswers[index],
      }));

      const response = await resetPinWithBackup(
        backupPin,
        formattedAnswers,
        newPin
      );
      if (response.message === "PIN reset successfully") {
        onClose();
      } else {
        setError(response.message || "Failed to reset PIN.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to reset PIN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative bg-white p-6 w-[24rem] rounded-2xl z-50 border-2 border-zinc-300 shadow-sm animate-[fadeIn_0.2s_ease-out]">
        {step === 1 && (
          <motion.div
            className="w-full"
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
          >
            <ForgotPinInput
              label="Enter Backup PIN"
              placeholder="Enter backup PIN"
              value={backupPin}
              onChange={(e) => setBackupPin(e.target.value)}
              required
            />

            {securityQuestions.map((q, index) => (
              <div className="mb-2" key={index}>
                <label className="text-base font-bold leading-6 text-black">
                  {q.question}
                </label>
                <input
                  type="text"
                  value={securityAnswers[index]}
                  onChange={(e) => {
                    const newAnswers = [...securityAnswers];
                    newAnswers[index] = e.target.value;
                    setSecurityAnswers(newAnswers);
                  }}
                  placeholder={`Answer to question ${index + 1}`}
                  className="mt-2 p-2 border border-gray-300 rounded w-full"
                />
              </div>
            ))}

            <button
              onClick={handleVerifyBackup}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            className="w-full"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <NewPinInput
              label="New PIN"
              placeholder="Enter your new PIN"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              required
            />
            <button
              onClick={handleSubmitNewPin}
              className="mt-4 w-full bg-cyan-700 text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset PIN"}
            </button>
          </motion.div>
        )}

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        <div
          className="absolute top-4 right-4 cursor-pointer"
          onClick={onClose}
          aria-hidden="true"
        >
          ×
        </div>
      </div>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  );
};

export default ForgotPin;
