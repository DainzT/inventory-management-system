import { SearchBar } from "./SearchBar";
import { InventoryButton } from "./InventoryButton";
import { InventoryTable } from "./InventoryTable";
import { useState } from "react";
import { InventoryItem } from "@/types";
import { TableHeader } from "./TableHeader";

interface InventoryManagementTableProps {
  inventoryItems: InventoryItem[];
  setIsAddOpen: (isOpen: boolean) => void;
  setIsOutOpen: (isOpen: boolean, item?: InventoryItem) => void;
  setIsEditOpen: (isOpen: boolean) => void;
  onSearch?: (query: string) => void;
}

const InventoryManagementTable = ({
  inventoryItems,
  setIsAddOpen,
  setIsOutOpen,
  setIsEditOpen,
  onSearch,
}: InventoryManagementTableProps) => {

  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const handleToggleExpand = (itemId: number) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const handleOutItemClick = (item: InventoryItem) => {
    setIsOutOpen(true, item);
  };

  return (
      <main className="p-[30px] max-lg:p-[15px] h-[calc(100vh-135px)]">
        <section className="w-full h-[calc(100vh-140px)] rounded-[12px] border-[1px] border-[#E5E7EB] bg-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)]">
          <div className="p-[24px] flex items-center gap-[10px]">
              <SearchBar placeholder="Search Items..."  onSearch={onSearch}/>
              <InventoryButton 
                  variant="add"
                  onAdd={() => setIsAddOpen(true)}
              />
          </div>
          <TableHeader />
          <div className=" flex flex-col h-[calc(100vh-380px)] overflow-x-hidden overflow-auto">
            <InventoryTable
              items={inventoryItems}
              expandedItem={expandedItem}
              onToggleExpand={handleToggleExpand}
              onOut={(item) => handleOutItemClick(item)}
              onEdit={() => setIsEditOpen(true)}
            />
          </div>
        </section>
      </main>
  );
}

export default InventoryManagementTable;