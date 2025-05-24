interface ChevronIconProps {
    isExpanded: boolean;
}

export const ChevronIcon: React.FC<ChevronIconProps> = ({ isExpanded }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`w-[24px] h-[24px] transition-transform duration-200 ${isExpanded ? "transform rotate-180" : ""
            }`}
    >
        <path
            d="M19 9l-7 7-7-7"
            stroke="#295C65"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
