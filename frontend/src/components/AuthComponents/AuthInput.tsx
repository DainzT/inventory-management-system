import React from "react";
import { SimpleInputProps } from "@/types/select-field";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

interface AuthInputProps extends SimpleInputProps {
  isPin?: boolean;
  type?: "text" | "password";
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  value,
  type = "text",
  onChange,
  isPin = false,
  placeholder,
  required,
}) => {
  const [showPin, setShowPin] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    if (isPin) {
      input = input.replace(/\D/g, "").slice(0, 6);
    }

    onChange(input);
  };
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex">
        <input
          type={type === "password" && !showPin ? "password" : "text"}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className="flex-grow mb-2 px-3 py-2 w-full h-10 border border-white-light bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            aria-label={showPin ? "Show PIN" : "Hide PIN"}
            className="ml-3 text-black"
          >
            {showPin ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
