import React, { useState } from "react";
import { BsArrowDown } from "react-icons/bs";
import { SelectFieldProps } from "@/types/select-field";

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center mb-2">
        <label className="text-base font-bold text-black">{label}</label>
        {required && <span className="ml-1 text-rose-500">*</span>}
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center px-4 w-full h-12 rounded-lg border border-red-100 border-solid cursor-pointer bg-zinc-100"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-base text-black">{value || placeholder}</span>
        <BsArrowDown />
      </button>

      {isOpen && (
        <div className="mt-2 absolute w-80 rounded-lg border border-red-100 bg-white shadow-lg">
          <ul>
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionClick(option)}
                className="px-4 py-2 hover:bg-zinc-100 cursor-pointer"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectField;
