import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { InventoryItem } from "@/types";

interface InventoryTableProps {
  items: InventoryItem[]; 
  expandedItem: number | null;
  onToggleExpand: (id: number) => void;
  onOut?: () => void;
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
      <TableHeader />
      <div className="flex flex-col">
        {inventoryItems.map((item) => (
          <TableRow
            key={item.id}
            item={item}
            onOut={onOut}
            onEdit={onEdit}
            isExpanded={expandedItem === item.id}
            onToggle={onToggleExpand}
          />
        ))}
      </div>
    </section>
  );
}
