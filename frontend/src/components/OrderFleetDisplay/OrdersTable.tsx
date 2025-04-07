import React, { useState } from "react";
import { OrderItemProps } from "@/types/fleet-order";
import { SearchBar } from "../InventoryManagementTable/SearchBar";
import { FilterDropdown } from "./FilterDropdown";
import { ExpandedOrderDetails } from "./ExpandedOrderDetails";
import { ChevronIcon } from "../InventoryManagementTable/ChevronIcon";

interface OrdersTableProps {
  orders: OrderItemProps[];
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
          "F/B DONYA DONYA 2X",
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
    <section className="flex-1 bg-white rounded-xl border-[1px] border-[#E5E7EB] shadow-sm">
      <div className="flex gap-5 p-9">
        <SearchBar placeholder="Search Items..." onSearch={onSearch} />
        <FilterDropdown
          label="All Boats"
          options={filterOptions}
          onSelect={onFilter || (() => {})}
        />
      </div>

      <div className="grid px-5 py-6 w-full text-lg font-bold text-white bg-cyan-900 grid-cols-[170px_200px_235px_150px_147px_135px_100px]">
        <div>Date Out</div>
        <div>Product Name</div>
        <div>Note</div>
        <div>Quantity</div>
        <div>Unit Price</div>
        <div>Boat</div>
        <div>Actions</div>
      </div>

      <div className="p-5">
        {sortedOrders?.map((order, index) => {
          const isSameDateAsPrevious =
            index > 0 && order.outDate === sortedOrders[index - 1].outDate;

          return (
            <React.Fragment key={order.id}>
              {/* used React.Fragment group the row and expanded content */}
              <div className="grid items-center py-4 grid-cols-[170px_190px_280px_115px_140px_135px_110px] bg-white">
                <div className="text-lg text-gray-600">
                  {!isSameDateAsPrevious && new Date(order.outDate).toLocaleDateString()}
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {order.item.name}
                </div>
                <div className="text-md text-gray-600">{order.item.note}</div>
                <div className="text-lg text-gray-800">{order.quantity}</div>
                <div className="text-lg text-gray-800">
                  ₱{order.item.unitPrice}
                </div>
                <div className="text-lg text-gray-600">{order.boat.boat_name}</div>

                <div className="flex items-center gap-2">
                  <button
                    className="h-9 text-base text-white bg-emerald-700 rounded-lg w-[85px]"
                    onClick={() => {
                      if (onModify) onModify(order.id);
                      isModifyOpen(true);
                    }}
                  >
                    Modify
                  </button>
                  <div
                    className="ml-3 scale-80 cursor-pointer rounded-full transition-all hover:scale-90 hover:shadow-md hover:shadow-gray-600/50"
                    onClick={() => toggleExpand(order.id)}
                  >
                    <ChevronIcon isExpanded={expandedOrderId === order.id} />
                  </div>
                </div>
              </div>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  expandedOrderId === order.id
                    ? "opacity-100 max-h-[500px]"
                    : "opacity-0 max-h-0 overflow-hidden"
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
