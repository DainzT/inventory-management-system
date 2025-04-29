import { Boat, Fleet } from "./summary-item";

export interface ModifyOrderItem {
    id: number;
    name: string;
    note: string;
    quantity: number;
    unitPrice: number;
    fleet: Fleet
    boat: Boat;
    currentQuantity: number;
} 
