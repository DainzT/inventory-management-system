import React from "react";
import { SimpleInputProps } from "@/types/select-field";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

interface AuthInputProps extends SimpleInputProps {
  isPin?: boolean;
  type?: "text" | "password";
  disabled?: boolean
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  value,
  type = "text",
  onChange,
  isPin = false,
  placeholder,
  required,
  disabled = false,
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
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative w-full">
        <input
          role="textbox"
          type={type === "password" && !showPin ? "password" : "text"}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className="w-full px-3 py-2 h-10 border border-white-light bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
          disabled={disabled}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            aria-label={showPin ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPin ? (
              <EyeOffIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;