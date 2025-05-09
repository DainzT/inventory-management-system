import { useState } from 'react';
import { OrderItem } from '@/types/order-item';
import apiClient from '@/api/apiClient';
import { handleApiError } from '@/api/handleApiError';
import { deleteOrderItemAPI } from '@/api/orderAPI';
import { useToast } from "./useToast";

interface UpdateAssignedItemParams {
  id: number;
  quantity: number;
  fleet_id: number;
  boat_id: number;
  fleet_name?: string;
  boat_name?: string;
  archived?: boolean;
  note?: string;
}

export const useUpdateAssignedItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrderItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    showLoadingToast,
    showSuccessToast,
    showErrorToast,
} = useToast();

  const deleteOrderItem = async (id: number) => {
    setIsDeleting(true);
    setError(null);
    showLoadingToast("deleting-order", "Deleting order...");
    try {
      const result = await deleteOrderItemAPI(id);
      showSuccessToast("deleting-order", result.message);
      if (!result.success) {
        setError(result.message || "Failed to delete assigned item.");
        return { success: false, error: result.message };
      }

      return { success: true, message: result.message };
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Network error while deleting assigned item.");
      showErrorToast("deleting-order", error.message);
      return { success: false, error: error.message };
    } finally {
      setIsDeleting(false);
    }
  };

  const updateAssignedItem = async (params: UpdateAssignedItemParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const { id, ...updateData } = params;
      const response = await apiClient.put<{
        success: boolean;
        deleted?: boolean;
        data: OrderItem;
        message?: string;
        inventoryItemId?: number;
        restoredQuantity?: number;
      }>(`/modify-item/update/${id}`, {
        ...updateData,
        fleet_name: params.fleet_name,
        boat_name: params.boat_name
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update assigned item');
      }

      if (response.data.deleted) {
        return {
          success: true,
          deleted: true,
          message: response.data.message
        }
      };

      const updatedItem = {
        ...response.data.data,
        dateOut: response.data.data.outDate,
      };

      setData(updatedItem);
      return {
        success: true,
        data: updatedItem,
        message: response.data.message,
      }

    }

    catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateAssignedItem, isLoading, error, data,  deleteOrderItem, isDeleting };
};
