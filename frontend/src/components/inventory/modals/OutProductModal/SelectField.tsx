import { SelectFieldProps } from "@/types/select-field";
import { BsArrowDown } from "react-icons/bs";
import { useState } from "react";

const SelectField = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
}: SelectFieldProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOptionClick = (option: string) => {
    if (!disabled) {
      onChange(option);
      setIsOpen(false);
    }
  };

  return (
    <div className="select-none">
      <div className="flex items-center mb-2">
        <label className="text-base font-bold text-black inter-font">
          {label}
        </label>
        {required && <span className="ml-1 text-rose-500">*</span>}
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex justify-between items-center px-4 w-full h-12 rounded-lg border-[1px] 
          bg-[#F4F1F1] inter-font transition-all duration-200 ${
            disabled
              ? "cursor-not-allowed opacity-70"
              : error
              ? "border-red-500 hover:border-red-600"
              : "border-accent-light cursor-pointer"
          }
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className="text-base text-black inter-font">
          {value || placeholder}
        </span>
        <BsArrowDown />
      </button>

      {isOpen && (
        <div className="mt-2 absolute w-84 rounded-lg border border-red-100 bg-white shadow-lg z-50">
          <ul>
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionClick(option)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer inter-font"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div
        className={`transition-all duration-200 ${
          error ? "mt-[0.2rem] max-h-10" : "h-0"
        }`}
      >
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default SelectField;
