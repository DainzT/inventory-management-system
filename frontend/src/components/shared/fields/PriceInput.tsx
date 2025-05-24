import { roundTo } from "@/utils/RoundTo";
import { Tooltip } from "../ToolTip";

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
  const MAX_UNIT_LENGTH = 6;

  const getAdjustedMaxLength = (text: string) => {
    if (!text) return MAX_UNIT_LENGTH;

    const totalLetters = text.replace(/[^a-zA-Z]/g, "").length;
    if (totalLetters === 0) return MAX_UNIT_LENGTH;

    const upperCaseLetters = text.replace(/[^A-Z]/g, "").length;
    const upperCaseRatio = upperCaseLetters / totalLetters;
    const lowerCaseLetters = text.replace(/[^a-z]/g, "").length;
    const lowerCaseRatio = lowerCaseLetters / totalLetters;

    if (lowerCaseRatio > 0.5) return 6;
    if (upperCaseRatio >= 0.4 && upperCaseRatio < 0.5) return 7;
    if (upperCaseRatio >= 0.5) return 5;
    return MAX_UNIT_LENGTH;
  };

  const adjustedMaxLength = getAdjustedMaxLength(String(unit));
  const displayUnit =
    unit && unit.length > adjustedMaxLength
      ? `${unit.slice(0, adjustedMaxLength)}…`
      : unit;

  const shouldTruncate = unit && unit.length > adjustedMaxLength;
  const shouldShowTooltip = shouldTruncate && unit.trim().length > 0;

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
    <div className="select-none">
      <label className="text-[16px] font-bold inter-font">
        <span>{label} </span>
        {!readonly && required && <span className="text-[#FF5757]">*</span>}
      </label>
      <div className="relative mt-2">
        <span className="absolute left-4 top-[8px] text-[#666] inter-font">
          ₱
        </span>
        <input
          type="number"
          value={value !== "" ? roundTo(value, 2) : ""}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          readOnly={readonly}
          className={`${
            readonly ? "w-[145px]" : "w-[140px]"
          } h-[40px] pl-8 rounded-[8px] border-[1px] inter-font bg-[#F4F1F1]
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-transparent
            ${
              disabled
                ? "cursor-not-allowed opacity-70"
                : error?.unitPrice
                ? "border-red-500 hover:border-red-600"
                : readonly
                ? "border-[#F8F8F8] bg-[rgba(244,241,241,0.77)] text-[#666] cursor-default pointer-events-none"
                : "border-accent-light"
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
              className={`w-[70px] h-[40px] pl-3 rounded-[8px] border-[1px] inter-font  bg-[#F4F1F1] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-transparent ${
                disabled
                  ? "cursor-not-allowed opacity-70"
                  : error?.unitSize
                  ? "border-red-500 hover:border-red-600"
                  : "border-accent-light"
              }`}
              required={
                typeof unitSize === "number" &&
                typeof quantity === "number" &&
                unitSize > quantity
              }
              disabled={disabled}
            />
            {error && (
              <span className="absolute text-red-600 text-sm -translate-19 translate-y-10 w-35">
                {error.unitSize}
              </span>
            )}
            {shouldShowTooltip ? (
              <Tooltip content={unit} maxWidth={"w-30"} position="top">
                <span
                  className={`ml-2 inter-font w-full truncate ${
                    unit && unit.length > adjustedMaxLength
                      ? "text-sm cursor-pointer"
                      : ""
                  }`}
                >
                  {displayUnit?.trim() || "unit"}
                </span>
                <span className="inline-block  text-cyan-600 cursor-pointer">
                  ↗
                </span>
              </Tooltip>
            ) : (
              <span className="inter-font text-sm ml-2">
                {unit?.trim() || "unit"}
              </span>
            )}
          </>
        )}
      </div>
      {error && (
        <p className="absolute text-red-600 text-sm">{error.unitPrice}</p>
      )}
    </div>
  );
};
