import { GroupedOrders } from "@/types";
import { pluralize } from "@/utils/Pluralize";

interface InvoiceTableProps {
  itemSummary: GroupedOrders[];
}

export const InvoiceTable = ({
  itemSummary,
}: InvoiceTableProps) => {
  return (
    <section className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="top-0 z-10 grid text-white  bg-cyan-900 grid-cols-[95px_120px_140px_90px_140px_160px] text-sm">
        <div className="px-3 py-4 font-medium text-center border-r border-cyan-1000">Date Out</div>
        <div className="px-3 py-4 font-medium text-center border-r border-cyan-1000">Product</div>
        <div className="px-3 py-4 font-medium text-center border-r border-cyan-1000">Note</div>
        <div className="px-3 py-4 font-medium text-center border-r border-cyan-1000">Qty</div>
        <div className="px-3 py-4 font-medium text-center border-r border-cyan-1000">Unit Price</div>
        <div className="px-3 py-4 font-medium text-center border-r border-cyan-1000">Total</div>
      </div>
      {itemSummary.length === 0 ? (
        <div className="p-8 text-center text-gray-500 font-medium text-lg">
          No existing orders during this month of the year.
        </div>
      ) : (
        itemSummary.map((group) => (
          <div key={`group-${group.boatId}`} className="contents">
            <div className="flex items-center bg-gray-50 px-4 py-3 border-b border-t border-r border-l border-gray-400">
              <span className="font-semibold text-cyan-700 text-sm">
                {group.boatName}
              </span>
              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {group.orders.length} {group.orders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>
            <div className="overflow-hidden border border-gray-400">
              {group.orders.map((order) => (
                <div
                  key={`${order.id}_${order.outDate.toISOString()}`}
                  className="grid grid-cols-[95px_130px_130px_90px_140px_160px] text-sm even:bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="px-3 py-4 border-r border-gray-400">
                    {new Date(order.outDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }).replace(/\//g, '/')}
                  </div>
                  <div
                    className="
                      mr-3 px-3 py-4 border-r text-center border-gray-400  
                      shrink-0 break-all overflow-hidden hyphens-auto
                    ">
                    {order.name}
                  </div>
                  <div 
                    className="
                      text-stone-500 px-3 py-4 border-r border-gray-400
                      shrink-0 break-all overflow-hidden hyphens-auto
                  ">
                    {order.note}
                  </div>
                  <div
                    className="
                      text-center px-2 py-4 border-r border-gray-400
                      shrink-0 break-all overflow-hidden hyphens-auto
                  ">
                    {order.quantity} {pluralize(order.selectUnit, Number(order.quantity))}
                  </div>
                  <div
                    className="
                      px-4 py-4 border-r border-gray-400
                      shrink-0 break-all overflow-hidden hyphens-auto
                  ">
                    ₱{Number(order.unitPrice).toFixed(2)} / {order.unitSize} {pluralize(order.selectUnit, Number(order.unitSize))}
                  </div>
                  <div
                    className="
                      text-center px-3 py-4 border-r border-gray-400
                      shrink-0 break-all overflow-hidden hyphens-auto  
                  ">
                    ₱{(Number(order.total)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
