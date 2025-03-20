import React from "react";
import { SummarySectionProps } from "@/types/summary-display";

const SummarySection: React.FC<SummarySectionProps> = ({
  totalPrice,
  remainingStock,
  unit,
}) => {
  return (
    <section className="p-4 mb-6 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold text-black">Total</h3>
        <p className="text-base font-semibold text-cyan-800">
          ₱{totalPrice.toFixed(2)}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Remaining Stock</p>
        <p className="text-sm text-gray-500">
          {remainingStock} {unit}
        </p>
      </div>
    </section>
  );
};

export default SummarySection;
