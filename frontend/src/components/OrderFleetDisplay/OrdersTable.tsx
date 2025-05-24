import React, { useEffect, useState } from "react";
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
import { HighlightedItem } from "@/types";
import { Tooltip } from "../ToolTips";
import { fixEncoding } from "@/utils/Normalization";

interface OrdersTableProps {
  orders: OrderItem[];
  onSearch?: (query: string) => void;
  onFilter?: (filter: string) => void;
  setIsModifyOpen: (isOpen: boolean, item?: OrderItem) => void;
  activeFleet: string;
  isLoading: boolean;
  searchQuery: string;
  highlightedItem?: HighlightedItem
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onSearch,
  onFilter,
  setIsModifyOpen,
  activeFleet,
  isLoading,
  searchQuery,
  highlightedItem
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const maxNoteLength = 48;

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

  useEffect(() => {
    setCurrentPage(0);
  }, [activeFleet, searchQuery]);

  const toggleExpand = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getFilterOptions = () => {
    switch (activeFleet) {
      case "All Fleets":
        return [
          "All Boats",
          "F/B DONYA DONYA 2x",
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
          "F/B DONYA DONYA 2x",
          "F/B Lady Rachelle",
          "F/B Mariella",
          "F/B My Shield",
          "F/B Abigail",
          "F/B DC-9",
        ];
      case "F/B Doña Librada":
        return [
          "All Boats",
          "F/B Doña Librada",
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
    <section className="flex-1 bg-[#fff] rounded-xl flex flex-col">
      <div className="stick sticky top-0 z-10">
        <div className="flex bg-white border-[1px] border-[#E5E7EB] 
            shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] rounded-tr-[10px] rounded-tl-[10px]
            p-2 sm:p-[15px] items-center gap-20    
        ">
          <SearchBar placeholder="Search Items..." onSearch={onSearch} />
          <FilterDropdown
            label="All Boats"
            options={filterOptions}
            onSelect={onFilter || (() => { })}
          />
        </div>
        <div className="grid px-5 py-6 w-full text-[16px] font-bold text-white bg-[#295C65] grid-cols-[minmax(120px,0.8fr)_minmax(150px,1.3fr)_minmax(200px,1.45fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_120px_40px]">
          <div className="px-3">Date Out</div>
          <div className="px-3">Product Name</div>
          <div className="px-3">Note</div>
          <div className="px-3">Quantity</div>
          <div className="px-3">Unit Price</div>
          <div className="px-3">Boat</div>
          <div className="text-center">Actions</div>
        </div>
      </div>
      <div
        className={`flex-1 min-h-0 orders-table-content`}
      >
        {isLoading ? (
          <div className="relative flex justify-center items-center pt-10 pb-10">
            <ClipLoader color="#0e7490" size={60} />
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center text-gray-500 pt-10 pb-10 text-2xl">
            There is no assigned item.
          </div>
        ) : (
          currentItems.map((order, index) => {
            const isSameDateAsPrevious =
              index > 0 && currentItems[index - 1].outDate === order.outDate;
            const shouldTruncate = order.note && order.note.length > maxNoteLength;
            const truncatedNote = shouldTruncate
              ? `${order.note.slice(0, maxNoteLength)}...`
              : order.note;
            return (
              <React.Fragment key={order.id}>
                <div className={`
                  flex-1 px-5 grid items-center p-3 grid-cols-[minmax(120px,0.8fr)_minmax(150px,1.3fr)_minmax(200px,1.45fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_120px_40px] 
                  hover:bg-gray-50 transition-[border-left-color,border-left-width] duration-150 ease-in-out 
                  ${highlightedItem?.id === order.id ? 'border-l-4' : 'border-[#E5E7EB] bg-white border'}
                  ${highlightedItem?.id === order.id
                    ? highlightedItem.type === 'edited'
                      ? 'bg-amber-50/30 border-l-6 border-amber-400'
                      : 'border-[#E5E7EB] bg-white border'
                    : ''
                  }                  
                `}
                data-testid={`order-row-${order.id}`}
                >
                  <div className="
                    text-[16px] text-gray-600 px-3
                    shrink-0 break-all overflow-hidden hyphens-auto flex-1
                  "
                  data-testid={`order-date-${order.id}`}
                  >
                    {!isSameDateAsPrevious &&
                      highlightText(
                        new Date(order.outDate).toLocaleDateString(),
                        searchQuery
                      )}
                  </div>
                  <div
                    className="
                    text-[16px] font-bold text-gray-800 px-3
                    shrink-0 break-all overflow-hidden hyphens-auto flex-1
                  "
                  data-testid={`order-product-${order.id}`}
                  >
                    {highlightText(order.name, searchQuery)}
                  </div>
                  <div
                    className="
                    text-sm text-gray-600 px-3
                    shrink-0 break-all hyphens-auto flex-1
                  "
                  data-testid={`order-note-${order.id}`}
                  >
                    {order.note &&
                      (order.note.length > maxNoteLength ? (
                        <Tooltip content={order.note.slice(maxNoteLength, order.note.length)} position="bottom">
                          <div className="cursor-pointer">
                            {highlightText(
                              truncatedNote,
                              searchQuery
                            )}
                            <span className="inline-block ml-1 text-cyan-600">
                              ↗
                            </span>
                          </div>
                        </Tooltip>
                      ) : (
                        highlightText(order.note, searchQuery)
                      ))}
                  </div>
                  <div
                    className="
                    text-[16px] text-gray-800 px-3
                    shrink-0 break-all overflow-hidden hyphens-auto flex-1
                  "
                  >
                    {highlightText(
                      `${roundTo(Number(order.quantity), 2)} ${pluralize(
                        order.selectUnit,
                        Number(order.quantity)
                      )}`,
                      searchQuery
                    )}
                  </div>
                  <div
                    className="
                    text-[16px] text-gray-800 px-3
                    shrink-0 break-all overflow-hidden hyphens-auto flex-1
                  "
                  >
                    {highlightText(
                      `₱${Number(order.unitPrice).toFixed(2)} / ${order.unitSize
                      } ${pluralize(order.selectUnit, Number(order.unitSize))}`,
                      searchQuery
                    )}
                  </div>
                  <div
                    className="
                    text-[16px] text-gray-600 px-3
                    shrink-0 break-all overflow-hidden hyphens-auto flex-1
                  "
                  data-testid="order-boat-name"
                  >

                    {highlightText(fixEncoding(order.boat.boat_name), searchQuery)}
                  </div>
                  <div
                    className="
                    flex items-center gap-2
                    shrink-0 break-all overflow-hidden hyphens-auto justify-center
                  "
                  >
                    <button
                      className="
                          h-10 text-sm text-white bg-[#3B82F6] rounded-lg w-[85px]
                          cursor-pointer hover:bg-[#2563EB] transition-colors duration-200
                          flex items-center justify-center gap-2
                      "
                      data-testid={`modify-order-btn-${order.id}`}
                      onClick={() => handleModifyItemClick(order)}

                    >
                      <svg width="15" height="16" viewBox="0 0 15 16" fill="none">
                        <path
                          d="M9.99763 2L12.494 5M2.50867 14L5.00499 13L11.6618 5L9.99763 3L3.34077 11L2.50867 14Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[16px] text-white">Edit</span>
                    </button>
                  </div>
                  <div
                    className=" ml-3 mr-1 scale-80 cursor-pointer rounded-full transition-all hover:scale-90 hover:shadow-md hover:shadow-gray-600/50"
                    onClick={() => toggleExpand(order.id)}
                    data-testid={`expand-order-${order.id}`}
                    role="button"
                  >
                    <ChevronIcon isExpanded={expandedOrderId === order.id}/>
                  </div>
                </div>
                <div
                  className={`transition-all duration-300 ease-in-out ${expandedOrderId === order.id
                    ? "scale-[100.5%] opacity-100 max-h-[500px]"
                    : "scale-100 opacity-0 max-h-0 overflow-hidden"
                    }`}
                >
                  {expandedOrderId === order.id && (
                    <ExpandedOrderDetails order={order} />
                  )}
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
      <div className="sticky bottom-0 bg-[#fff] ml-[0.3px] pb-4 ">
        <div className="p-4 px-6 flex justify-between items-center rounded-br-[10px] rounded-bl-[10px] border-[#E5E7EB] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] 
            bg-gray-50 text-sm text-gray-500
            border-t border-[1px]">
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
