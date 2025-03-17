import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";

interface InventoryItemsProps {
  id: number;
  productName: string;
  note: string;
  quantity: number | "";
  unitPrice: number | "";
  selectUnit: string;
  unitSize: number | "";
  total?: number | "";
}

interface InventoryTableProps {
  items?: InventoryItemsProps[]; 
  onOut?: () => void;
  onEdit?: () => void;
}

export const InventoryTable = ({ 
  items = [],
  onOut,
  onEdit, 
}: InventoryTableProps) => {
  const inventoryItems: InventoryItemsProps[] = items;
  
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
