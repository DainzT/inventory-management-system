import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number | "";
  onChange: (quantity: number | "") => void;
  maxQuantity: number;
  unitSize: number;
  error: string;
  disabled?: boolean;
  required?: boolean;
}

const QuantitySelector = ({
  value,
  onChange,
  maxQuantity,
  unitSize,
  error,
  disabled,
  required = true,
}: QuantitySelectorProps) => {
  const decrementQuantity = () => {
    if (Number(value) > 0) {
      onChange((value || 0) - unitSize);
    }
  };

  const incrementQuantity = () => {
    if (Number(value) < maxQuantity) {
      onChange((value || 0) + unitSize);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (newValue === "") {
      onChange("");
    } else {
      const parsed = parseFloat(newValue);
      if (!isNaN(parsed) && parsed >= 0) {
        onChange(parsed);
      }
    }
  };

  function roundTo(num: number, precision: number): number {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
  }

  return (
    <div>
      <div className="flex items-center mb-2">
        <label htmlFor="quantity" className="text-base font-bold text-black inter-font">
          Quantity
        </label>
        {required && <span className="text-[#FF5757]">*</span>}
      </div>
      <div className="flex gap-2 items-center">
        <button
          className={`
            flex justify-center items-center w-8 h-8 rounded-lg border  border-solid bg-zinc-100  cursor-pointer
            ${error ? "border-red-500" : "border-[#0FE3FF]"}
          `}
          onClick={decrementQuantity}
          aria-label="Decrease quantity"
          disabled={Number(value) <= 0 || disabled}
        >
          <Minus size={20} />
        </button>
        <input
          type="number"
          value={value !== "" ? roundTo(value, 2) : ""}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          placeholder="0.00"
          className={`
            px-2 flex justify-center items-center w-16 h-8 rounded-lg border border-solid bg-zinc-100 text-black inter-font 
            ${error ? "border-red-500" : "border-[#0FE3FF]"}
          `}
          aria-live="polite"
          disabled={disabled}
        />
        
        <button
          className={`
            flex justify-center items-center w-8 h-8 rounded-lg border border-solid bg-zinc-100 cursor-pointer
            ${error ? "border-red-500" : "border-[#0FE3FF]"}
          `}
          onClick={incrementQuantity}
          aria-label="Increase quantity"
          disabled={Number(value) >= maxQuantity || disabled}
        >
          <Plus size={20} />
        </button>
      </div>
      {error && <p className="absolute text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default QuantitySelector;
