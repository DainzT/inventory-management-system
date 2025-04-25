import { SearchBar } from "./SearchBar";
import { InventoryButton } from "./InventoryButton";
import { InventoryTable } from "./InventoryTable";
import { useState } from "react";
import { InventoryItem } from "@/types";
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
}

const ITEMS_PER_PAGE = 10;

const InventoryManagementTable = ({
  inventoryItems,
  setIsAddOpen,
  setIsOutOpen,
  setIsEditOpen,
  onSearch,
  isLoading = false,
}: InventoryManagementTableProps) => {

  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

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
    <main className="p-[30px] max-sm:p-0 max-lg:p-[15px] h-[calc(100vh-135px)] ">
      <section className="
        w-[calc(100vw+170px)]  sm:w-full md:w-[calc(100vw)] lg:w-full
        h-[calc(100vh-140px)] rounded-[5px] border-[1px] border-[#E5E7EB] bg-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)]
      ">
        <div className="
          w-[calc(100vw+170px)]  sm:w-full md:w-[calc(100vw)] lg:w-full
          p-2 sm:p-[24px] flex items-center gap-[10px]
        ">
          <SearchBar placeholder="Search Items..." onSearch={onSearch} />
          <InventoryButton
            variant="add"
            onAdd={() => setIsAddOpen(true)}
          />
        </div>
        <TableHeader />
        <div className="
          flex flex-col 
          h-[calc(100vh-300px)] sm:h-[calc(100vh-360px)] md:h-[calc(100vh-360px)] lg:h-[calc(100vh-385px)]
          w-[calc(100vw+170px)] sm:w-full md:w-[calc(100vw)] lg:w-full
          overflow-x-hidden overflow-auto
        ">
          {isLoading && (
            <div className="relative flex justify-center items-center mt-40 mr-5 ml-3">
              <ClipLoader size={60} color="#36D7B7" loading={isLoading} />
            </div>
          )}
          {inventoryItems.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 mt-20 text-2xl">
              <p>Inventory is empty or no items match your search criteria.</p>
            </div>
          )}
          <InventoryTable
            items={currentItems}
            expandedItem={expandedItem}
            onToggleExpand={handleToggleExpand}
            onOut={(item) => handleOutItemClick(item)}
            onEdit={(item) => handleEditItemClick(item)}
          />
        </div>
        <div className="
          p-3 px-6 border-t border-gray-200 bg-gray-50 text-sm text-gray-500 
          w-[calc(100vw+170px)] sm:w-full md:w-[calc(100vw)] lg:w-full
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
      </section>
    </main>
  );
}

export default InventoryManagementTable;