import { InventoryItem } from "./inventory-item";

export interface Fleet {
    id: number;
    name: string;
  }
  
  export interface Boat {
    id: number;
    name: string;
    fleet_id: number; // foreign key to fleet
  }

  export interface Order {
    id: number;
    item_id: InventoryItem; // foreign key to inventory item
    fleet_id: Fleet; // foreign key to fleet
    boat_id: Boat;  // foreign key to boat
    processed?: boolean; //if false, displays in the order table of the current month| if true, happens when a new month starts it archives the previous month and only display at monthly summary
    quantity: number;
    total: number;
    outDate: Date;
    lastUpdated: Date | null;
  }