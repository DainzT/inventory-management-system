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
    
    console.log("Response from API:", response.data);
    return response.data;
  } catch (error) {
    // const axiosError = error as AxiosError<{ error?: string }>;

    // if (axiosError.response) {
    //   const errorMessage = axiosError.response.data?.error ||
    //     `Request failed with status ${axiosError.response.status}`;
    //   throw new Error(errorMessage);
    // } else if (axiosError.request) {
    //   throw new Error('No response received from server');
    // } else {
    //   throw new Error(`Request setup error: ${axiosError.message}`);
    // }
    console.error("Error adding item:", error)
    throw new Error("Failed to add inventory item"); 
  }
};