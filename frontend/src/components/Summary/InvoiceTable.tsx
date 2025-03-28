import { InventoryItem, Order } from "@/types";

interface ItemSummary {
  [key: number]: {
    item: InventoryItem;
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
      <div className="grid px-5 py-4 text-white bg-cyan-900  grid-cols-[50px_1fr_1fr_100px_100px_100px_200px] max-sm:hidden">
        <div className="text-base font-semibold">No.</div>
        <div className="text-base font-semibold">Product</div>
        <div className="text-base font-semibold">Note</div>
        <div className="text-base font-semibold text-center">Qty</div>
        <div className="text-base font-semibold text-right">Unit Price</div>
        <div className="text-base font-semibold text-center">Total</div> 
        <div className="text-base font-semibold text-center">
          Assigned Boats
        </div>
      </div>
      {Object.values(itemSummary).length === 0 ? (
        <div className="p-4 text-center text-stone-500 font-bold justify-center items-center text-2xl">
          No existing orders during this month of the year.
        </div>
      ) : (
        Object.values(itemSummary).map((summary, index) => (
          <div
            key={summary.item.id}
            className="grid px-5 py-4 border grid-cols-[50px_1fr_1fr_100px_100px_100px_200px] max-sm:grid-cols-1 max-sm:gap-2"
          >
            <div>{index + 1}</div>
            <div className="mr-3">{summary.item.name}</div>
            <div className="text-stone-500">{summary.item.note}</div>
            <div className="text-center"> {summary.totalQuantity} {pluralize(summary.item.selectUnit, summary.totalQuantity)}</div>
            <div className="text-right"> ₱{Number(summary.item.unitPrice).toFixed(2)} / {summary.item.unitSize} {pluralize(summary.item.selectUnit, Number(summary.item.unitSize))}</div>
            <div className="text-center">
              ₱{(summary.totalPrice / Number(summary.item.unitSize)).toFixed(2)}
            </div>
            <div className="flex flex-wrap gap-1">
              {summary.orders.map((order: Order) => (
                <span
                  key={`${order.id}-${order.boat_id.id}`}
                  className="px-2 py-0.5 text-xs text-blue-700 bg-sky-100 rounded-xl"
                >
                  {order.boat_id.name} ({order.fleet_id.name})
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
