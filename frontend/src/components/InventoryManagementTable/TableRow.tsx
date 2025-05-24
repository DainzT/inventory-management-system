import { InventoryButton } from "./InventoryButton";
import { HighlightedItem, InventoryItem } from "@/types";
import { ExpandedItemDetails } from "./ExpandedItemDetails";
import { ChevronIcon } from "./ChevronIcon";
import { roundTo } from "@/utils/RoundTo";
import { highlightText } from "@/utils/HighlightText";
import { pluralize } from "@/utils/Pluralize";
import { forwardRef } from 'react';
import { Tooltip } from "../ToolTips";

interface TableRowProps {
  item: InventoryItem;
  index: number;
  isExpanded: boolean;
  onToggle: (id: number) => void;
  onOut?: () => void;
  onEdit?: () => void;
  searchQuery: string;
  highlightedItem?: HighlightedItem;
  currentPage: number;
  itemsPerPage: number;
  maxNoteLength?: number;
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
    itemsPerPage,
    currentPage,
    maxNoteLength = 46
  },
  ref
) => {
  const globalIndex = currentPage * itemsPerPage + index + 1;
  const shouldTruncate = item.note && item.note.length > maxNoteLength;
  const truncatedNote = shouldTruncate
    ? `${item.note.slice(0, maxNoteLength)}...`
    : item.note;

  return (
    <article>
      <div className={`
          flex items-center px-3 sm:px-0 md:px-6 lg:px-3 xl:px-5 p-2 sm:p-2 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] hover:bg-gray-50
          transition-[border-left-color,border-left-width] duration-150 ease-in-out
          ${highlightedItem?.id === item.id ? 'border-l-4' : 'border-[#E5E7EB] bg-white border'}
            ${highlightedItem?.id === item.id
          ? highlightedItem.type === 'added'
            ? 'bg-emerald-50/30 border-l-6 border-emerald-400'
            : highlightedItem.type === 'assigned'
              ? 'bg-sky-50/30 border-l-6 border-sky-400'
              : highlightedItem.type === 'edited'
                ? 'bg-amber-50/30 border-l-6 border-amber-400'
                : 'border-[#E5E7EB] bg-white border'
          : ''
        } `}
        ref={ref}
      >
        <div className="
          min-w-[30px] xs:min-w-[40px] sm:min-w-[50px] lg:min-w-[50px] xl:min-w-[60px]
          text-[12px] xs:text-xs sm:text-sm md:text-[16px] text-[#1F2937] text-left l-
          shrink-0 break-all overflow-hidden hyphens-auto  px-3 ">
          {globalIndex}
        </div>
        <div className="
          w-[98px] xs:min-w-[80px] sm:min-w-[100px] md:min-w-[140px] lg:min-w-[130px] xl:min-w-[160px]
          text-[12px] xs:text-xs sm:text-sm md:text-[16px] font-bold text-[#1F2937] text-left 
          shrink-0 break-all overflow-hidden hyphens-auto  px-3 flex-1">
          {highlightText(item.name, searchQuery)}
        </div>
        <div className="
          w-[90px] xs:min-w-[80px] sm:min-w-[100px] md:w-[100px] lg:w-[120px] xl:w-[150px]
          text-[12px] xs:text-xs sm:text-sm md:text-[16px] text-[#4B5563] text-left 
          shrink-0 break-all hyphens-auto px-3 flex-1
        ">
          {item.note && (
            <div>
              {shouldTruncate ? (
                <Tooltip content={item.note.slice(maxNoteLength, item.note.length)} position="bottom">
                  <p className="text-sm text-gray-600 break-words cursor-pointer">
                    {highlightText(truncatedNote, searchQuery)}
                    <span className="inline-block ml-1 text-cyan-600">↗</span>
                  </p>
                </Tooltip>
              ) : (
                <p className="text-sm text-gray-600 break-words">{highlightText(item.note, searchQuery)}</p>
              )}
            </div>
          )}
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
          <InventoryButton variant="actions" onOut={onOut} onEdit={onEdit} disabled={Number(item.quantity) <= 0} />
        </div>
        <div
          className="
            sm:mr-1 ml-2 scale-80 cursor-pointer rounded-full
            transition-all hover:scale-90 hover:shadow-md hover:shadow-gray-600/50
          "
          onClick={() => onToggle(item.id)}
        >
          <ChevronIcon isExpanded={isExpanded} />
        </div>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${isExpanded
          ? "scale-[100%] opacity-100 max-h-[500px]"
          : "scale-100 opacity-0 max-h-0 overflow-auto"
          }`}
      >
        {isExpanded && <ExpandedItemDetails item={item} />}
      </div>
    </article>
  );
});

TableRow.displayName = 'TableRow'
