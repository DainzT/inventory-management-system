import { InventoryItem } from "./inventory-item";
import { Boat, Fleet } from "./summary-item";

export interface NavigationItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export interface OrderItemProps {
  id: number;
  item: InventoryItem;
  quantity: number | "";
  total: number | "";
  fleet: Fleet;
  boat: Boat;
  outDate: Date | string;
  onModify?: (id: number) => void;
}
