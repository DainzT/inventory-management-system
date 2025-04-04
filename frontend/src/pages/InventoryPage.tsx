import React, { useState } from "react";
import InventoryManagementTable from "@/components/InventoryManagementTable/InventoryManagementTable";
import AddProductModal from "@/components/AddProductModal/AddProductModal";
import OutItemModal from "@/components/OutItemModal/OutItemModal";
import EditProductModal from "@/components/EditProductModal/EditProductModal";
import { InventoryItem, ItemFormData, OrderItem } from "@/types";
import { PageTitle } from "@/components/PageTitle";
import { addInventoryItem } from "@/api/inventoryAPI";

const Inventory: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOutOpen, setIsOutOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: 1,
      name: "Fishing Reel Pro X",
      note: "Spinning reel, corrosion-resistant",
      quantity: 2,
      unitPrice: 89.99,
      selectUnit: "piece",
      unitSize: 1,
      total: 179.98,
      dateCreated: new Date("2023-05-15"),
      lastUpdated: new Date("2023-05-15"),
    },
    {
      id: 2,
      name: "Titanium Fishing Hooks",
      note: "Size 4, pack of 10",
      quantity: 5,
      unitPrice: 12.50,
      selectUnit: "pack",
      unitSize: 5,
      total: 62.50,
      dateCreated: new Date("2023-05-16"),
      lastUpdated: new Date("2023-05-16"),
    },
    {
      id: 3,
      name: "Carbon Fiber Fishing Rod",
      note: "7ft medium action",
      quantity: 1,
      unitPrice: 149.95,
      selectUnit: "piece",
      unitSize: 1,
      total: 149.95,
      dateCreated: new Date("2023-05-17"),
      lastUpdated: new Date("2023-05-17"),
    },
    {
      id: 4,
      name: "Waterproof Tackle Box",
      note: "Large capacity with 3 trays",
      quantity: 3,
      unitPrice: 45.00,
      selectUnit: "piece",
      unitSize: 1,
      total: 135.00,
      dateCreated: new Date("2023-05-18"),
      lastUpdated: new Date("2023-05-18"),
    },
    {
      id: 5,
      name: "Fishing Line (300yds)",
      note: "20lb test, braided",
      quantity: 4,
      unitPrice: 24.99,
      selectUnit: "roll",
      unitSize: 1,
      total: 99.96,
      dateCreated: new Date("2023-05-19"),
      lastUpdated: new Date("2023-05-19"),
    },
    {
      id: 6,
      name: "Fishing Lures Set",
      note: "12-piece assorted colors",
      quantity: 2,
      unitPrice: 18.75,
      selectUnit: "set",
      unitSize: 1,
      total: 37.50,
      dateCreated: new Date("2023-05-20"),
      lastUpdated: new Date("2023-05-20"),
    },
    {
      id: 7,
      name: "Fishing Waders",
      note: "Breathable, size L",
      quantity: 1,
      unitPrice: 129.99,
      selectUnit: "pair",
      unitSize: 1,
      total: 129.99,
      dateCreated: new Date("2023-05-21"),
      lastUpdated: new Date("2023-05-21"),
    },
    {
      id: 8,
      name: "Fishing Net",
      note: "Rubber-coated, extendable handle",
      quantity: 1,
      unitPrice: 35.50,
      selectUnit: "piece",
      unitSize: 1,
      total: 35.50,
      dateCreated: new Date("2023-05-22"),
      lastUpdated: new Date("2023-05-22"),
    },
    {
      id: 9,
      name: "Fishing Pliers",
      note: "Stainless steel with line cutter",
      quantity: 2,
      unitPrice: 22.99,
      selectUnit: "piece",
      unitSize: 1,
      total: 45.98,
      dateCreated: new Date("2023-05-23"),
      lastUpdated: new Date("2023-05-23"),
    },
    {
      id: 10,
      name: "Fishing Hat",
      note: "UV protection, adjustable",
      quantity: 3,
      unitPrice: 19.99,
      selectUnit: "piece",
      unitSize: 1,
      total: 59.97,
      dateCreated: new Date("2023-05-24"),
      lastUpdated: new Date("2023-05-24"),
    }

  ]); // Stores the items in the inventory
  const [outItems, setOutItems] = useState<OrderItem[]>([]); // For when item is out, it creates a copy of the modified item from the inventory and stores it

  console.log(outItems)

  const handleAddProduct = async (newProduct: ItemFormData) => {
    const addedItem = await addInventoryItem(newProduct);

    setInventoryItems((prevItems) => [...prevItems, addedItem]);
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
    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    const matchesSearch = [
      item.name?.toLowerCase(),
      item.note?.toLowerCase(),
      item.quantity?.toString(),
      item.unitPrice?.toString(),
      item.selectUnit?.toLowerCase(),
      item.unitSize?.toString(),
      item.total?.toString(),
      item.dateCreated?.toISOString().toLowerCase(),
    ].some((field) => field?.includes(lowerCaseSearchQuery));

    return matchesSearch;
  });

  return (
    <div className="flex-1 p-0 ">
      <PageTitle title="Main Inventory" />
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
