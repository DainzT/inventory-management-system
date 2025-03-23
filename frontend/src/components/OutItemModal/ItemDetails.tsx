import React from "react";
import { InventoryItem } from "@/types";

interface ItemDetailsProps {
  item: InventoryItem
}

const ItemDetails: React.FC<ItemDetailsProps> = ({
  item
}) => {
  return (
    <section className="p-2 mb-2 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-base font-semibold text-black">{item.name}</h2>
        <p className="text-base font-semibold text-cyan-800 inter-font">
          ₱{Number(item.unitPrice).toFixed(2)} / {item.unitSize} {item.selectUnit}
        </p>
      </div>
      <p className="mb-2 text-sm text-gray-500 inter-font">{item.note}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 inter-font">Stock Available:</p>
        <p className="text-sm font-semibold text-black">
          {item.quantity} {item.selectUnit}
        </p>
      </div>
    </section>
  );
};

export default ItemDetails;
