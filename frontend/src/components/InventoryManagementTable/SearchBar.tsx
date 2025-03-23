interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}


export function SearchBar({
  placeholder,
  onSearch,
}: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onSearch) {
        onSearch(e.target.value);
      }
    };

  return (
    <div className="flex-1 flex items-center gap-[10px] h-[56px] rounded-[12px] border-[2px] border-[#E5E7EB] bg-[#F8FAFA] px-[14px]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
          stroke="#295C65"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className="bg-transparent w-full text-[18px] text-[#999] outline-none"
      />
    </div>
  );
}
