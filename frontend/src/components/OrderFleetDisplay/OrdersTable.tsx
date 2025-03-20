import React from "react";
import { OrderItemProps } from "@/types/FleetsOrder";
import { SearchBar } from "./SearchBar";
import { FilterDropdown } from "./FilterDropdown";

interface OrdersTableProps {
  orders: OrderItemProps[];
  onSearch?: (query: string) => void;
  onFilter?: (filter: string) => void;
  onModify?: (id: number) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onSearch,
  onFilter,
  onModify,
}) => {
  const filterOptions = [
    "All Boats",
    "F/B Donya Donya",
    "F/B Doña Librada",
    "F/B Lady Rachelle",
    "F/B Mariella",
    "F/B My Shield",
    "F/B Abigail",
    "F/B DC-9",
    "F/B Adomar",
    "F/B Prince of Peace",
    "F/B Ruth Gaily",
    "F/V Vadeo Scout",
    "F/B Mariene",
  ];

  return (
    <section className="flex-1 bg-white rounded-xl border border shadow-sm">
      <div className="flex gap-5 p-8">
        <SearchBar onSearch={onSearch} />
        <FilterDropdown
          label="All Boats"
          options={filterOptions}
          onSelect={onFilter}
        />
      </div>

      <div className="grid px-5 py-6 w-full text-base font-bold text-white bg-cyan-900 grid-cols-[80px_180px_190px_106px_132px_120px_120px_110px]">
        <div>ID</div>
        <div>Product Name</div>
        <div>Note</div>
        <div>Quantity</div>
        <div>Unit Price</div>
        <div>Fleet</div>
        <div>Date Out</div>
        <div>Actions</div>
      </div>

      <div className="p-5 ">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`grid items-center py-4 grid-cols-[80px_180px_190px_106px_110px_120px_120px_108px]`}
          >
            <div className="text-lg text-gray-800">{order.id}</div>
            <div className="text-lg font-bold text-gray-800">
              {order.productName}
            </div>
            <div className="text-lg text-gray-600">{order.description}</div>
            <div className="text-lg text-gray-800">{order.quantity}</div>
            <div className="text-lg text-gray-800">
              ₱{order.unitPrice.toFixed(2)}
            </div>
            <div className="text-lg text-gray-600">{order.fleet}</div>
            <div className="text-lg text-gray-600">{order.dateOut}</div>
            <div>
              <button
                className="h-12 text-base text-white bg-emerald-700 rounded-lg w-[85px]"
                onClick={() => onModify && onModify(order.id)}
              >
                Modify
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
