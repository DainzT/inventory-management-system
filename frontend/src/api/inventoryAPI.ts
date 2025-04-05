import { AxiosError } from "axios";
import apiClient from "./apiClient";
import { InventoryItem, ItemFormData } from "@/types";

const handleApiError = (error: unknown) => {
  const axiosError = error as AxiosError<{ error?: string; message?: string }>;

  if (axiosError.response) {
    // Client Side Error or Server Side Error
    // HTTP STATUS 400-499 (4xx: Client error),  HTTP STATUS 500-599 (5xx: Server error)
    const errorMessage =
      axiosError.response.data?.message ||
      axiosError.response.data?.error ||
      `Request failed with status ${axiosError.response.status}`;
    console.error("API Error:", errorMessage);
    throw new Error(errorMessage);

  } else if (axiosError.request) {
    // Server Side Error
    // Request sent but server did not respond.
    console.error("No response received from server");
    throw new Error("No response received from server");

  } else {
    // The request was never sent due to incorrect setup (e.g., invalid URL, request aborted)
    console.error("Request setup error:", axiosError.message);
    throw new Error(`Request setup error: ${axiosError.message}`);
  }
}

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

