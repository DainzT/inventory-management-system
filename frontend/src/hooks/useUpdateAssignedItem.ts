import { useState } from 'react';
import { ModifyOrderItem } from '@/api/orderAPI';
import { deleteOrderItem } from '@/api/orderAPI';
import { useToast } from "./useToast";

export const useUpdateAssignedItem = () => {
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const {
    showLoadingToast,
    showSuccessToast,
    showErrorToast,
  } = useToast();


  const handleDeleteOrderItem = async (id: number) => {
    setIsDeleting(true);
    setError(null);
    showLoadingToast("deleting-order", "Deleting order...");
    try {
      const result = await deleteOrderItem(id);
      showSuccessToast("deleting-order", result.message);
      return { success: true, message: result.message };
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Network error while deleting assigned item.");
      showErrorToast("deleting-order", error.message);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModifyItem = async (id: number, quantity: number, fleet_name: string, boat_name: string) => {
    setIsModifying(true);
    setError(null);
    showLoadingToast("editing-order", "Editing order...");
    try {
      const result = await ModifyOrderItem(id, {
        quantity,
        fleet_name,
        boat_name,
      })
      showSuccessToast("editing-order", result.message);
      return { success: true, message: result.message };
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Network error while deleting assigned item.");
      showErrorToast("editing-order", error.message);
      throw error;
    } finally {
      setIsModifying(false);
    }
  };

  return { handleModifyItem, isModifying, error, handleDeleteOrderItem, isDeleting };
};
