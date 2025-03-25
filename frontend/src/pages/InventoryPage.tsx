import React, { useState } from "react";
import InventoryManagementTable from "@/components/InventoryManagementTable/InventoryManagementTable";
import AddProductModal from "@/components/AddProductModal/AddProductModal";
import OutItemModal from "@/components/OutItemModal/OutItemModal";
import EditProductModal from "@/components/EditProductModal/EditProductModal";
import { InventoryItem, ItemFormData, OrderItem } from "@/types";
import { PageTitle } from "@/components/PageTitle";


const Inventory: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOutOpen, setIsOutOpen] = useState(false); 
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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
    {
      id: 5,
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
    {
      id: 4,
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
    {
      id: 6,
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
      {
      id: 3,
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
    {
      id: 2,
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

  const handleEditItem = (updatedItem: InventoryItem) => {
     setInventoryItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleDeleteItem = (id: number) => {
    console.log("no", id)
    setInventoryItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };


  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  
  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = [
      item.name.toLowerCase(),
      item.note.toLowerCase(),
      item.quantity.toString(),
      item.unitPrice.toString(),
      item.selectUnit.toLowerCase(),
      item.unitSize.toString(),
      item.total?.toString() || "",
      item.dateCreated.toISOString().toLowerCase(),
    ].some((field) => field.includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="flex-1 p-0 ">
      <PageTitle title="Main Inventory"/>
      <InventoryManagementTable 
        setIsAddOpen={setIsAddOpen} 
        setIsEditOpen={(isOpen, item) => {
          setSelectedItem(item || null);
          setIsEditOpen(isOpen);
        }} 
        setIsOutOpen={(isOpen, item) => {
          setSelectedItem(item || null);
          setIsOutOpen(isOpen);
        }}
        inventoryItems={filteredItems}
        onSearch={handleSearch}
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
      <EditProductModal 
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        selectedItem={selectedItem}
        onEditItem={(item) => handleEditItem(item)}
        onDeleteItem={(id) => handleDeleteItem(id)}
      />
    </div>
  );
};

export default Inventory;
