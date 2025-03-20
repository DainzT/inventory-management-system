import React, { useState } from "react";
import InventoryManagementTable from "@/components/InventoryManagementTable/InventoryManagementTable";
import AddProductModal from "@/components/AddProductModal/AddProductModal";
import OutItemModal from "@/components/OutItemModal/OutItemModal";

const Inventory: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOutOpen, setIsOutOpen] = useState(false);

  return (
    <div className="p-4 bg-[#F4F4F4] h-full">
      <h1 className="text-2xl font-bold">Main Inventory</h1>
      <InventoryManagementTable setIsAddOpen={setIsAddOpen} setIsEditOpen={setIsEditOpen} setIsOutOpen={setIsOutOpen}/>
      <AddProductModal isOpen={isAddOpen} setIsOpen={setIsAddOpen}/>
      <OutItemModal isOpen={isOutOpen} setIsOpen={setIsOutOpen}/>
    </div>
  );
};

export default Inventory;
