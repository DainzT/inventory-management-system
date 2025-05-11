import { InventoryItem } from "@/types";
import { pluralize } from "@/utils/Pluralize";
import { roundTo } from "@/utils/RoundTo";
import { useState } from "react";

interface ItemDetailsProps {
  item: InventoryItem
}

const ItemDetails = ({
  item
}: ItemDetailsProps) => {
  const [expanded, setExpanded] = useState(false);
  const showToggle = item.note.length > 42;

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
          <div
            className={`text-sm text-gray-500 inter-font break-words  ${expanded ? "" : "line-clamp-1"
              }`}
          >
            {item.note}
          </div>
          {showToggle && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs mt-1 text-cyan-600 hover:text-cyan-800 transition-colors cursor-pointer"
            >
              {expanded ? "Show less..." : "Show more..."}
            </button>
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
