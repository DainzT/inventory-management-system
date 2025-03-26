import { InventoryItem, Order } from "@/types";

interface InvoiceTableProps {
  orders: Order[]
}

export const InvoiceTable = ({
  orders, 
}: InvoiceTableProps)  => {
  const itemSummary = orders.reduce((acc, order) => {
    const itemId = order.item_id.id;
    
    if (!acc[itemId]) {
      acc[itemId] = {
        item: order.item_id,
        totalQuantity: order.quantity,
        totalPrice: order.total,
        orders: [order]
      };
    } else {
      acc[itemId].totalQuantity += order.quantity;
      acc[itemId].totalPrice += order.total;
      acc[itemId].orders.push(order);
    }
    return acc;
  }, {} as Record<number, {
    item: InventoryItem;
    totalQuantity: number;
    totalPrice: number;
    orders: Order[];
  }>);

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
      <div className="grid px-3 py-4 text-white bg-cyan-900  grid-cols-[50px_1fr_1fr_100px_100px_100px_200px] max-sm:hidden">
        <div className="text-base font-semibold">No.</div>
        <div className="text-base font-semibold">Product</div>
        <div className="text-base font-semibold">Note</div>
        <div className="text-base font-semibold text-right">Qty</div>
        <div className="text-base font-semibold text-right">Unit Price</div>
        <div className="text-base font-semibold text-right">Total</div> 
        <div className="text-base font-semibold text-center">
          Assigned Boats
        </div>
      </div>
      {Object.values(itemSummary).map((summary, index) => (
        <div
          key={summary.item.id}
          className="grid px-3 py-4 border grid-cols-[50px_1fr_1fr_100px_100px_100px_200px] max-sm:grid-cols-1 max-sm:gap-2"
        >
          <div>{index + 1}</div>
          <div>{summary.item.name}</div>
          <div className="text-stone-500">{summary.item.note}</div>
          <div className="text-right"> {summary.totalQuantity} {pluralize(summary.item.selectUnit, summary.totalQuantity)}</div>
          <div className="text-right"> ₱{Number(summary.item.unitPrice).toFixed(2)} / {summary.item.unitSize} {pluralize(summary.item.selectUnit, Number(summary.item.unitSize))}</div>
          <div className="text-right">
            ₱{(summary.totalPrice / Number(summary.item.unitSize)).toFixed(2)}
          </div>
          <div className="flex flex-wrap gap-1">
            {summary.orders.map((order) => (
              <span
                key={`${order.id}-${order.boat_id.id}`}
                className="px-2 py-0.5 text-xs text-blue-700 bg-sky-100 rounded-xl"
              >
                {order.boat_id.name} ({order.fleet_id.name})
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
