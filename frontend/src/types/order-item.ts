export interface OrderItem {
  name: string;
  note: string;
  quantity: number | "";
  unitPrice: number | "";
  selectUnit: string;
  unitSize: number | "";
  total: number | "";
  fleet: string;
  boat: string;
  outDate?: Date;
  lastUpdated?: Date;
}
