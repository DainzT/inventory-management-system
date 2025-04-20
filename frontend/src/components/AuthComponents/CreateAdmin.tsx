import React, { useState } from "react";
import Portal from "@/utils/Portal";
import { ClipLoader } from "react-spinners";
import { createAdmin } from "@/api/authAPI";
import CreateAdminInput from "./CreateAdminInput";

interface CreateAdminProps {
  onSuccess: () => void;
}

const CreateAdmin: React.FC<CreateAdminProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [backupPin, setBackupPin] = useState("");
  const [securityQuestions, setSecurityQuestions] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (pin !== confirmPin) {
      setError("PINs do not match.");
      setLoading(false);
      return;
    }

    try {
      await createAdmin({ pin, confirmPin, backupPin, securityQuestions });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create admin.");
    } finally {
      setLoading(false);
    }
  };

  const handlesecurityQuestionsChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updated = [...securityQuestions];
    updated[index][field] = value;
    setSecurityQuestions(updated);
  };

  return (
    <Portal>
      <div className="flex fixed inset-0 justify-center items-center select-none">
        <div className="relative px-6 py-4 w-[26rem] max-h-[90vh] overflow-auto bg-white z-50 rounded-2xl border-2 shadow-sm border-zinc-300 animate-[fadeIn_0.2s_ease-out]">
          <header className="mb-4">
            <h2 className="text-2xl font-semibold text-cyan-800">
              Create Admin
            </h2>
            <p className="text-sm text-gray-500">
              Set up your admin credentials and recovery info
            </p>
          </header>

          <div className="space-y-3">
            <CreateAdminInput
              label="PIN"
              type="password"
              value={pin}
              onChange={setPin}
              isPin
            />
            <CreateAdminInput
              label="Confirm PIN"
              type="password"
              value={confirmPin}
              onChange={setConfirmPin}
              isPin
            />
            <CreateAdminInput
              label="Backup PIN"
              type="password"
              value={backupPin}
              onChange={setBackupPin}
              isPin
            />

            {securityQuestions.map((qa, index) => (
              <div key={index} className="pt-2 border-t border-gray-200">
                <CreateAdminInput
                  label={`Security Question ${index + 1}`}
                  value={qa.question}
                  onChange={(val) =>
                    handlesecurityQuestionsChange(index, "question", val)
                  }
                />
                <CreateAdminInput
                  label="Answer"
                  value={qa.answer}
                  onChange={(val) =>
                    handlesecurityQuestionsChange(index, "answer", val)
                  }
                />
              </div>
            ))}

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-cyan-700 rounded-md hover:bg-cyan-800 transition"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Create Admin"}
            </button>
          </div>
        </div>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </div>
    </Portal>
  );
};

export default CreateAdmin;
