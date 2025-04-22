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
      dateOut: item.outDate,
    }));
  } catch (error) {
    const axiosError = error as AxiosError<{
      error?: string;
      message?: string;
    }>;

    if (axiosError.response) {
      const status = axiosError.response.status;
      const errorMessage =
        axiosError.response.data?.message ||
        axiosError.response.data?.error ||
        `Request failed with status ${status}`;
      console.error(`API Error [Status ${status}]:`, errorMessage);
      throw new Error(errorMessage);
    } else if (axiosError.request) {
      console.error(
        "No response received from server. Request details:",
        axiosError.request
      );
      throw new Error("No response received from server");
    } else {
      console.error("Request setup error:", axiosError.message);
      throw new Error(`Request setup error: ${axiosError.message}`);
    }
  }
};

export const updateArchivedStatus = async (orders: OrderItemProps[]) => {
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
    throw error;
  }
};
