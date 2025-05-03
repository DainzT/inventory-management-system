import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import InventoryManagementTable from "@/components/InventoryManagementTable/InventoryManagementTable";
import EditProductModal from "@/components/EditProductModal/EditProductModal";
import AddProductModal from "@/components/AddProductModal/AddProductModal";
import OutItemModal from "@/components/OutItemModal/OutItemModal";
import { PageTitle } from "@/components/PageTitle";

import { InventoryItem} from "@/types";
import { useInventory } from "@/hooks/useInventory";

const Inventory: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    inventoryItems,
    isLoading,
    isAdding,
    isAssigning,
    isEditing,
    isDeleting,
    isAddOpen,
    isOutOpen,
    isEditOpen,
    setIsAddOpen,
    setIsOutOpen,
    setIsEditOpen,
    loadInventoryItems,
    handleAddProduct,
    handleOutItem,
    handleEditItem,
    handleDeleteItem,
    highlightedItem,
  } = useInventory();

  useEffect(() => {
    loadInventoryItems();
  }, [])


  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredItems = inventoryItems.filter((item) => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    const matchesSearch = [
      item.name?.toString().toLowerCase(),
      item.note?.toString().toLowerCase(),
      item.quantity?.toString().toLowerCase(),
      item.unitPrice?.toString().toLowerCase(),
      item.selectUnit?.toLowerCase(),
      item.unitSize?.toString().toLowerCase(),
    ].some((field) => field?.includes(lowerCaseSearchQuery));

    return matchesSearch;
  });
  
  return (
    <div className="flex-1 p-0 overflow-auto">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      />
  
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
        isLoading={isLoading}
        searchQuery={searchQuery}
        highlightedItem={highlightedItem}
      />
      <AddProductModal
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        onAddItem={handleAddProduct}
        isAdding={isAdding}
      />
      <OutItemModal
        isOpen={isOutOpen}
        setIsOpen={setIsOutOpen}
        selectedItem={selectedItem}
        onOutItem={handleOutItem}
        isAssigning={isAssigning}
      />
      <EditProductModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        selectedItem={selectedItem}
        onEditItem={(item) => handleEditItem(item)}
        onDeleteItem={(id) => handleDeleteItem(id)}
        isEditing={isEditing}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Inventory;
