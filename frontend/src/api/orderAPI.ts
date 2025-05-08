import { handleApiError } from "./handleApiError";
import apiClient from "./apiClient";
import { OrderItem } from "@/types/order-item";

export const fetchAssignedItems = async (): Promise<OrderItem[]> => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      data: OrderItem[];
    }>("/assigned-item/assign-item");

    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Invalid API response format");
    }

    return response.data.data.map((item) => ({
      ...item,
      dateOut: item.outDate,
    }));
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateArchivedStatus = async (orders: OrderItem[]) => {
  try {

    const response = await apiClient.post("/assigned-item/update-archive", {
      orders,
    });
    if (!response.data.success) {
      throw new Error("Failed to update archived status");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating archived status:", error);
    return handleApiError(error);
  }
};

export const deleteOrderItemAPI = async (
  id: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/modify-item/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order item:", error);
    return handleApiError(error);
  }
};