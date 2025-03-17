import { InventoryButton } from "./InventoryButton";

interface TableRowProps {
    id: number;
    productName: string;
    note: string;
    quantity: number | "";
    unitPrice: number | "";
    selectUnit: string;
    unitSize: number | "";
    total?: number | "";
    onOut?: () => void;
    onEdit?: () => void;
  }

  export function TableRow({
    id,
    productName,
    note,
    quantity,
    unitPrice,
    selectUnit,
    unitSize,
    onOut,
    onEdit,
  }: TableRowProps) {
    return (
      <div className="flex items-center">
        <div className="w-[60px] text-[18px] text-[#1F2937]">
          {id}
        </div>
        <div className="w-[192px] text-[18px] font-bold text-[#1F2937]">
          {productName}
        </div>
        <div className="w-[286px] text-[18px] text-[#4B5563]">
          {note}
        </div>
        <div className="w-[130px] text-[18px] text-[#1F2937]">
          {quantity} {`${Number(quantity) > 1 && !/[sS]$/.test(selectUnit) ? `${selectUnit}s` : selectUnit}`}
        </div>
        <div className="w-[162px] text-[18px] text-[#1F2937]">
          ₱{typeof unitPrice === "number" ? unitPrice.toFixed(2) : "0.00"} per {unitSize} {`${Number(unitSize) > 1 && !/[sS]$/.test(selectUnit) ? `${selectUnit}s` : selectUnit}`}
        </div>
        <div className="flex-1">
          <InventoryButton 
            variant="actions" 
            onOut={onOut} onEdit={onEdit} 
          />
        </div>
      </div>
    );
  }
  