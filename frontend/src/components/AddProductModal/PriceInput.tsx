import { roundTo } from "@/utils/RoundTo";

interface PriceInputProps {
  label: string;
  value: number | "";
  unitSize?: number | "";
  onChange?: (value: number | "") => void;
  unitChange?: (value: number | "") => void;
  readonly?: boolean;
  required?: boolean;
  unit?: string;
  quantity?: number | "";
  error?: {
    unitPrice?: string;
    unitSize?: string;
  };
  disabled?: boolean;
}

export const PriceInput = ({
  label,
  value,
  unitSize,
  onChange,
  unitChange,
  readonly = false,
  required = false,
  unit,
  quantity,
  error,
  disabled = false,
}: PriceInputProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      onChange?.("");
    } else {
      const parsedValue = parseFloat(inputValue);
      if (!isNaN(parsedValue)) {
        onChange?.(parsedValue);
      }
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      unitChange?.("");
    } else {
      const parsedValue = parseFloat(inputValue);
      if (!isNaN(parsedValue)) {
        unitChange?.(parsedValue);
      }
    }
  };

  return (
    <div>
      <label className="text-[16px] font-bold inter-font">
        <span>{label} </span>
        {(!readonly && required) && <span className="text-[#FF5757]">*</span>}
      </label>
      <div className="relative mt-2">
        <span className="absolute left-4 top-[8px] text-[#666] inter-font">₱</span>
        <input
          type="number"
          value={value !== "" ? roundTo(value,2) : ""}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          readOnly={readonly}
          className={`w-[140px] h-[40px] pl-8 rounded-[8px] border-[1px] inter-font
              ${error?.unitPrice ? "border-red-500" : readonly
              ? "border-[#F8F8F8] bg-[rgba(244,241,241,0.77)] text-[#666] cursor-default pointer-events-none"
              : "border-[#0FE3FF] bg-[#F4F1F1]"
            }`}
          disabled={disabled}
        />
        {required && (
          <>
            <span className=" ml-2 mr-2 inter-font">per</span>
            <input
              type="number"
              value={typeof unitSize === "number" ? roundTo(unitSize, 2) : ""}
              onChange={handleUnitChange}
              placeholder="0.00"
              max={typeof quantity === "number" ? quantity : undefined}
              min="0"
              step="0.01"
              readOnly={readonly}
              className={`w-[70px] h-[40px] pl-3 rounded-[8px] border-[1px] inter-font ${error?.unitSize ? "border-red-500" : "border-[#0FE3FF]"} bg-[#F4F1F1]`}
              required={(typeof unitSize === "number" && typeof quantity === "number" && unitSize > quantity)}
              disabled={disabled}
            />
            {error && <span className="absolute text-red-600 text-sm -translate-17 translate-y-10">{error.unitSize}</span>}
            <span className="ml-2 inter-font">{unit?.trim() || "unit"}</span>
          </>
        )}
      </div>
      {error && <p className="absolute text-red-600 text-sm">{error.unitPrice}</p>}
    </div>
  );
};
