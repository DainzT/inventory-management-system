import { InventoryItem } from "./inventory-item";

export interface OrderItem {
  item_id: InventoryItem;

  name: string;
  note: string;
  quantity: number;
  unitPrice: number;
  selectUnit: string;
  unitSize: number;
  total: number;

  fleet_name: string;
  boat_name: string;
  outDate?: Date;
  lastUpdated?: Date;
}
