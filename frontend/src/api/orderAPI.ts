import { AxiosError } from "axios";
import apiClient from "./apiClient";
import { OrderItemProps } from "@/types/fleet-order";

export const fetchAssignedItems = async (): Promise<OrderItemProps[]> => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      data: OrderItemProps[];
    }>("/assigned-item/assign-item");

    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Invalid API response format");
    }

    return response.data.data.map((item) => ({
      ...item,
      dateOut: item.dateOut,
    }));
  } catch (error) {
    const axiosError = error as AxiosError<{
      error?: string;
      message?: string;
    }>;

    if (axiosError.response) {
      const errorMessage =
        axiosError.response.data?.message ||
        axiosError.response.data?.error ||
        `Request failed with status ${axiosError.response.status}`;
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    } else if (axiosError.request) {
      console.error("No response received from server");
      throw new Error("No response received from server");
    } else {
      console.error("Request setup error:", axiosError.message);
      throw new Error(`Request setup error: ${axiosError.message}`);
    }
  }
};
