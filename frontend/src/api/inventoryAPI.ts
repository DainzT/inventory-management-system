import apiClient from "./apiClient";
import { handleApiError } from "./handleApiError";
import { InventoryItem, ItemFormData, OutItemData } from "@/types";

type InventoryResponse = {
  message: string;
};

export const fetchInventoryItems = async (
): Promise<InventoryItem[]> => {
  try {

    const response = await apiClient.get<{
      success: boolean;
      data: InventoryItem[]
    }>('/inventory-item/get-items');

    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Invalid API response format");
    }

    return response.data.data.map(item => ({
      ...item,
      dateCreated: new Date(item.dateCreated),
      lastUpdated: item.lastUpdated ? new Date(item.lastUpdated) : undefined,
    }));

  } catch (error) {
    
    const err = error as Error & { response?: { status: number }; message?: string };

    if (
      err.response?.status === 404 ||
      err.message?.includes("Inventory is empty")
    ) {
      return [];
    }

    return handleApiError(error);

  }
};

export const addInventoryItem = async (
  item: ItemFormData
): Promise<InventoryItem> => {
  try {

    const response = await apiClient.post('/inventory-item/add-item', item);
    return response.data;

  } catch (error) {
    return handleApiError(error);

  }
};

export const outInventoryItem = async (
  item: OutItemData
): Promise<InventoryResponse> => {
  try {

    const response = await apiClient.post('/inventory-item/assign-item', item);
    return response.data;

  } catch (error) {
    return handleApiError(error);

  }
}

export const editInventoryItem = async (
  item: InventoryItem
): Promise<InventoryResponse> => {
  try {

    const response = await apiClient.put(`/inventory-item/update-item/${item.id}`, item);
    return response.data;

  } catch (error) {
    return handleApiError(error);

  }
};

export const deleteInventoryitem = async (
  id: number
): Promise<InventoryResponse> => {
  try {

    const response = await apiClient.delete(`/inventory-item/remove-item/${id}`);
    return response.data;

  } catch (error) {
    return handleApiError(error);

  }
}