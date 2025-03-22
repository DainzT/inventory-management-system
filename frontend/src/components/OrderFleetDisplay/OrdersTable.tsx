import React, { useState } from "react";
import { OrderItemProps } from "@/types/FleetsOrder";
import { SearchBar } from "./SearchBar";
import { FilterDropdown } from "./FilterDropdown";
import { ExpandedOrderDetails } from "./ExpandedOrderDetails";
import { ChevronIcon } from "../InventoryManagementTable/ChevronIcon";

interface OrdersTableProps {
  orders: OrderItemProps[];
  onSearch?: (query: string) => void;
  onFilter?: (filter: string) => void;
  onModify?: (id: number) => void;
  activeFleet: string
  isModifyOpen: (isopen: boolean)  => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onSearch,
  onFilter,
  onModify,
  activeFleet,
  isModifyOpen
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getFilterOptions = () => {
    switch (activeFleet) {
      case "All Fleets":
        return [
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
      case "F/B Donya Donya":
        return [
          "All Boats",
          "F/B Lady Rachelle",
          "F/B Mariella",
          "F/B My Shield",
          "F/B Abigail",
          "F/B DC-9",
        ];
      case "F/B Doña Librada":
        return [
          "All Boats",
          "F/B Adomar",
          "F/B Prince of Peace",
          "F/B Ruth Gaily",
          "F/V Vadeo Scout",
          "F/B Mariene",
        ];
      default:
        return ["All Boats"];
    }
  };

  const filterOptions = getFilterOptions();

  return (
    <section className="flex-1 bg-white rounded-xl border shadow-sm">
      <div className="flex gap-5 p-8">
        <SearchBar onSearch={onSearch} />
        <FilterDropdown label="All Boats" options={filterOptions} onSelect={onFilter} />
      </div>

      <div className="grid px-5 py-6 w-full text-base font-bold text-white bg-cyan-900 grid-cols-[80px_180px_165px_125px_145px_120px_120px_110px]">
        <div>ID</div>
        <div>Product Name</div>
        <div>Note</div>
        <div>Quantity</div>
        <div>Unit Price</div>
        <div>Boat</div>
        <div>Date Out</div>
        <div>Actions</div>
      </div>

      <div className="p-5">
        {orders.map((order) => (
          <article key={order.id}>
            <div className="grid items-center py-4 grid-cols-[80px_170px_195px_108px_125px_135px_130px_110px] bg-white ">
              <div className="text-lg text-gray-800">{order.id}</div>
              <div className="text-lg font-bold text-gray-800">{order.productName}</div>
              <div className="text-lg text-gray-600">{order.note}</div>
              <div className="text-lg text-gray-800">{order.quantity}</div>
              <div className="text-lg text-gray-800">₱{order.unitPrice.toFixed(2)}</div>
              <div className="text-lg text-gray-600">{order.boat}</div>
              <div className="text-lg text-gray-600">{order.dateOut}</div>
              <div className="flex items-center gap-2">
                <button
                  className="h-9 text-base text-white bg-emerald-700 rounded-lg w-[85px]"
                  onClick={() => isModifyOpen(true)}
                >
                  Modify
                </button>
                <div className=" ml-3 scale-80 cursor-pointer rounded-full transition-all hover:scale-90 hover:shadow-md hover:shadow-gray-600/50" onClick={() => toggleExpand(order.id)}>
                  <ChevronIcon isExpanded={expandedOrderId === order.id} />
                </div>
              </div>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out ${
                expandedOrderId === order.id
                  ? "scale-[100.5%] opacity-100 max-h-[500px]"
                  : "scale-100 opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              {expandedOrderId === order.id && <ExpandedOrderDetails order={order} />}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
