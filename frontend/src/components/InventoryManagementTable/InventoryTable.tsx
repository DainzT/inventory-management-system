import { TableRow } from "./TableRow";
import { InventoryItem } from "@/types";

interface InventoryTableProps {
  items: InventoryItem[]; 
  expandedItem: number | null;
  onToggleExpand: (id: number) => void;
  onOut: (item: InventoryItem) => void;
  onEdit?: () => void;
}

export const InventoryTable = ({ 
  items = [],
  expandedItem,
  onToggleExpand,
  onOut,
  onEdit, 
}: InventoryTableProps) => {
  const inventoryItems: InventoryItem[] = items;

  return (
      <section>  
        {inventoryItems.map((item) => (
          <TableRow
            key={item.id}
            item={item}
            onOut={() => onOut(item)}
            onEdit={onEdit}
            isExpanded={expandedItem === item.id}
            onToggle={onToggleExpand}
          />
        ))}
    </section>
  );
}
