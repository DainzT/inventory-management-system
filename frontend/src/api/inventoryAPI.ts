import { AxiosError } from "axios";
import apiClient from "./apiClient";
import { InventoryItem, ItemFormData } from "@/types";

// export const fetchInventory = async () => {
//   const token = localStorage.getItem("token");
//   if (!token) throw new Error("No token found. Please log in.");

//   const res = await fetch("http://localhost:5000/api/inventory-item", {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch inventory data");
//   }

//   return res.json();
// };

export const addInventoryItem = async (
  item: ItemFormData
): Promise<InventoryItem> => {
  try {
    
    const response = await apiClient.post('/inventory-item/add-item', item);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;

    if (axiosError.response) {
      // Client Side Error or Server Side Error
      // HTTP STATUS 400-499 (4xx: Client error),  HTTP STATUS 500-599 (5xx: Server error)
      const errorMessage =
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
};

