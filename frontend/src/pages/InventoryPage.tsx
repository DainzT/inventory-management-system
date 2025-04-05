import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import InventoryManagementTable from "@/components/InventoryManagementTable/InventoryManagementTable";
import EditProductModal from "@/components/EditProductModal/EditProductModal";
import AddProductModal from "@/components/AddProductModal/AddProductModal";
import OutItemModal from "@/components/OutItemModal/OutItemModal";
import { PageTitle } from "@/components/PageTitle";

import { InventoryItem, ItemFormData, OrderItem } from "@/types";
import { addInventoryItem, fetchInventoryItems } from "@/api/inventoryAPI";

const Inventory: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOutOpen, setIsOutOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setOutItems] = useState<OrderItem[]>([]); // For when item is out, it creates a copy of the modified item from the inventory and stores it

  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]); // Stores the items in the inventory

  useEffect(() => {
    const loadInventoryItems = async () => {
      toast.loading("Loading inventory...", {
        position: "top-center",
        toastId: "loading-inventory",
      });
      try {
        setIsLoading(true);
        const items = await fetchInventoryItems();

        toast.update("loading-inventory", {
          render: `Loaded ${items.length} ${items.length > 1 ? "items" : "item"} successfully`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
          hideProgressBar: false,
        });

        setInventoryItems(items);
      } catch (error) {
        console.error("Failed to fetch inventory items:", error);

        toast.update("loading-inventory", {
          render: error instanceof Error ? error.message : "Failed to load inventory",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: false,
        });

      } finally {
        setIsLoading(false);
      }
    };

    loadInventoryItems();
  }, []);

  const handleAddProduct = async (newProduct: ItemFormData) => {
    toast.loading("Adding product...", {
      position: "top-center",
      toastId: "adding-product",
    });
    try {
      setIsAdding(true);
      await addInventoryItem(newProduct);

      toast.update("adding-product", {
        render: "Product added successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
      });

      const items = await fetchInventoryItems();
      setInventoryItems(items);
      setIsAddOpen(false);
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.update("adding-product", {
        render: "Failed to add product. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
      });

    } finally {
      setIsAdding(false);
    }
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
