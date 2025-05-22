import { useState } from "react";
import { AlertCircle, EyeIcon, EyeOffIcon } from "lucide-react";

interface LoginInputProps {
  pin: string;
  setPin: (pin: string) => void;
  disabled?: boolean;
  error: string;
  setError: (error: string) => void;
  onEnterPress: () => void;
}

function LoginInput({
  pin,
  setPin,
  disabled,
  error,
  setError,
  onEnterPress,
}: LoginInputProps) {
  const [showPin, setShowPin] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const shouldFloat = isFocused || pin.length > 0;

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPin(value);
      setError("");
    } else {
      setPin(value.replace(/\D/g, ""));
      setError("Only numbers are allowed");
    }
  };

  return (
    <>
      <div
        className={`w-full relative max-w-md h-12 bg-white rounded-lg flex items-center px-4 border transition-all duration-200 
        ${
          isFocused
            ? "border-blue-500 shadow-md"
            : error
            ? "border-red-500"
            : "border-gray-300"
        }`}
      >
        <label
          htmlFor="pin-input"
          className={` absolute left-3 transition-all duration-200 pointer-events-none ${
            shouldFloat
              ? "-top-2.5 px-1 bg-white text-xs text-blue-500"
              : "top-1/2 -translate-y-1/2 text-gray-500 text-lg tracking-wider"
          } ${error ? "text-red-500" : ""}`}
        >
          PIN
        </label>

        <div className="flex-grow flex items-center h-full pl-2">
          <input
            id="pin-input"
            type={(showPin && !disabled) ? "text" : "password"}
            value={pin}
            onChange={handlePinChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={6}
            className="w-full text-lg font-mono font-medium tracking-[1.7em] text-gray-800 bg-transparent outline-none placeholder:tracking-[1.7em] placeholder:font-mono"
            placeholder={shouldFloat ? "••••••" : ""}
            inputMode="numeric"
            autoComplete="off"
            disabled={disabled}
            data-edge-suppress-password-reveal="true"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onEnterPress();
              }
            }}
          />
        </div>
        <div className="w-8 flex justify-end">
          <button
            onClick={() => setShowPin(!showPin)}
            aria-label={showPin ? "Hide PIN" : "Show PIN"}
            className={`text-gray-500transition-colors duration-200 p-1 rounded-full ${
              disabled
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-700 cursor-pointer"
            }
            `}
            disabled={disabled}
            type="button"
          >
            {(showPin && !disabled) ? (
              <EyeIcon className="w-5 h-5" />
            ) : (
              <EyeOffIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default LoginInput;
