import { useState } from "react";
import {
    addInventoryItem,
    fetchInventoryItems,
    outInventoryItem,
    editInventoryItem,
    deleteInventoryitem,
} from "@/api/inventoryAPI";
import { InventoryItem, ItemFormData, OrderItem } from "@/types";
import { useToast } from "./useToast";

export const useInventory = () => {
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);;
    const [isAdding, setIsAdding] = useState(false);
    const [isOuting, setIsOuting] = useState(false);
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
            
            const message = error instanceof Error ? error.message : "Failed to load inventory";
            showErrorToast("loading-inventory", message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddProduct = async (newProduct: ItemFormData) => {
        console.log(newProduct)
        showLoadingToast("adding-product", "Adding product...");
        try {
            setIsAdding(true);
            await addInventoryItem(newProduct);

            showSuccessToast("adding-product", "Product added successfully!");

            const items = await fetchInventoryItems();
            setInventoryItems(items);
            setIsAddOpen(false);
        } catch (error) {
            console.error("Failed to add product:", error);

            const message = error instanceof Error ? error.message : "Failed to add product.";
            showErrorToast("adding-product", message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleOutItem = async (outItem: OrderItem) => {
        showLoadingToast("assigning-product", "Assigning product...");
        try {
            setIsOuting(true);
            const res = await outInventoryItem(outItem)

            showSuccessToast("assigning-product", res.message);

            const items = await fetchInventoryItems();
            setInventoryItems(items);
            setIsOutOpen(false);
        } catch (error) {
            console.error("Failed to assign product:", error);
            
            const message = error instanceof Error ? error.message : "Failed to assign product. Please try again."
            showErrorToast("assigning-product", message);

        } finally {
            setIsOuting(false);
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
        } catch (error) {
            console.error("Failed to Edit product:", error);

            const message = error instanceof Error ? error.message : "Failed to Edit product. Please try again."
            showErrorToast("editing-product", message);

        } finally {
            setIsEditing(false);
        }
    };

    const handleDeleteItem = async (id: number) => {
        showLoadingToast("deleting-product", "Updating product...");

        try {
            setIsDeleting(true);
            console.log(id)
            const res = await deleteInventoryitem(id);

            showSuccessToast("deleting-product", res.message);

            const items = await fetchInventoryItems();
            setInventoryItems(items);
            setIsEditOpen(false);
        } catch (error) {
            console.error("Failed to Delete product:", error);

            const message = error instanceof Error ? error.message : "Failed to delete product. Please try again."
            showErrorToast("deleting-product", message);

        } finally {
            setIsDeleting(false);
        }
    };


    return {
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
    };
};