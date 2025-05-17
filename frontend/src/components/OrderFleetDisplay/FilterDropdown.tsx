"use client";
import React, { useState } from "react";
import { FilterDropdownProps } from "@/types/filter-dropdown";

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  onSelect,
}) => {
  const [selectedOption, setSelectedOption] = useState(label);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    setSelectedOption(value);
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="relative ml-3 -mr-15 w-60">
      <div
        className="block h-[50px] rounded-[12px] border-[2px] border-[#E5E7EB] bg-[#F8FAFA] px-[14px] appearance-none w-full text-gray-700 py-3 pr-10 leading-tight focus:outline-none focus:border-teal-500 cursor-pointer text-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
          <svg
            className="fill-current h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <ul
          className="absolute z-50 mt-1 w-full bg-white border-[1px] border-[#E5E7EB] 
            shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] rounded-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer inter-font"
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={selectedOption === option}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
