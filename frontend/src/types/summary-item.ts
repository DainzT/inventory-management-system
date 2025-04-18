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

  // Snapshot of inventory Item
  name: string;
  note: string;
  quantity: number;
  unitPrice: number;
  selectUnit: string
  unitSize: number;
  total: number;

  // Assignment metadata
  fleet_id: Fleet;
  boat_id: Boat;
  archived: boolean;
  outDate: Date;
  lastUpdated?: Date;
}

export interface GroupedOrders {
  boatId: number;
  boatName: string;
  orders: Order[];
}