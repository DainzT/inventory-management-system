import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { OrderItem } from "@/types/order-item";
import { SearchBar } from "../InventoryManagementTable/SearchBar";
import { FilterDropdown } from "./FilterDropdown";
import { ExpandedOrderDetails } from "./ExpandedOrderDetails";
import { ChevronIcon } from "../InventoryManagementTable/ChevronIcon";
import { pluralize } from "@/utils/Pluralize";
import { roundTo } from "@/utils/RoundTo";
import { ClipLoader } from "react-spinners";
import { highlightText } from "@/utils/HighlightText";

interface OrdersTableProps {
  orders: OrderItem[];
  onSearch?: (query: string) => void;
  onFilter?: (filter: string) => void;
  setIsModifyOpen: (isOpen: boolean, item?: OrderItem) => void;
  activeFleet: string;
  isLoading: boolean;
  searchQuery: string;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onSearch,
  onFilter,
  setIsModifyOpen,
  activeFleet,
  isLoading,
  searchQuery,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const offset = currentPage * ITEMS_PER_PAGE;

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(a.outDate).getTime() - new Date(b.outDate).getTime()
  );

  const pageCount = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
  const currentItems = sortedOrders.slice(offset, offset + ITEMS_PER_PAGE);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

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

  const handleModifyItemClick = (item: OrderItem) => {
    setIsModifyOpen(true, item);
  };

  return (
    <section className="flex-1 bg-white rounded-xl border-[1px] border-[#E5E7EB] shadow-sm ">
      <div className="flex gap-5 p-2 sm:p-[24px]">
        <SearchBar placeholder="Search Items..." onSearch={onSearch} />
        <FilterDropdown
          label="All Boats"
          options={filterOptions}
          onSelect={onFilter || (() => {})}
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
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <ClipLoader color="#0e7490" size={50} />
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            There is no assigned item.
          </div>
        ) : (
          currentItems.map((order, index) => {
            const isSameDateAsPrevious =
              index > 0 && currentItems[index - 1].outDate === order.outDate;

            return (
              <React.Fragment key={order.id}>
                <div className="flex-1 px-5 grid items-center py-4 grid-cols-[minmax(120px,1fr)_minmax(150px,1fr)_minmax(200px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_120px_40px] hover:bg-gray-50 bg-white border-[1px] border-[#E5E7EB]">
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
                    {highlightText(order.name, searchQuery)}
                  </div>
                  <div className="
                    text-[16px] text-gray-600 px-3
                    shrink-0 break-all overflow-hidden hyphens-auto flex-1
                  ">
                    {highlightText(order.note, searchQuery)}
                  </div>
                  <div className="
                    text-[16px] text-gray-800 px-3
                    shrink-0 break-all overflow-hidden hyphens-auto flex-1
                  ">
                    {highlightText(`${roundTo(Number(order.quantity), 2)} ${pluralize(order.selectUnit, Number(order.quantity))}`, searchQuery)}
                  </div>
                  <div className="
                    text-[16px] text-gray-800 px-3
                    shrink-0 break-all overflow-hidden hyphens-auto flex-1
                  ">
                    {highlightText(`₱${Number(order.unitPrice).toFixed(2)} / ${order.unitSize} ${pluralize(order.selectUnit, Number(order.unitSize))}`, searchQuery)}
                  </div>
                  <div className="
                    text-[16px] text-gray-600 px-3
                    shrink-0 break-all overflow-hidden hyphens-auto flex-1
                  ">
                    {highlightText(order.boat.boat_name, searchQuery)}
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
                      onClick={() => handleModifyItemClick(order)}
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
                <div className={`transition-all duration-300 ease-in-out ${expandedOrderId === order.id ? "scale-[100.5%] opacity-100 max-h-[500px]" : "scale-100 opacity-0 max-h-0 overflow-hidden"}`}>
                  {expandedOrderId === order.id && <ExpandedOrderDetails order={order} />}
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
      <div className="sticky bottom-0 bg-[#fff] pb-4 w-full ml-[0.3px]">
        <div
          className="
            p-4 px-6 
            border-t border-[1px] border-[#E5E7EB] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] 
            bg-gray-50 text-sm text-gray-500
            rounded-br-[10px] rounded-bl-[10px]
            w-[calc(100vw+180px)] sm:w-full md:w-[calc(100vw)] lg:w-full
            flex justify-between items-center
          "
        >
          <span className="text-sm text-gray-500">
            Showing {offset + 1} to{" "}
            {Math.min(offset + ITEMS_PER_PAGE, sortedOrders.length)} of{" "}
            {sortedOrders.length} items
          </span>

          <div className="flex items-center gap-4">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"flex items-center gap-1 select-none"}
              pageClassName={
                "relative px-3 py-3 border border-gray-400 rounded text-sm " +
                "hover:bg-[#295C65]/10 hover:border-[#295C65]/30 transition-colors duration-200"
              }
              pageLinkClassName={
                "absolute inset-0 w-full h-full flex items-center justify-center " +
                "text-gray-700 hover:text-[#295C65] select-none"
              }
              activeClassName={
                "bg-[#295C65] border-[#295C65] text-white font-bold"
              }
              activeLinkClassName={"text-white select-none"}
              previousClassName={
                "font-medium relative py-3 px-8 flex items-center justify-center px-3 border border-gray-400 rounded text-sm cursor-pointer " +
                "hover:bg-[#295C65]/10 hover:border-[#295C65]/30 hover:text-[#295C65] " +
                "transition-colors duration-200 select-none"
              }
              previousLinkClassName={
                "absolute inset-0 w-full h-full flex items-center justify-center focus:outline-none"
              }
              nextClassName={
                "font-medium relative py-3 px-6 flex items-center justify-center px-3 border border-gray-400 rounded text-sm cursor-pointer " +
                "hover:bg-[#295C65]/10 hover:border-[#295C65]/30 hover:text-[#295C65] " +
                "transition-colors duration-200 select-none"
              }
              nextLinkClassName={
                "absolute inset-0 w-full h-full flex items-center justify-center  focus:outline-none"
              }
              disabledClassName={"opacity-50 cursor-not-allowed select-none"}
              disabledLinkClassName={
                "hover:bg-transparent hover:text-gray-700 select-none"
              }
              breakClassName={"px-2 text-gray-500 select-none"}
              forcePage={currentPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
