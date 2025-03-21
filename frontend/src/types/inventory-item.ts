export interface InventoryItem {
    id: number;
    name: string;
    note: string;
    quantity: number | "";
    unitPrice: number | "";
    selectUnit: string;
    unitSize: number | "";
    total: number | "";
    dateCreated: Date;
    lastUpdated?: Date;
  }

  