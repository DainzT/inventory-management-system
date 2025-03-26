"use client";
import React, { useState } from "react";

interface FilterDropdownProps {
  label: string;
  options: string[]; 
  onSelect: (selectedOption: string) => void;
}

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
    <div className="relative">
      <div
        className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-4 px-5 pr-8 rounded leading-tight focus:outline-none focus:border-teal-500 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)} 
      >
        {selectedOption}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

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