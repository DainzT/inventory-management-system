import { Boat, Fleet } from "./summary-item";

export interface NavigationItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export interface OrderItemProps {
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
  outDate: Date | string;
  onModify?: (id: number) => void;
}
