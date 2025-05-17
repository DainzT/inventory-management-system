import React, { useEffect, useRef, useState } from "react";
import InventoryManagementTable from "@/components/InventoryManagementTable/InventoryManagementTable";
import EditProductModal from "@/components/EditProductModal/EditProductModal";
import AddProductModal from "@/components/AddProductModal/AddProductModal";
import OutItemModal from "@/components/OutItemModal/OutItemModal";
import { PageTitle } from "@/components/PageTitle";

import { InventoryItem } from "@/types";
import { useInventory } from "@/hooks/useInventory";
import { roundTo } from "@/utils/RoundTo";
import { pluralize } from "@/utils/Pluralize";

const Inventory: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const inventoryContainerRef = useRef<HTMLDivElement>(null);

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
    if (!searchQuery.trim()) return true;

    const lowerQuery = searchQuery.toLowerCase().trim();

    const quantityDisplay = `${roundTo(Number(item.quantity), 2)} ${pluralize(item.selectUnit, Number(item.quantity))}`;
    const priceDisplay = `₱${typeof item.unitPrice === "number" ? item.unitPrice.toFixed(2) : "0.00"}`;
    const unitDisplay = `${item.unitSize} ${pluralize(item.selectUnit, Number(item.unitSize))}`;
    const pricePerUnitDisplay = `${priceDisplay} / ${unitDisplay}`;

    const searchableFields = [
      item.name?.toLowerCase(),
      item.note?.toLowerCase().slice(0, 46),

      item.quantity?.toString(),
      roundTo(Number(item.quantity), 2).toString(),
      quantityDisplay,
      pluralize(item.selectUnit, Number(item.quantity)),
      item.selectUnit,

      item.unitPrice?.toString(),
      priceDisplay.replace('₱', ''),
      priceDisplay,

      item.unitSize?.toString(),
      unitDisplay,
      pricePerUnitDisplay,

      `${item.quantity} ${item.selectUnit}`.toLowerCase(),
      `${roundTo(Number(item.quantity), 2)} ${item.selectUnit}`.toLowerCase()
    ].filter(Boolean).map(f => f.toString().toLowerCase());


    return searchableFields.some(field => field.includes(lowerQuery));
  });

  return (
    <div
      ref={inventoryContainerRef}
      className="flex-1 p-0 overflow-auto "
    >
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
        containerRef={inventoryContainerRef}
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
