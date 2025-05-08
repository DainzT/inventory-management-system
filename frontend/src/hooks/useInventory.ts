import { useState } from "react";
import {
    addInventoryItem,
    fetchInventoryItems,
    outInventoryItem,
    editInventoryItem,
    deleteInventoryitem,
} from "@/api/inventoryAPI";
import { InventoryItem, ItemFormData, OutItemData } from "@/types";
import { useToast } from "./useToast";
import { HighlightedItem, HighlightType } from "@/types";

export const useInventory = () => {
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);;
    const [isAdding, setIsAdding] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isOutOpen, setIsOutOpen] = useState(false);

    const {
        showLoadingToast,
        showSuccessToast,
        showErrorToast,
    } = useToast();

    const [highlightedItem, setHighlightedItem] = useState<HighlightedItem>(null);

    // Function to highlight and handle item focus
    const focusItem = (itemId: number, type: HighlightType) => {

        setHighlightedItem({ id: itemId, type });
        
        setTimeout(() => {
            setHighlightedItem(null);
        }, 3000);
    };

    const loadInventoryItems = async () => {
        showLoadingToast("loading-inventory", "Loading inventory...");
        try {
            setIsLoading(true);
            const items = await fetchInventoryItems();

            showSuccessToast(
                "loading-inventory",
                `Loaded ${items.length} ${items.length > 1 ? "items" : "item"} successfully`
            );

            setInventoryItems(items);
        } catch (error) {
            console.error("Failed to fetch inventory items:", error);
            let message = "Failed to load inventory";
            if (error instanceof Error) {
                if (error.message === "No response received from server" ||
                    error.message === "Failed to fetch items from inventory" ||
                    error.message.includes("Network Error")) {
                    message = "Network error. Please check your internet connection.";
                } else {
                    message = error.message;
                }
            }

            showErrorToast("loading-inventory", message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddProduct = async (newProduct: ItemFormData) => {

        showLoadingToast("adding-product", "Adding product...");
        try {
            setIsAdding(true);
            const res = await addInventoryItem(newProduct);

            showSuccessToast("adding-product", res.message);
            
            const items = await fetchInventoryItems();
            setInventoryItems(items);
            setIsAddOpen(false);

            const newItem = res.data

            if (newItem) {
                focusItem(newItem.id, 'added');
            }

        } catch (error) {
            console.error("Failed to add product:", error);

            let message = "Failed to add product.";
            if (error instanceof Error) {
                if (error.message === "No response received from server" ||
                    error.message === "Failed to add item to inventory" ||
                    error.message.includes("Network Error")) {
                    message = "Network error - unable to connect to server. Please check your connection.";
                } else {
                    message = error.message;
                }
            }
            showErrorToast("adding-product", message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleOutItem = async (outItem: OutItemData) => {
        showLoadingToast("assigning-product", "Assigning product...");
        try {
            setIsAssigning(true);
            const res = await outInventoryItem(outItem)

            showSuccessToast("assigning-product", res.message);

            const items = await fetchInventoryItems();
            setInventoryItems(items);
            setIsOutOpen(false);

            if (res.data) {
                focusItem(outItem.item_id.id, 'assigned');
            }

        } catch (error) {
            console.error("Failed to assign product:", error);

            let message = "Failed to assign product. Please try again.";
            if (error instanceof Error) {
                if (error.message === "No response received from server" ||
                    error.message === "Failed to assign item" ||
                    error.message.includes("Network Error")) {
                    message = "Network error - unable to connect to server. Please check your connection.";
                } else {
                    message = error.message;
                }
            }
            showErrorToast("assigning-product", message);

        } finally {
            setIsAssigning(false);
        }
    };

    const handleEditItem = async (updatedItem: InventoryItem) => {
        showLoadingToast("editing-product", "Updating product...");
        try {
            setIsEditing(true);
            const res = await editInventoryItem(updatedItem)

            showSuccessToast("editing-product", res.message);

            const items = await fetchInventoryItems();
            setInventoryItems(items);
            setIsEditOpen(false);

            const newItem = res.data

            if (newItem) {
                focusItem(newItem.id, 'edited');
            }

        } catch (error) {
            console.error("Failed to Edit product:", error);

            let message = "Failed to Edit product. Please try again.";
            if (error instanceof Error) {
                if (error.message === "No response received from server" ||
                    error.message === "Failed to edit item" ||
                    error.message.includes("Network Error")) {
                    message = "Network error - unable to connect to server. Please check your connection.";
                } else {
                    message = error.message;
                }
            }

            showErrorToast("editing-product", message);

        } finally {
            setIsEditing(false);
        }
    };

    const handleDeleteItem = async (id: number) => {
        showLoadingToast("deleting-product", "Updating product...");

        try {
            setIsDeleting(true);

            const res = await deleteInventoryitem(id);

            showSuccessToast("deleting-product", res.message);

            const items = await fetchInventoryItems();
            setInventoryItems(items);
            setIsEditOpen(false);
        } catch (error) {
            console.error("Failed to Delete product:", error);

            let message = "Failed to delete product. Please try again.";
            if (error instanceof Error) {
                if (error.message === "No response received from server" ||
                    error.message === "Failed to delete item" ||
                    error.message.includes("Network Error")) {
                    message = "Network error - unable to connect to server. Please check your connection.";
                } else {
                    message = error.message;
                }
            }

            showErrorToast("deleting-product", message);

        } finally {
            setIsDeleting(false);
        }
    };


    return {
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
    };
};