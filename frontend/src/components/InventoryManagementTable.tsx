import { SearchBar } from "./InventoryManagementTable/SearchBar";
import { InventoryButton } from "./InventoryManagementTable/InventoryButton";
import { InventoryTable } from "./InventoryManagementTable/InventoryTable";


const InventoryManagementTable = () => {
  return (
      <main className="p-[30px] max-lg:p-[15px]">
        <section className="w-full rounded-[12px] border-[1px] border-[#E5E7EB] bg-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)]">
            <div className="p-[24px] flex items-center gap-[10px]">
                <SearchBar />
                <InventoryButton 
                    variant="add"
                />
            </div>
        <InventoryTable />
        </section>
      </main>
  );
}

export default InventoryManagementTable;