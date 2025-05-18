import { InventoryItem } from "@/types";
import { pluralize } from "@/utils/Pluralize";
import { roundTo } from "@/utils/RoundTo";
import { Tooltip } from "../ToolTips";

interface ItemDetailsProps {
  item: InventoryItem
  maxNoteLength?: number;
}

const ItemDetails = ({
  item,
  maxNoteLength = 39,
}: ItemDetailsProps) => {
  const getAdjustedMaxLength = (text: string) => {
    if (!text) return maxNoteLength;
    
    const totalLetters = text.replace(/[^a-zA-Z]/g, '').length;
    if (totalLetters === 0) return maxNoteLength;
    
    const upperCaseLetters = text.replace(/[^A-Z]/g, '').length;
    const upperCaseRatio = upperCaseLetters / totalLetters;

    if (upperCaseRatio === 0) return 39;
    if (upperCaseRatio >= 0.4 && upperCaseRatio < 0.5) return 32;
    if (upperCaseRatio >= 0.5) return 30;
    return maxNoteLength;
  };
  const adjustedMaxLength = getAdjustedMaxLength(item.note);
  const shouldTruncate = item.note.length > adjustedMaxLength;
  const truncatedNote = shouldTruncate
    ? `${item.note.slice(0, adjustedMaxLength)}...`
    : item.note;

  return (
    <section className="p-2 mb-2 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-base font-semibold text-black truncate max-w-[60%]">{item.name}</h2>
        <p className="text-base font-semibold text-cyan-800 inter-font whitespace-nowrap">
          ₱{Number(item.unitPrice).toFixed(2)} / {item.unitSize} {pluralize(item.selectUnit, Number(item.unitSize))}
        </p>
      </div>
      {item.note && (
        <div className="mb-2">
          {shouldTruncate ? (
            <Tooltip content={item.note.slice(adjustedMaxLength, item.note.length)} position="bottom">
              <p className="text-sm text-gray-600 break-words cursor-pointer">
                {truncatedNote}
                <span className="inline-block ml-1 text-cyan-600">↗</span>
              </p>
            </Tooltip>
          ) : (
            <p className="text-sm text-gray-600 break-words">{item.note}</p>
          )}
        </div>
      )}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 inter-font whitespace-nowrap">Stock Available:</p>
        <p className="text-sm font-semibold text-black whitespace-nowrap">
          {roundTo(Number(item.quantity), 2)} {pluralize(item.selectUnit, Number(item.quantity))}
        </p>
      </div>
    </section>
  );
};

export default ItemDetails;
