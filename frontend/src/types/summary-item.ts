import { OrderItem } from "./order-item";

export interface Fleet {
  id: number;
  fleet_name: string;
}

export interface Boat {
  id: number;
  boat_name: string;
  fleet_id: number; // foreign key to fleet
}

export interface GroupedOrders {
  boatId: number;
  boatName: string;
  orders: OrderItem[];
  isContinued?: boolean;
}