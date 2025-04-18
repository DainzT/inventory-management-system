import { TableRow } from "./TableRow";
import { InventoryItem } from "@/types";

interface InventoryTableProps {
  items: InventoryItem[]; 
  expandedItem: number | null;
  onToggleExpand: (id: number) => void;
  onOut: (item: InventoryItem) => void;
  onEdit: (item: InventoryItem) => void;
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
        {inventoryItems.map((item, index) => (
          <TableRow
            key={item.id}
            item={item}
            index={index}
            onOut={() => onOut(item)}
            onEdit={() => onEdit(item)}
            isExpanded={expandedItem === item.id}
            onToggle={onToggleExpand}
          />
        ))}
    </section>
  );
}
