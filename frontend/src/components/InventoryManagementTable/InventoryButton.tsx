interface InventoryButtonProps {
  variant?: "actions" | "add";
  onAdd?: () => void;
  onOut?: () => void;
  onEdit?: () => void;
  type?: "button"
}

export const InventoryButton = ({
  variant,
  onAdd,
  onOut,
  onEdit,
  type = "button",
}: InventoryButtonProps) => {

  if (variant === "add") {
    return (
      <button
        type={type}
        onClick={onAdd}
        className="
            flex items-center gap-[10px] h-[51px] px-[16px] 
            rounded-[12px] bg-[#295C65] 
            shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10)]
            transition-transform duration-200 ease-in-out 
          hover:bg-[#357D8B] hover:scale-105
            cursor-pointer
          "
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 4V16M4 10H16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-[18px] text-white">Add Item</span>
      </button>
    );
  }

  if (variant === "actions") {
    return (
      <div className="item-center flex flex-1 justify-center gap-[10px]">
        <button
          onClick={onOut}
          className="
            flex items-center gap-[8px] h-[48px] px-[12px] 
            rounded-[8px] bg-[#047857]
            transition-all duration-150 
            hover:bg-[#065F46] active:scale-95
            cursor-pointer
          "
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 5L16.25 8.75M16.25 8.75L12.5 12.5M16.25 8.75H7.5M8.75 12.5H7.5C5.42894 12.5 3.75 10.8211 3.75 8.75C3.75 6.67894 5.42894 5 7.5 5H8.75"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[16px] text-white flex-1">Assign</span>
        </button>
        <button
          onClick={onEdit}
          className="
              flex items-center gap-[8px] h-[48px] px-[12px] 
              rounded-[8px] bg-[#3B82F6] 
              transition-all duration-150 
            hover:bg-[#2563EB] active:scale-95
            cursor-pointer
            "
        >
          <svg width="15" height="16" viewBox="0 0 15 16" fill="none">
            <path
              d="M9.99763 2L12.494 5M2.50867 14L5.00499 13L11.6618 5L9.99763 3L3.34077 11L2.50867 14Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[16px] text-white">Edit</span>
        </button>
      </div>
    )
  }
};