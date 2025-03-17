import { useState } from "react";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";

export interface InventoryItemsProps {
  id: number;
  productName: string;
  note: string;
  quantity: number | "";
  unitPrice: number | "";
  selectUnit: string;
  unitSize: number | "";
  total?: number | "";
}

export const InventoryTable = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItemsProps[]>([
    {
      id: 1,
      productName: "Fishing Reel",
      note: "Spinning reel, corrosion-resistant",
      quantity: 8,
      unitPrice: 60.0,
      selectUnit: "piece",
      unitSize: 1,
    },
    {
      id: 2,
      productName: "Nylon Fishing Line",
      note: "500m, high-tensile strength",
      quantity: 25,
      unitPrice: 150.5,
      selectUnit: "roll",
      unitSize: 1,
    },
  ]);

  const handleOut = (id: number) => {
    console.log(`Out clicked for item ${id}`);
  };

  const handleEdit = (id: number) => {
    console.log(`Edit clicked for item ${id}`);
  };

  return (
    <section>
      <TableHeader />
      <div className="p-[24px] flex flex-col gap-[24px]">
        {inventoryItems.map((item) => (
          <TableRow
            key={item.id}
            {...item}
            onOut={() => handleOut(item.id)}
            onEdit={() => handleEdit(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
