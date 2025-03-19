import { SearchBar } from "./SearchBar";
import { InventoryButton } from "./InventoryButton";
import { InventoryTable } from "./InventoryTable";
import { useState } from "react";
import { InventoryItem } from "@/types";

interface InventoryManagementTableProps {
  setIsAddOpen: (isOpen: boolean) => void;
  setIsOutOpen: (isOpen: boolean) => void;
  setIsEditOpen: (isOpen: boolean) => void;
}


const InventoryManagementTable = ({
  setIsAddOpen,
  setIsOutOpen,
  setIsEditOpen,
}: InventoryManagementTableProps) => {
  const [inventoryItems, setInventoryItems] =useState<InventoryItem[]>([
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

  return (
      <main className="p-[30px] max-lg:p-[15px]">
        <section className="w-full rounded-[12px] border-[1px] border-[#E5E7EB] bg-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)]">
            <div className="p-[24px] flex items-center gap-[10px]">
                <SearchBar />
                <InventoryButton 
                    variant="add"
                    onAdd={() => setIsAddOpen(true)}
                />
            </div>
        <InventoryTable items={inventoryItems} onOut={() => setIsEditOpen(true)} onEdit={() => setIsOutOpen(true)}/>
        </section>
      </main>
  );
}

export default InventoryManagementTable;