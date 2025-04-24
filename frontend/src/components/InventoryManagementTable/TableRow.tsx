import { InventoryButton } from "./InventoryButton";
import { InventoryItem } from "@/types";
import { ExpandedItemDetails } from "./ExpandedItemDetails";
import { ChevronIcon } from "./ChevronIcon";

interface TableRowProps {
  item: InventoryItem;
  index: number;
  isExpanded: boolean;
  onToggle: (id: number) => void;
  onOut?: () => void;
  onEdit?: () => void;
}

export function TableRow({
  item,
  index,
  isExpanded,
  onToggle,
  onOut,
  onEdit,
}: TableRowProps) {

  return (
    <article>
      <div className="flex items-center px-3 sm:px-0 md:px-6 lg:px-3 xl:px-5 p-4 sm:p-6 border-[1px] border-[#E5E7EB] bg-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] ">
        <div className="
          min-w-[30px] xs:min-w-[40px] sm:min-w-[50px] lg:min-w-[50px] xl:min-w-[60px]
          text-[12px] xs:text-xs sm:text-sm md:text-[16px] text-[#1F2937] text-center 
          shrink-0 break-all overflow-hidden hyphens-auto">
          {index + 1}
        </div>
        <div className="
          w-[98px] xs:min-w-[80px] sm:min-w-[100px] md:min-w-[140px] lg:min-w-[130px] xl:min-w-[160px]
          text-[12px] xs:text-xs sm:text-sm md:text-[16px] font-bold text-[#1F2937] text-center 
          shrink-0 break-all overflow-hidden hyphens-auto  px-2 flex-1">
          {item.name}
        </div>
        <div className="
          w-[90px] xs:min-w-[80px] sm:min-w-[100px] md:w-[100px] lg:w-[120px] xl:w-[150px]
          text-[12px] xs:text-xs sm:text-sm md:text-[16px] text-[#4B5563] text-left 
          shrink-0 break-all overflow-hidden hyphens-auto px-2 flex-1
        ">
          {item.note}
        </div>
        <div className="
          w-[80px] xs:min-w-[60px] sm:min-w-[80px] md:min-w-[100px] lg:min-w-[110px] xl:min-w-[120px]
          text-[12px] xs:text-xs sm:text-sm md:text-[16px] text-[#1F2937] text-center 
          shrink-0 break-all overflow-hidden hyphens-auto  flex-1
        ">
          {item.quantity}{" "}
          {`${Number(item.quantity) > 1 && !/[sS]$/.test(item.selectUnit)
            ? `${item.selectUnit}s`
            : item.selectUnit
            }`}
        </div>
        <div className="
          w-[90px] xs:min-w-[80px] sm:min-w-[100px] md:min-w-[170px] lg:min-w-[120px] xl:min-w-[180px]
          text-[12px] xs:text-xs sm:text-sm md:text-[16px] text-[#1F2937] text-center
          shrink-0 break-all overflow-hidden hyphens-auto px-2 flex-1
        ">
          ₱{typeof item.unitPrice === "number" ? item.unitPrice.toFixed(2) : "0.00"} / {item.unitSize}{" "}
          {`${Number(item.unitSize) > 1 && !/[sS]$/.test(item.selectUnit)
            ? `${item.selectUnit}s`
            : item.selectUnit
            }`}
        </div>
        <div className="
          min-w-[120px] sm:min-w-[120px] lg:min-w-[120px] xl:min-w-[160px]
          scale-70 sm:scale-70 md:scale-80 lg:scale-70 xl:scale-90
          text-center flex-1 shrink-0 
        ">
          <InventoryButton variant="actions" onOut={onOut} onEdit={onEdit} />
        </div>
        <div
          className=" sm:mr-2 scale-80 cursor-pointer rounded-full transition-all hover:scale-90 hover:shadow-md hover:shadow-gray-600/50"
          onClick={() => onToggle(item.id)}
        >
          <ChevronIcon isExpanded={isExpanded} />
        </div>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${isExpanded
          ? "scale-[100.5%] opacity-100 max-h-[500px]"
          : "scale-100 opacity-0 max-h-0 overflow-auto"
          }`}
      >
        {isExpanded && <ExpandedItemDetails item={item} />}
      </div>
    </article>
  );
};
