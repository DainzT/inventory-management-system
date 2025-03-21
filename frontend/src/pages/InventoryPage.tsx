import React, { useState } from "react";
import InventoryManagementTable from "@/components/InventoryManagementTable/InventoryManagementTable";
import AddProductModal from "@/components/AddProductModal/AddProductModal";
import OutItemModal from "@/components/OutItemModal/OutItemModal";
import { InventoryItem, ItemFormData, OrderItem } from "@/types";

const Inventory: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOutOpen, setIsOutOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: 1,
      name: "Fishing Reel",
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
  const [outItems, setOutItems] = useState<OrderItem[]>([]);

  console.log(outItems)

  const handleAddProduct = (newProduct: ItemFormData) => {
    setInventoryItems((prevItems) => [
      ...prevItems,
      {
        ...newProduct,
        id: prevItems.length + 1, 
      },
    ]);
    setIsAddOpen(false); 
  };  

  const handleOutItem = (updatedItem: InventoryItem, outItem: OrderItem) => {
    setInventoryItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );

    setOutItems((prevOutItems) => [...prevOutItems, outItem]);
  };

  return (
    <div className="p-4 bg-[#F4F4F4] h-full">
      <h1 className="text-2xl font-bold">Main Inventory</h1>
      <InventoryManagementTable 
        setIsAddOpen={setIsAddOpen} 
        setIsEditOpen={setIsEditOpen} 
        setIsOutOpen={(isOpen, item) => {
          setSelectedItem(item || null);
          setIsOutOpen(isOpen);
        }}
        inventoryItems={inventoryItems}
      />
      <AddProductModal 
        isOpen={isAddOpen} 
        setIsOpen={setIsAddOpen} 
        onAddItem={handleAddProduct}
      />
      <OutItemModal 
        isOpen={isOutOpen} 
        setIsOpen={setIsOutOpen}
        selectedItem={selectedItem}
        onOutItem={handleOutItem}
      />
    </div>
  );
};

export default Inventory;
