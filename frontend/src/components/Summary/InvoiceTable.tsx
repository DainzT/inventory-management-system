import { InvoiceItem } from "./types";

interface InvoiceTableProps {
  items: InvoiceItem[];
}

export const InvoiceTable = ({ items }: InvoiceTableProps)  => {
  return (
    <section>
      <div className="grid px-3 py-4 text-white bg-cyan-900 rounded grid-cols-[50px_1fr_1fr_100px_100px_100px_200px] max-sm:hidden">
        <div className="text-base font-semibold">No.</div>
        <div className="text-base font-semibold">Product</div>
        <div className="text-base font-semibold">Description</div>
        <div className="text-base font-semibold text-right">Qty</div>
        <div className="text-base font-semibold text-right">Unit Price</div>
        <div className="text-base font-semibold text-right">Total</div>
        <div className="text-base font-semibold text-center">
          Assigned Boats
        </div>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="grid px-3 py-4 border border grid-cols-[50px_1fr_1fr_100px_100px_100px_200px] max-sm:grid-cols-1 max-sm:gap-2"
        >
          <div>{item.id}.</div>
          <div>{item.name}</div>
          <div className="text-stone-500">{item.desc}</div>
          <div className="text-right">{item.qty}</div>
          <div className="text-right">${item.price}</div>
          <div className="text-right">
            ${(item.qty * item.price).toFixed(2)}
          </div>
          <div className="flex flex-wrap gap-1">
            {item.boats.map((boat) => (
              <span
                key={boat}
                className="px-2 py-0.5 text-xs text-blue-700 bg-sky-100 rounded-xl"
              >
                {boat}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
