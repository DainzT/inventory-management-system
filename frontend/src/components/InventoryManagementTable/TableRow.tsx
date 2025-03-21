import { InventoryButton } from "./InventoryButton";
import { InventoryItem } from "@/types";
import { ExpandedItemDetails } from "./ExpandedItemDetails";
import { ChevronIcon } from "./ChevronIcon";

interface TableRowProps {
    item: InventoryItem;
    isExpanded: boolean;
    onToggle: (id: number) => void;
    onOut?: () => void;
    onEdit?: () => void;
  }

  export function TableRow({
    item,
    isExpanded,
    onToggle,
    onOut,
    onEdit,
  }: TableRowProps) {
    return (
      <article>
        <div className="flex items-center p-[24px] border-[1px] border-[#E5E7EB] bg-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)]">
          <div className="w-[60px] text-[18px] text-[#1F2937]">
            {item.id}
          </div>
          <div className="w-[192px] text-[18px] font-bold text-[#1F2937]">
            {item.name}
          </div>
          <div className="w-[286px] text-[18px] text-[#4B5563]">
            {item.note}
          </div>
          <div className="w-[130px] text-[18px] text-[#1F2937]">
            {item.quantity} {`${Number(item.quantity) > 1 && !/[sS]$/.test(item.selectUnit) ? `${item.selectUnit}s` : item.selectUnit}`}
          </div>
          <div className="w-[162px] text-[18px] text-[#1F2937]">
            ₱{typeof item.unitPrice === "number" ? item.unitPrice.toFixed(2) : "0.00"} / {item.unitSize} {`${Number(item.unitSize) > 1 && !/[sS]$/.test(item.selectUnit) ? `${item.selectUnit}s` : item.selectUnit}`}
          </div>
          <div className="flex-1">
            <InventoryButton 
              variant="actions" 
              onOut={onOut} onEdit={onEdit} 
            />
          </div>
          <div className="ml-4 scale-80 cursor-pointer rounded-full transition-all hover:scale-90 hover:shadow-md hover:shadow-gray-600/50" onClick={() => onToggle(item.id)}>
            <ChevronIcon isExpanded={isExpanded} />
          </div>
        </div>
        <div className={`transition-all duration-300 ease-in-out ${
            isExpanded 
            ? "scale-[100.5%] opacity-100 max-h-[500px]" 
            : "scale-100 opacity-0 max-h-0 overflow-hidden"
          }`}
        >
        {isExpanded && <ExpandedItemDetails item={item} />}
        </div>
      </article>
    );
};
  