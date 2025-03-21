"use client";
import React from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search items...",
  onSearch,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="relative flex-1">
      <div className="flex gap-3 items-center pl-9 w-full h-14 bg-gray-50 rounded-xl border-1 border">
        <span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="#295C65"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 text-lg bg-transparent text-neutral-700 focus:outline-none"
          onChange={handleChange}
          aria-label={placeholder}
        />
      </div>
    </div>
  );
};
