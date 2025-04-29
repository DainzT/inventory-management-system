import { Boat } from  "./summary-item"
import { Fleet } from "./summary-item";

export interface OrderItem {
  id: number;
  name: string;
  note: string;
  quantity: number | "";
  unitPrice: number | "";
  selectUnit: string | "";
  unitSize: number | "";
  total: number | "";
  fleet: Fleet;
  boat: Boat;
  archived: boolean;
  outDate: Date;
  lastUpdated?: Date;
}
