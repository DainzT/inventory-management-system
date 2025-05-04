import React, { useState } from "react";
import { BsArrowDown } from "react-icons/bs";
import { SelectFieldProps } from "@/types/select-field";

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
    <div>
      <div className="flex items-center mb-2">
        <label className="text-base font-bold text-black inter-font">{label}</label>
        {required && <span className="ml-1 text-rose-500">*</span>}
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex justify-between items-center px-4 w-full h-12 rounded-lg border-[1px] 
          bg-[#F4F1F1] inter-font ${error ? "border-red-500" : "border-[#0FE3FF] cursor-pointer"}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className="text-base text-black inter-font">{value || placeholder}</span>
        <BsArrowDown />
      </button>

      {isOpen && (
        <div className="mt-2 absolute w-80 rounded-lg border border-red-100 bg-white shadow-lg z-50">
          <ul>
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionClick(option)}
                className="px-4 py-2 hover:bg-zinc-100 cursor-pointer inter-font"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="absolute text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default SelectField;
