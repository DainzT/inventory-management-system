import { InventoryButton } from "./InventoryButton";
import { HighlightedItem, InventoryItem } from "@/types";
import { ExpandedItemDetails } from "./ExpandedItemDetails";
import { ChevronIcon } from "./ChevronIcon";
import { roundTo } from "@/utils/RoundTo";
import { highlightText } from "@/utils/HighlightText";
import { pluralize } from "@/utils/Pluralize";
import { forwardRef } from 'react'; 

interface TableRowProps {
  item: InventoryItem;
  index: number;
  isExpanded: boolean;
  onToggle: (id: number) => void;
  onOut?: () => void;
  onEdit?: () => void;
  searchQuery: string;
  highlightedItem?: HighlightedItem;
}

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>((
  {
    item,
    index,
    isExpanded,
    onToggle,
    onOut,
    onEdit,
    searchQuery,
    highlightedItem,
  },
  ref
) =>  {
  return (
    <article>
      <div className={`
          flex items-center px-3 sm:px-0 md:px-6 lg:px-3 xl:px-5 p-2 sm:p-2 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] hover:bg-gray-50 
          transition-colors duration-150 ease-in-out
          ${highlightedItem?.id === item.id ? '' : 'border border-[#E5E7EB] bg-white'}
            ${highlightedItem?.id === item.id
            ? highlightedItem.type === 'added'
              ? 'bg-emerald-50/70 border-l-4 border-emerald-400'
              : highlightedItem.type === 'assigned'
                ? 'bg-sky-50/70 border-l-4 border-sky-400'
                : highlightedItem.type === 'edited'
                  ? 'bg-amber-50/70 border-l-4 border-amber-400'
                  : 'border border-[#E5E7EB] bg-white'
          : ''
        } `}
        ref={ref}
        >
        <div className="
          min-w-[30px] xs:min-w-[40px] sm:min-w-[50px] lg:min-w-[50px] xl:min-w-[60px]
          text-[12px] xs:text-xs sm:text-sm md:text-[16px] text-[#1F2937] text-left l-
          shrink-0 break-all overflow-hidden hyphens-auto  px-3 ">
          {index + 1}
        </div>
        <div className="
          w-[98px] xs:min-w-[80px] sm:min-w-[100px] md:min-w-[140px] lg:min-w-[130px] xl:min-w-[160px]
          text-[12px] xs:text-xs sm:text-sm md:text-[16px] font-bold text-[#1F2937] text-left 
          shrink-0 break-all overflow-hidden hyphens-auto  px-3 flex-1 ">
          {highlightText(item.name, searchQuery)}
        </div>
        <div className="
          w-[90px] xs:min-w-[80px] sm:min-w-[100px] md:w-[100px] lg:w-[120px] xl:w-[150px]
          text-[12px] xs:text-xs sm:text-sm md:text-[16px] text-[#4B5563] text-left 
          shrink-0 break-all overflow-hidden hyphens-auto px-3 flex-1
        ">
          {highlightText(item.note, searchQuery)}
        </div>
        <div className="
          w-[80px] xs:min-w-[60px] sm:min-w-[80px] md:min-w-[100px] lg:min-w-[110px] xl:min-w-[120px]
          text-[12px] xs:text-xs sm:text-sm md:text-[16px] text-[#1F2937] text-left 
          shrink-0 break-all overflow-hidden hyphens-auto px-3 flex-1
        ">
          {highlightText(`${roundTo(Number(item.quantity), 2)} ${pluralize(item.selectUnit, Number(item.quantity))}`, searchQuery)}
        </div>
        <div className="
          w-[90px] xs:min-w-[80px] sm:min-w-[100px] md:min-w-[170px] lg:min-w-[120px] xl:min-w-[180px]
          text-[12px] xs:text-xs sm:text-sm md:text-[16px] text-[#1F2937] text-left
          shrink-0 break-all overflow-hidden hyphens-auto px-3 flex-1 
        ">
          {highlightText(`₱${Number(item.unitPrice).toFixed(2)} / ${item.unitSize} ${pluralize(item.selectUnit, Number(item.unitSize))}`, searchQuery)}
        </div>
        <div className="
          min-w-[120px] sm:min-w-[120px] lg:min-w-[120px] xl:min-w-[160px]
          scale-70 sm:scale-70 md:scale-80 lg:scale-70 xl:scale-90
          text-center flex-1 shrink-0
        ">
          <InventoryButton variant="actions" onOut={onOut} onEdit={onEdit} />
        </div>
        <div
          className="
            sm:mr-2 scale-80 cursor-pointer rounded-full 
            transition-all hover:scale-90 hover:shadow-md hover:shadow-gray-600/50
          "
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
});

TableRow.displayName = 'TableRow'
