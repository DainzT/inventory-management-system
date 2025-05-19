import React, { useEffect, useState } from "react";
import { SimpleInputProps } from "@/types/select-field";
import { AlertCircle, EyeIcon, EyeOffIcon } from "lucide-react";

interface AuthInputProps extends SimpleInputProps {
  type?: "email" | "otp" | "pin" | "confirmPin";
  disabled?: boolean;
  errors?: Record<string, string>;
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  value,
  type,
  onChange,
  placeholder,
  required,
  disabled = false,
  errors,
  setErrors,
}) => {
  const [showPin, setShowPin] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [internalError, setInternalError] = useState("");
  const shouldFloat =
    (isFocused || value.length > 0) &&
    (type === "pin" || type === "confirmPin" || type === "otp");

  useEffect(() => {
    if (disabled) {
      setShowPin(false);
    }
  }, [disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (!type) return;

    if (type === "pin" || type === "confirmPin" || type === "otp") {
      if (/^\d*$/.test(input)) {
        setInternalError("");
        setErrors?.((prev) => ({ ...prev, [type]: "" }));
        onChange(input);
      } else {
        onChange(value.replace(/\D/g, ""));
        setInternalError("Only numbers are allowed");
      }
    } else {
      setErrors?.((prev) => ({ ...prev, [type]: "" }));
      setInternalError("");
      onChange(input);
    }
  };

  const finalError = internalError || (errors && errors[type || ""]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`w-full relative max-w-md h-12 bg-white rounded-lg flex items-center px-4 border transition-all duration-200
        ${
          finalError
            ? "border-red-500"
            : isFocused
            ? "border-accent-light shadow-md"
            : "border-gray-300"
        }`}
      >
        <label
          htmlFor="pin-input"
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            shouldFloat
              ? "-top-2.5 px-1 bg-white text-xs text-accent-light"
              : "top-1/2 -translate-y-1/2 text-gray-400 text-lg tracking-wider font-mono font-medium"
          } ${finalError ? "text-red-500" : ""}`}
        >
          {type === "pin" || type === "confirmPin" || type === "otp"
            ? placeholder
            : ""}
        </label>
        {type === "otp" ? (
          <div className="flex items-center justify-between w-full">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={`w-8 h-10 flex items-center justify-center border-b-2 ${
                  index === value.length && isFocused
                    ? "border-accent-light"
                    : value[index]
                    ? "border-gray-400"
                    : "border-gray-200"
                }`}
              >
                <span className="text-lg font-medium">
                  {value[index] ||
                    (index === value.length && isFocused ? "|" : "")}
                </span>
              </div>
            ))}
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={6}
              className={`absolute inset-0 w-full h-full opacity-0 ${
                disabled ? "cursor-not-allowed" : ""
              }`}
              disabled={disabled}
            />
          </div>
        ) : (
          <input
            role="textbox"
            type={
              (type === "pin" || type === "confirmPin") && !showPin
                ? "password"
                : type === "email"
                ? "text"
                : "text"
            }
            value={value}
            placeholder={
              (type === "pin" || type === "confirmPin") && shouldFloat
                ? "••••••"
                : type === "pin" || type === "confirmPin"
                ? ""
                : placeholder
            }
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={type === "pin" || type === "confirmPin" ? 6 : undefined}
            className={`
            w-full text-lg font-mono font-medium ${
              type === "pin" || type === "confirmPin"
                ? "tracking-[1.7em] placeholder:tracking-[1.7em] placeholder:font-mono"
                : ""
            } text-gray-800 bg-transparent ${
              disabled ? "cursor-not-allowed" : ""
            }
            outline-none
          `}
            disabled={disabled}
          />
        )}
        {(type === "pin" || type === "confirmPin") && (
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            aria-label={showPin ? "Hide password" : "Show password"}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500  ${
              disabled
                ? "text-gray-300 cursor-not-allowed"
                : "hover:text-gray-700 cursor-pointer"
            }`}
            disabled={disabled}
          >
            {showPin ? (
              <EyeIcon className="w-5 h-5" />
            ) : (
              <EyeOffIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      <div
        className={`transition-all duration-200 ease-in-out ${
          finalError ? "max-h-10 opacity-100 mt-1" : "max-h-0 opacity-0"
        }`}
      >
        {finalError && (
          <p className="text-xs text-red-500 flex items-center -mt-1">
            <AlertCircle className="w-3 h-3 mr-1" />
            {finalError}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
