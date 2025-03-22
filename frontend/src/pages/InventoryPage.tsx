import React, { useState } from "react";
import InventoryManagementTable from "@/components/InventoryManagementTable/InventoryManagementTable";
import AddProductModal from "@/components/AddProductModal/AddProductModal";
import OutItemModal from "@/components/OutItemModal/OutItemModal";
import { InventoryItem, ItemFormData, OrderItem } from "@/types";
import { PageTitle } from "@/components/PageTitle";

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
    
    
  ]); // Stores the items in the inventory
  const [outItems, setOutItems] = useState<OrderItem[]>([]); // For when item is out, it creates a copy of the modified item from the inventory and stores it

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
    <div className="flex-1 p-4 overflow-y-auto">
      <PageTitle title="Main Inventory"/>
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
