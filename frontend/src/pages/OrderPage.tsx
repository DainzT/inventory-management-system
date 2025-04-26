import { FleetCard } from "@/components/OrderFleetDisplay/FleetCards";
import { OrdersTable } from "@/components/OrderFleetDisplay/OrdersTable";
import { ModifyModal } from "@/components/ModifyModal/ModifyModal";
import { PageTitle } from "@/components/PageTitle";
import { ToastContainer } from "react-toastify";
import { useOrder } from "@/hooks/useOrder";

const Orders: React.FC = () => {
  const {
    filteredOrders,
    activeFleet,
    isModalOpen,
    selectedOrder,
    handleSearch,
    handleFilter,
    handleFleetSelect,
    handleModify,
    handleCloseModal,
    handleConfirmChanges,
    handleRemoveItem,
    setIsModalOpen,
  } = useOrder();

  return (
    <div>
      <main className="flex-1 p-0">
        <ToastContainer position="top-right" autoClose={3000} theme="light" />
        <PageTitle title={activeFleet} />

        <div className="flex justify-center items-center h-[230px]">
          <div className="justify-start items-center flex gap-35">
            <FleetCard
              title="All Fleets"
              backgroundColor="bg-emerald-800"
              isActive={activeFleet === "All Fleets"}
              onClick={() => handleFleetSelect("All Fleets")}
            />
            <FleetCard
              title="F/B DONYA DONYA 2X"
              backgroundColor="bg-cyan-800"
              isActive={activeFleet === "F/B DONYA DONYA 2X"}
              onClick={() => handleFleetSelect("F/B DONYA DONYA 2X")}
            />
            <FleetCard
              title="F/B Doña Librada"
              backgroundColor="bg-red-800"
              isActive={activeFleet === "F/B Doña Librada"}
              onClick={() => handleFleetSelect("F/B Doña Librada")}
            />
          </div>
        </div>

        <div className="p-[30px]">
          <OrdersTable
            orders={filteredOrders}
            onSearch={handleSearch}
            onFilter={handleFilter}
            activeFleet={activeFleet}
            onModify={handleModify}
            isModifyOpen={setIsModalOpen}
          />
        </div>

        {selectedOrder && (
          <ModifyModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmChanges}
            onRemove={handleRemoveItem}
            order={selectedOrder}
          />
        )}
      </main>
    </div>
  );
};

export default Orders;
