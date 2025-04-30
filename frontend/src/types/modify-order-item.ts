import { InventoryItem } from "./inventory-item";
import { Boat, Fleet } from "./summary-item";

export interface ModifyOrderItem {
    inventory: InventoryItem | null;
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
    lastUpdated?: Date;
}
