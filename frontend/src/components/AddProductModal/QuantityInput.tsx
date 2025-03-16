
interface QuantityInputProps {
  value: number | "";
  onChange: (value: number | "") => void;
  required?: boolean
}

export const QuantityInput = ({
  value,
  onChange,
  required,
}: QuantityInputProps) => {
  const handleIncrement = () => {
    onChange((value || 0) + 1);
  };

  const handleDecrement = () => {
    if (value && value > 0 && value - 1 > 0) {
      onChange(value - 1);
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
      <label className="text-[16px] font-bold inter-font">
        <span>Quantity </span>
        {required && <span className="text-[#FF5757]">*</span>}
      </label>
      <div className="flex items-center gap-2 mt-2">
        <button
          type="button"
          onClick={handleDecrement}
          className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] border-[1px] border-[#0FE3FF] bg-[#F4F1F1]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12H19"
              stroke="#1E1E1E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <input
          type="number"
          value={value !== "" ? roundTo(value, 2) : ""}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          placeholder="0.00"
          className="w-[70px] h-[32px] text-center rounded-[8px] border-[1px] border-[#0FE3FF] bg-[#F4F1F1] inter-font"
          required={required}
        />
        <button
          type="button"
          onClick={handleIncrement}
          className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] border-[1px] border-[#0FE3FF] bg-[#F4F1F1]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M11 13H5V11H11V5H13V11H19V13H13V19H11V13Z"
              fill="#1D1B20"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

