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
    isOuting,
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
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
        isOuting={isOuting}
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
