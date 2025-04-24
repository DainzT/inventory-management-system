import { Boat } from  "./summary-item"
import { Fleet } from "./summary-item";
import { InventoryItem } from "./inventory-item";

export interface OrderItem {
  id: number;
  name: string;
  note: string;
  currentStock: InventoryItem;
  quantity: number | "";
  unitPrice: number | "";
  selectUnit: string | "";
  unitSize: number | "";
  total: number | "";
  fleet: Fleet;
  boat: Boat;
  archived: boolean;
  outDate: Date | string;
  lastUpdated: Date | string;

}
