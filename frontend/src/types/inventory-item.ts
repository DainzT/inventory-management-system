export interface InventoryItem {
    id: number;
    productName: string;
    note: string;
    quantity: number | "";
    unitPrice: number | "";
    selectUnit: string;
    unitSize: number | "";
    total?: number | "";
  }
  