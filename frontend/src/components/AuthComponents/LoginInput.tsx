import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface LoginInputProps {
  pin: string;
  setPin: (pin: string) => void;
}

function LoginInput({ pin, setPin }: LoginInputProps) {
  const [showPin, setShowPin] = useState(false);

  return (
    <div className="w-96 h-12 bg-background rounded-xl flex items-center px-[19px] mb-1">
      <label htmlFor="pin-input" className="text-2xl font-bold text-black">
        PIN
      </label>
      <input
        id="pin-input"
        type={showPin ? "text" : "password"}
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        maxLength={6}
        className="flex-grow ml-4 text-xl font-semibold inter-font tracking-[0.5em] text-black bg-transparent outline-none"
      />
      <button
        onClick={() => setShowPin(!showPin)}
        aria-label={showPin ? "Show PIN" : "Hide PIN"}
        className="ml-3 text-black cursor-pointer"
      >
        {showPin ? <EyeIcon /> : <EyeOffIcon />}
      </button>
    </div>
  );
}

export default LoginInput;
