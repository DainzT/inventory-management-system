import React, { useState } from "react";
import InventoryManagementTable from "@/components/InventoryManagementTable/InventoryManagementTable";
import AddProductModal from "@/components/AddProductModal/AddProductModal";
import OutItemModal from "@/components/OutItemModal/OutItemModal";
import { InventoryItem, ProductFormData } from "@/types";

const Inventory: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOutOpen, setIsOutOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: 1,
      productName: "Fishing Reel",
      note: "Spinning reel, corrosion-resistant",
      quantity: 8,
      unitPrice: 60.0,
      selectUnit: "piece",
      unitSize: 1,
      total: 480.0,
      dateCreated: new Date(),
      lastUpdated: new Date(),
    },
  ]);

  const handleAddProduct = (newProduct: ProductFormData) => {
    setInventoryItems((prevItems) => [
      ...prevItems,
      {
        ...newProduct,
        id: prevItems.length + 1, 
      },
    ]);
    setIsAddOpen(false); 
  };

  return (
    <div className="p-4 bg-[#F4F4F4] h-full">
      <h1 className="text-2xl font-bold">Main Inventory</h1>
      <InventoryManagementTable 
        setIsAddOpen={setIsAddOpen} 
        setIsEditOpen={setIsEditOpen} 
        setIsOutOpen={setIsOutOpen}
        inventoryItems={inventoryItems}
      />
      <AddProductModal 
        isOpen={isAddOpen} 
        setIsOpen={setIsAddOpen} 
        onAddItem={handleAddProduct}
      />
      <OutItemModal isOpen={isOutOpen} setIsOpen={setIsOutOpen}/>
    </div>
  );
};

export default Inventory;
