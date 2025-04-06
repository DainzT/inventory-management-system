import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { SimpleInputProps } from "@/types/select-field";

const ChangePinInput: React.FC<SimpleInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  const [showPin, setShowPin] = useState(false);

  return (
    <div className="mb-2">
      <label
        htmlFor="pin-input"
        className="text-base font-bold leading-6 text-black"
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="px-4 w-full h-10 rounded-lg border border-white-light bg-background flex items-center mt-2">
        <input
          id="pin-input"
          type={showPin ? "text" : "password"}
          maxLength={6}
          pattern="\d{6}"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="text-base bg-transparent w-full mt-1 text-black outline-none"
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPin(!showPin)}
          aria-label={showPin ? "Show PIN" : "Hide PIN"}
          className="ml-3 text-black"
        >
          {showPin ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      </div>
    </div>
  );
};

export default ChangePinInput;
