import React from "react";
import { ItemDetailsProps } from "@/types/item-details";

const ItemDetails: React.FC<ItemDetailsProps> = ({
  name,
  description,
  price,
  availableStock,
  unit,
}) => {
  return (
    <section className="p-2 mb-2 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-base font-semibold text-black">{name}</h2>
        <p className="text-base font-semibold text-cyan-800 inter-font">
          ₱{price.toFixed(2)}
        </p>
      </div>
      <p className="mb-2 text-sm text-gray-500 inter-font">{description}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 inter-font">Stock Available:</p>
        <p className="text-sm font-semibold text-black">
          {availableStock} {unit}
        </p>
      </div>
    </section>
  );
};

export default ItemDetails;
