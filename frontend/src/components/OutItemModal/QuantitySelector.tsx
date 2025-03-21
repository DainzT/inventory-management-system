import React from "react";
import { BsFileMinus, BsFilePlus } from "react-icons/bs";

interface QuantitySelectorProps {
  value: number | "";
  onChange: (quantity: number | "") => void;
  maxQuantity: number;
  unitSize: number;
}


const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  maxQuantity,
  unitSize
}) => {
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
        <span className="ml-1 text-rose-500 inter-font">*</span>
      </div>
      <div className="flex gap-2 items-center">
        <button
          className="flex justify-center items-center w-8 h-8 rounded-lg border border-red-100 border-solid bg-zinc-100"
          onClick={decrementQuantity}
          aria-label="Decrease quantity"
          disabled={Number(value) <= 0}
        >
          <BsFileMinus />
        </button>
        <input
          type="number"
          value={value !== "" ? roundTo(value, 2) : ""}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          placeholder="0.00"
          className="px-2 flex justify-center items-center w-16 h-8 rounded-lg border border-red-100 border-solid bg-zinc-100 text-black inter-font"
          aria-live="polite"
        />
        
        <button
          className="flex justify-center items-center w-8 h-8 rounded-lg border border-red-100 border-solid bg-zinc-100"
          onClick={incrementQuantity}
          aria-label="Increase quantity"
          disabled={Number(value) >= maxQuantity}
        >
          <BsFilePlus />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
