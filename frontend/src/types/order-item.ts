import { InventoryItem } from "./inventory-item";

export interface OrderItem {
  item_id: InventoryItem
  quantity: number | "";
  total: number | "";
  fleet_name: string;
  boat_name: string;
  outDate?: Date;
  lastUpdated?: Date;
}
