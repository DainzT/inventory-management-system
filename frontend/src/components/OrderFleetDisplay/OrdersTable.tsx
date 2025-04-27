import React, { useState } from "react";
import { OrderItem } from "@/types/order-item";
import { SearchBar } from "../InventoryManagementTable/SearchBar";
import { FilterDropdown } from "./FilterDropdown";
import { ExpandedOrderDetails } from "./ExpandedOrderDetails";
import { ChevronIcon } from "../InventoryManagementTable/ChevronIcon";
import { pluralize } from "@/utils/Pluralize";

interface OrdersTableProps {
  orders: OrderItem[];
  onSearch?: (query: string) => void;
  onFilter?: (filter: string) => void;
  onModify?: (id: number) => void;
  activeFleet: string;
  isModifyOpen: (isopen: boolean) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onSearch,
  onFilter,
  onModify,
  activeFleet,
  isModifyOpen,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(a.outDate).getTime() - new Date(b.outDate).getTime()
  );

  const toggleExpand = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };
  


  const getFilterOptions = () => {
    switch (activeFleet) {
      case "All Fleets":
        return [
          "All Boats",
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
      case "F/B DONYA DONYA 2X":
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
    <section className="flex-1 bg-white rounded-xl border-[1px] border-[#E5E7EB] shadow-sm ">
      <div className="flex gap-5 p-2 sm:p-[24px]">
        <SearchBar placeholder="Search Items..." onSearch={onSearch} />
        <FilterDropdown
          label="All Boats"
          options={filterOptions}
          onSelect={onFilter || (() => { })}
        />
      </div>

      <div className="grid px-5 py-6 w-full text-[16px] font-bold text-white bg-cyan-900 grid-cols-[minmax(120px,1fr)_minmax(150px,1fr)_minmax(200px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_120px_40px]">
        <div className="px-3">Date Out</div>
        <div className="px-3">Product Name</div>
        <div className="px-3">Note</div>
        <div className="px-3">Quantity</div>
        <div className="px-3">Unit Price</div>
        <div className="px-3">Boat</div>
        <div className="text-center">Actions</div>
      </div>

      <div className="flex-1">
        {sortedOrders?.map((order, index) => {
          const isSameDateAsPrevious =
            index > 0 && order.outDate === sortedOrders[index - 1].outDate;

          return (
            <React.Fragment key={order.id}>
              <div className="flex-1 px-5 grid items-center py-4 grid-cols-[minmax(120px,1fr)_minmax(150px,1fr)_minmax(200px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_120px_40px] hover:bg-gray-50  bg-white border-[1px] border-[#E5E7EB] ">
                <div className="
                  text-[16px] text-gray-600 px-3
                  shrink-0 break-all overflow-hidden hyphens-auto flex-1
                ">
                  {!isSameDateAsPrevious && new Date(order.outDate).toLocaleDateString()}
                </div>
                <div className="
                  text-[16px] font-bold text-gray-800 px-3
                  shrink-0 break-all overflow-hidden hyphens-auto flex-1
                ">
                  {order.name}
                </div>
                <div className="
                  text-[16px] text-gray-600 px-3
                  shrink-0 break-all overflow-hidden hyphens-auto flex-1
                ">
                  {order.note}
                </div>
                <div className="
                  text-[16px] text-gray-800 px-3
                  shrink-0 break-all overflow-hidden hyphens-auto flex-1
                ">
                  {order.quantity} {pluralize(order.selectUnit, Number(order.quantity))}
                </div>
                <div className="
                  text-[16px] text-gray-800 px-3
                  shrink-0 break-all overflow-hidden hyphens-auto flex-1
                ">
                  ₱{order.unitPrice} / {order.unitSize} {pluralize(order.selectUnit, Number(order.unitSize))}
                </div>
                <div className="
                  text-[16px] text-gray-600 px-3
                  shrink-0 break-all overflow-hidden hyphens-auto flex-1
                ">
                  {order.boat.boat_name}
                </div>
                <div className="
                  flex items-center gap-2
                  shrink-0 break-all overflow-hidden hyphens-auto justify-center
                ">
                  <button
                    className="
                    h-9 text-sm text-white bg-emerald-700 rounded-lg w-[85px]
                    cursor-pointer hover:bg-emerald-600 transition-colors duration-200
                  "
                    onClick={() => {
                      if (onModify) onModify(order.id);
                      isModifyOpen(true);
                    }}
                  >
                    Modify
                  </button>
                  </div>
                  <div
                    className="ml-3 scale-80 cursor-pointer rounded-full transition-all hover:scale-90 hover:shadow-md hover:shadow-gray-600/50"
                    onClick={() => toggleExpand(order.id)}
                  >
                    <ChevronIcon isExpanded={expandedOrderId === order.id} />
                  </div>
              </div>
              <div
                className={`transition-all duration-300 ease-in-out ${expandedOrderId === order.id
                    ? "scale-[100.5%] opacity-100 max-h-[500px]"
                    : "scale-100 opacity-0 max-h-0 overflow-auto"
                  }`}
              >
                {expandedOrderId === order.id && (
                  <ExpandedOrderDetails order={order} />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};
