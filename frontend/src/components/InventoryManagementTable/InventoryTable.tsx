import { TableRow } from "./TableRow";
import { HighlightedItem, InventoryItem } from "@/types";

interface InventoryTableProps {
  items: InventoryItem[]; 
  expandedItem: number | null;
  onToggleExpand: (id: number) => void;
  onOut: (item: InventoryItem) => void;
  onEdit: (item: InventoryItem) => void;
  searchQuery: string;
  highlightedItem?: HighlightedItem;
  itemRef?: React.RefObject<HTMLDivElement | null>;
  currentPage: number;
  itemsPerPage: number;
}

export const InventoryTable = ({ 
  items = [],
  expandedItem,
  onToggleExpand,
  onOut,
  onEdit, 
  searchQuery,
  highlightedItem,
  itemRef,
  itemsPerPage,
  currentPage,
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
            searchQuery={searchQuery}
            highlightedItem={highlightedItem}
            ref={highlightedItem?.id === item.id ? itemRef : null}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        ))}
    </section>
  );
}
