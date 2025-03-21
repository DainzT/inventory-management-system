"use client";
import React, { useState } from "react";

interface FilterDropdownProps {
  label: string;
  options: string[];
  onSelect?: (option: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(label);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className="relative">
      <button
        className="flex relative gap-2.5 justify-center items-center bg-gray-50 rounded-xl border border shadow-sm cursor-pointer h-[51px] w-[133px]"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-lg text-black">{selectedOption}</span>
        <span className="ml-[5px]">
          <svg
            width="10"
            height="5"
            viewBox="0 0 10 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 5L0 0H10L5 5Z" fill="#1D1B20" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option}
              className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
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
