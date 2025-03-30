import { useState, useEffect } from "react";
import { fetchInventory } from "../api/inventoryAPI";

export const useInventory = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await fetchInventory();
      setInventory(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { inventory, loading, error, reloadInventory: loadInventory };
};
