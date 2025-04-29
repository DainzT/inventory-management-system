interface SummarySectionProps {
  totalPrice: number;
  remainingStock: number;
  unit: string;
}

const SummarySection = ({
  totalPrice,
  remainingStock,
  unit,
}: SummarySectionProps) => {
  return (
    <section className="p-2 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold text-black inter-font">Total</h3>
        <p className="text-base font-semibold text-cyan-800 inter-font">
          ₱{totalPrice.toFixed(2)}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 inter-font">Remaining Stock</p>
        <p className="text-sm text-gray-500 inter-font">
          {remainingStock} {unit}
        </p>
      </div>
    </section>
  );
};

export default SummarySection;
