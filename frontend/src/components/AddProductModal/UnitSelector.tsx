import { useState, useRef, useEffect } from "react";

interface UnitSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const UnitSelector = ({
  value,
  onChange,
  error,
  disabled = false,
}: UnitSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customUnit, setCustomUnit] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const presetUnits = [
    "Piece",
    "Box",
    "Pack",
    "Dozen",
    "Case",
    "Bundle",
    "Set",
    "Kit",
    "Roll",
    "Meter",
  ];

  const filteredUnits = presetUnits.filter((unit) =>
    unit.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCustomUnitAdd = () => {
    if (customUnit.trim()) {
      onChange(customUnit);
      setCustomUnit("");
      setIsOpen(false);
    }
  };

  const selectUnit = (unit: string) => {
    onChange(unit);
    setIsOpen(false);
    setSearchTerm("");
  };


  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-[16px] font-bold inter-font">
        <span>Select Unit </span>
        <span className="text-[#FF5757]">*</span>
      </label>
      <div
        onClick={!disabled ? () => setIsOpen(!isOpen) : undefined}
        className={`mt-2 w-[140px] h-[32px] px-4 flex items-center justify-between rounded-[8px] border-[1px] bg-[#F4F1F1] transition-all duration-200
        ${disabled
            ? 'cursor-not-allowed opacity-70'
            : error
              ? 'border-red-500 hover:border-red-600'
              : 'border-[#0FE3FF] cursor-pointer'
          }`}
      >
        <span className={value ? "inter-font" : "text-[#999] inter-font"}>{value || "Unit"}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 15L7 10H17L12 15Z" fill="#1D1B20" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-[200px] mt-1 bg-white border-[1px] border-[#000] rounded-[4px]">
          <div className="p-2 border-b-[1px] border-[#E0D8D8]">
            <div className="flex gap-2">
              <input
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value)}
                type="text"
                placeholder="Custom unit"
                className="w-full px-2 py-1 text-[14px] text-[#999] border-[1px] border-[#0FE3FF] rounded-[4px] bg-[#F4F1F1] inter-font"
              />
              <button
                onClick={handleCustomUnitAdd}
                className="px-2 py-1 text-[#1B626E] bg-[#F4F1F1] rounded-[4px] border-[1px] border-[#0FE3FF] inter-font"
              >
                Add
              </button>
            </div>
          </div>

          <div className="p-2 border-b-[1px] border-[#E0D8D8]">
            <div className="relative">
              <svg
                className="absolute left-2 top-[50%] transform -translate-y-1/2"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M14.7 16.25L9.975 11.525C9.6 11.825 9.16875 12.0625 8.68125 12.2375C8.19375 12.4125 7.675 12.5 7.125 12.5C5.7625 12.5 4.60938 12.0281 3.66563 11.0844C2.72188 10.1406 2.25 8.9875 2.25 7.625C2.25 6.2625 2.72188 5.10938 3.66563 4.16563C4.60938 3.22188 5.7625 2.75 7.125 2.75C8.4875 2.75 9.64063 3.22188 10.5844 4.16563C11.5281 5.10938 12 6.2625 12 7.625C12 8.175 11.9125 8.69375 11.7375 9.18125C11.5625 9.66875 11.325 10.1 11.025 10.475L15.75 15.2L14.7 16.25ZM7.125 11C8.0625 11 8.85938 10.6719 9.51562 10.0156C10.1719 9.35938 10.5 8.5625 10.5 7.625C10.5 6.6875 10.1719 5.89062 9.51562 5.23438C8.85938 4.57812 8.0625 4.25 7.125 4.25C6.1875 4.25 5.39062 4.57812 4.73438 5.23438C4.07812 5.89062 3.75 6.6875 3.75 7.625C3.75 8.5625 4.07812 9.35938 4.73438 10.0156C5.39062 10.6719 6.1875 11 7.125 11Z"
                  fill="#1D1B20"
                />
              </svg>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Search units"
                className="w-full pl-8 pr-2 py-1 text-[11px] font-bold text-[#999] border-[1px] border-[#000] rounded-[4px] inter-font"
              />
            </div>
          </div>

          <div className="max-h-[200px] overflow-y-auto">
            {filteredUnits.map((unit) => (
              <div
                key={unit}
                onClick={() => selectUnit(unit)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer inter-font"
              >
                {unit}
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <p className="absolute text-red-600 text-sm">{error}</p>}
    </div>
  );
};
