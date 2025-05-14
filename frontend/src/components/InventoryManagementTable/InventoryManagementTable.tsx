import { SearchBar } from "./SearchBar";
import { InventoryButton } from "./InventoryButton";
import { InventoryTable } from "./InventoryTable";
import { useEffect, useRef, useState } from "react";
import { HighlightedItem, InventoryItem } from "@/types";
import { TableHeader } from "./TableHeader";
import { ClipLoader } from "react-spinners";
import ReactPaginate from "react-paginate";

interface InventoryManagementTableProps {
  inventoryItems: InventoryItem[];
  setIsAddOpen: (isOpen: boolean) => void;
  setIsOutOpen: (isOpen: boolean, item?: InventoryItem) => void;
  setIsEditOpen: (isOpen: boolean, item?: InventoryItem) => void;
  onSearch?: (query: string) => void;
  isLoading: boolean;
  searchQuery: string;
  highlightedItem?: HighlightedItem;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const ITEMS_PER_PAGE = 10;

const InventoryManagementTable = ({
  inventoryItems,
  setIsAddOpen,
  setIsOutOpen,
  setIsEditOpen,
  onSearch,
  isLoading = false,
  searchQuery,
  highlightedItem,
  containerRef,
}: InventoryManagementTableProps) => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (highlightedItem && containerRef?.current) {
      const itemIndex = inventoryItems.findIndex(item => item.id === highlightedItem.id);
      if (itemIndex >= 0) {
        const page = Math.floor(itemIndex / ITEMS_PER_PAGE);
        setCurrentPage(page);
        setTimeout(() => {
          if (itemRef.current && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const itemRect = itemRef.current.getBoundingClientRect();
            const scrollPosition = containerRef.current.scrollTop +
              (itemRect.top - containerRect.top) -
              (containerRect.height / 2);
            
            containerRef.current.scrollTo({
              top: scrollPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    }
  }, [highlightedItem, inventoryItems, containerRef]);

  const handleToggleExpand = (itemId: number) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const handleOutItemClick = (item: InventoryItem) => {
    setIsOutOpen(true, item);
  };

  const handleEditItemClick = (item: InventoryItem) => {
    setIsEditOpen(true, item);
  };

  const pageCount = Math.ceil(inventoryItems.length / ITEMS_PER_PAGE);
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = inventoryItems.slice(offset, offset + ITEMS_PER_PAGE);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    setExpandedItem(null);
  };

  return (
    <main className="p-[30px] max-sm:p-0 max-lg:p-[15px] h-[calc(100vh-136px)] ">
      <section className="
        bg-white
        rounded-[10px]
        w-[calc(100vw+170px)]  sm:w-full md:w-[calc(100vw)] lg:w-full
      ">
        <div className="
          bg-[#fff] pt-1 z-10
          sticky top-0 ml-[0.3px]
        ">
          <div className="
          bg-white border-[1px] border-[#E5E7EB] 
            shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)]
            rounded-tr-[10px] rounded-tl-[10px] 
            w-[calc(100vw+170px)]  sm:w-full md:w-[calc(100vw)] lg:w-full
            p-2 sm:p-[15px] flex items-center gap-20
          ">
            <SearchBar placeholder="Search Items..." onSearch={onSearch} />
            <InventoryButton
              variant="add"
              onAdd={() => setIsAddOpen(true)}
            />
          </div>
          <TableHeader />
        </div>
        <div className="
          flex flex-col
          w-[calc(100vw+170px)] sm:w-full md:w-[calc(100vw)] lg:w-full
          
        ">
          {isLoading && (
            <div className="relative flex justify-center items-center pt-10 pb-10">
              <ClipLoader size={60} color="#0e7490" loading={isLoading} />
            </div>
          )}
          {inventoryItems.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 pt-10 pb-10 text-2xl">
              <p>Inventory is empty or no items match your search criteria.</p>
            </div>
          )}
          <InventoryTable
            items={currentItems}
            expandedItem={expandedItem}
            onToggleExpand={handleToggleExpand}
            onOut={(item) => handleOutItemClick(item)}
            onEdit={(item) => handleEditItemClick(item)}
            searchQuery={searchQuery}
            highlightedItem={highlightedItem}
            itemRef={itemRef}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
        <div className="sticky bottom-0 bg-[#fff] pb-4 w-full ml-[0.3px] ">
          <div className="
            p-4 px-6 
            border-t border-[1px] border-[#E5E7EB] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] 
            bg-gray-50 text-sm text-gray-500
            rounded-br-[10px] rounded-bl-[10px]
            w-[calc(100vw+180px)] sm:w-full md:w-[calc(100vw)] lg:w-full
            flex justify-between items-center
          ">
            <span className="text-sm text-gray-500">
              Showing {offset + 1} to {Math.min(offset + ITEMS_PER_PAGE, inventoryItems.length)} of {inventoryItems.length} items
            </span>

            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
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
                activeClassName={"bg-[#295C65] border-[#295C65] text-white font-bold"}
                activeLinkClassName={"text-white select-none"}
                previousClassName={
                  "font-medium relative py-3 px-8 flex items-center justify-center px-3 border border-gray-400 rounded text-sm cursor-pointer " +
                  "hover:bg-[#295C65]/10 hover:border-[#295C65]/30 hover:text-[#295C65] " +
                  "transition-colors duration-200 select-none"
                }
                previousLinkClassName={"absolute inset-0 w-full h-full flex items-center justify-center focus:outline-none"}
                nextClassName={
                  "font-medium relative  py-3 px-6 flex items-center justify-center px-3 border border-gray-400 rounded text-sm cursor-pointer " +
                  "hover:bg-[#295C65]/10 hover:border-[#295C65]/30 hover:text-[#295C65] " +
                  "transition-colors duration-200 select-none"
                }
                nextLinkClassName={"absolute inset-0 w-full h-full flex items-center justify-center  focus:outline-none"}
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
    </main>
  );
}

export default InventoryManagementTable;