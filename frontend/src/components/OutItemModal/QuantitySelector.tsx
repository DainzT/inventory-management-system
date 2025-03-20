import React from "react";
import { BsFileMinus, BsFilePlus } from "react-icons/bs";
import { QuantitySelectorProps } from "@/types/quantity-selector";

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  setQuantity,
  maxQuantity,
  unit,
}) => {
  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

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
          disabled={quantity <= 0}
        >
          <BsFileMinus />
        </button>
        <div
          id="quantity"
          className="flex justify-center items-center w-16 h-8 rounded-lg border border-red-100 border-solid bg-zinc-100 text-black inter-font"
          aria-live="polite"
        >
          {quantity} {unit.charAt(0)}
        </div>
        <button
          className="flex justify-center items-center w-8 h-8 rounded-lg border border-red-100 border-solid bg-zinc-100"
          onClick={incrementQuantity}
          aria-label="Increase quantity"
          disabled={quantity >= maxQuantity}
        >
          <BsFilePlus />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
