import { SearchBar } from "./SearchBar";
import { InventoryButton } from "./InventoryButton";
import { InventoryTable } from "./InventoryTable";
import { useState } from "react";
import { InventoryItem } from "@/types";
import { TableHeader } from "./TableHeader";
import { ClipLoader } from "react-spinners";

interface InventoryManagementTableProps {
  inventoryItems: InventoryItem[];
  setIsAddOpen: (isOpen: boolean) => void;
  setIsOutOpen: (isOpen: boolean, item?: InventoryItem) => void;
  setIsEditOpen: (isOpen: boolean, item?: InventoryItem) => void;
  onSearch?: (query: string) => void;
  isLoading: boolean;
}

const InventoryManagementTable = ({
  inventoryItems,
  setIsAddOpen,
  setIsOutOpen,
  setIsEditOpen,
  onSearch,
  isLoading = false,
}: InventoryManagementTableProps) => {

  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const handleToggleExpand = (itemId: number) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const handleOutItemClick = (item: InventoryItem) => {
    setIsOutOpen(true, item);
  };

  const handleEditItemClick = (item: InventoryItem) => {
    setIsEditOpen(true, item);
  };

  return (
    <main className="p-[30px] max-lg:p-[15px] h-[calc(100vh-135px)]">
      <section className="w-full h-[calc(100vh-140px)] rounded-[12px] border-[1px] border-[#E5E7EB] bg-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)]">
        <div className="p-[24px] flex items-center gap-[10px]">
          <SearchBar placeholder="Search Items..." onSearch={onSearch} />
          <InventoryButton
            variant="add"
            onAdd={() => setIsAddOpen(true)}
          />
        </div>
        <TableHeader />
        <div className=" flex flex-col h-[calc(100vh-380px)] overflow-x-hidden overflow-auto">
          {isLoading && (
            <div className="relative flex justify-center items-center mt-40 mr-5 ml-3">
              <ClipLoader size={60} color="#36D7B7" loading={isLoading} />
            </div>
          )}
          {inventoryItems.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 mt-20 text-2xl">
              <p>Inventory is empty or no items match your search criteria.</p>
            </div>
          )}
          <InventoryTable
            items={inventoryItems}
            expandedItem={expandedItem}
            onToggleExpand={handleToggleExpand}
            onOut={(item) => handleOutItemClick(item)}
            onEdit={(item) => handleEditItemClick(item)}
          />
        </div>
        <div className="p-3 px-6 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
          <div className="flex justify-between items-center">
            <span>
              {inventoryItems.length} {inventoryItems.length === 1 ? 'item' : 'items total'}
            </span>
            <span className="text-xs text-gray-400">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default InventoryManagementTable;