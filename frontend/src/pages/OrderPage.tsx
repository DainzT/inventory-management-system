import { FleetCard } from "@/components/OrderFleetDisplay/FleetCards";
import { OrdersTable } from "@/components/OrderFleetDisplay/OrdersTable";
import { OrderItem } from "@/types/order-item";
import { InventoryItem } from "@/types/inventory-item";
import { fetchAssignedItems } from "@/api/orderAPI";
import { fetchInventoryItems } from "@/api/inventoryAPI";
import { PageTitle } from "@/components/PageTitle";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useOrder } from "@/hooks/useOrder";


const Orders: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isModifying, setIsModifying] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isModifyOpen, setIsModifyOpen] = useState<boolean>(false);
  const {
    filteredOrders,
    activeFleet,
    handleSearch,
    handleFilter,
    handleFleetSelect,
    setFilteredOrders,
    setOrders,
  } = useOrder();


  useEffect(() => {
    const fetchOrdersAndInventory = async () => {
      try {
        const [ordersResponse, inventoryResponse] = await Promise.all([
          fetchAssignedItems(),
          fetchInventoryItems()
        ]);

        setOrders(ordersResponse);
        setFilteredOrders(ordersResponse);
        setInventoryItems(inventoryResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOrdersAndInventory();
  }, []);

  const handleModifyItem = (quantity: number, fleet: string, boat: string) => {
    if (selectedOrder) {
      console.log("Changes confirmed:", {
        selectedOrder,
        quantity,
        fleet,
        boat,
      });
      setIsModifyOpen(false);
    }
  };

  const handleRemoveItem = () => {
    if (selectedOrder) {
      console.log("Item removed:", selectedOrder);
      setIsModifyOpen(false);
    }
  };

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
            setIsModifyOpen={(isOpen, item) => {
              setSelectedOrder(item || null)
              setIsModifyOpen(isOpen)
            }}
          />
        </div>

      </main>
    </div>
  );
};

export default Orders;
