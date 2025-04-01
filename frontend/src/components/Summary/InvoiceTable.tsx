import { Boat, InventoryItem, Order } from "@/types";

interface ItemSummary {
  [key: number]: {
    item: InventoryItem;
    boats: Boat[];
    totalQuantity: number;
    totalPrice: number;
    orders: Order[];
  };
}

interface InvoiceTableProps {
  itemSummary: ItemSummary;
}

export const InvoiceTable = ({
  itemSummary,
}: InvoiceTableProps)  => {
  console.log(itemSummary)
  const pluralize = (unit: string, quantity: number): string => {
    if (quantity === 1) return unit;
    const irregularPlurals: Record<string, string> = {
      box: 'boxes',
      child: 'children',
    };
    return irregularPlurals[unit] || `${unit}s`;
  };
  return (
    <section>
      <div className="grid text-white bg-cyan-900  grid-cols-[90px_110px_130px_70px_100px_90px_150px] max-sm:hidden">
        <div className="text-sm font-semibold px-2 py-6 border-r text-center">Date Out</div>
        <div className="text-sm font-semibold px-5 py-6 border-r text-center">Product</div>
        <div className="text-sm font-semibold px-5 py-6 border-r text-center">Note</div>
        <div className="text-sm font-semibold text-center px-5 py-6 border-r">Qty</div>
        <div className="text-sm font-semibold text-right px-4 py-6 border-r">Unit Price</div>
        <div className="text-sm font-semibold text-center px-5 py-6 border-r">Total</div> 
        <div className="text-sm font-semibold text-center px-5 py-6">
          Assigned Boats
        </div>
      </div>
      {Object.values(itemSummary).length === 0 ? (
        <div className="p-4 text-center text-stone-500 font-bold justify-center items-center text-2xl">
          No existing orders during this month of the year.
        </div>
      ) : (
        Object.values(itemSummary).map((summary) => (
          <div
            key={`${summary.outDate.toISOString()}_${summary.item.id}`}
            className="text-sm grid border grid-cols-[90px_120px_120px_70px_100px_90px_150px] max-sm:grid-cols-1 max-sm:gap-2"
          >
            <div className="px-3 py-4 border-r">
              {new Date(summary.orders[0].outDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }).replace(/\//g, '/')}
            </div>
            <div className="mr-3 px-3 py-4 border-r">{summary.item.name}</div>
            <div className="text-stone-500 px-3 py-4 border-r">{summary.item.note}</div>
            <div className="text-center px-2 py-4 border-r"> {summary.totalQuantity} {pluralize(summary.item.selectUnit, summary.totalQuantity)}</div>
            <div className="text-right px-4 py-4 border-r"> ₱{Number(summary.item.unitPrice).toFixed(2)} / {summary.item.unitSize} {pluralize(summary.item.selectUnit, Number(summary.item.unitSize))}</div>
            <div className="text-center px-3 py-4 border-r">
              ₱{(summary.totalPrice).toFixed(2)}
            </div>
            <div className="flex flex-wrap gap-1 item-center justify-center mt-2">
              {summary.boats.map((boat: Boat) => (
                <span
                  key={`${boat.id}`}
                  className="px-2 py-0.5 text-xs text-blue-700 bg-sky-100 rounded-xl h-10 text-center"
                >
                  {boat.name} 
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
