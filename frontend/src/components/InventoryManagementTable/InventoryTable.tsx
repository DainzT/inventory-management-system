import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { InventoryItem } from "@/types";

interface InventoryTableProps {
  items?: InventoryItem[]; 
  onOut?: () => void;
  onEdit?: () => void;
}

export const InventoryTable = ({ 
  items = [],
  onOut,
  onEdit, 
}: InventoryTableProps) => {
  const inventoryItems: InventoryItem[] = items;
  
  return (
    <section>
      <TableHeader />
      <div className="p-[24px] flex flex-col gap-[24px]">
        {inventoryItems.map((item) => (
          <TableRow
            key={item.id}
            {...item}
            onOut={onOut}
            onEdit={onEdit}
          />
        ))}
      </div>
    </section>
  );
}
