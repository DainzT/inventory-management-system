import { useState } from "react";

export function useDeleteOrder() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteOrderItem = async (id: number) => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/modify-item/delete/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to delete assigned item.");
        console.error("Delete error:", result.error);
        return { success: false, error: result.error };
      }

      return { success: true, message: result.message };

    } catch (err) {
      console.error("Network error:", err);
      setError("Network error while deleting assigned item.");
      return { success: false, error: "Network error" };

    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteOrderItem, isDeleting, error };
}
