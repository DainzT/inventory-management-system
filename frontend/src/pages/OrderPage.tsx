import { FleetCard } from "@/components/OrderFleetDisplay/FleetCards";
import { OrdersTable } from "@/components/OrderFleetDisplay/OrdersTable";
import { OrderItem } from "@/types/order-item";
import { InventoryItem } from "@/types/inventory-item";
import { ModifyModal } from "@/components/ModifyModal/ModifyModal";
import { fetchAssignedItems } from "@/api/orderAPI";
import { fetchInventoryItems } from "@/api/inventoryAPI";
import { PageTitle } from "@/components/PageTitle";
import { ModifyOrderItem } from "@/types/modify-order-item";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useOrder } from "@/hooks/useOrder";


const Orders: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [modifyOrderItem, setModifyOrderItem] = useState<ModifyOrderItem | null>(null);
  const [isModifyOpen, setIsModifyOpen] = useState<boolean>(false);
  const [isModifying, setIsModifying] = useState(false);
  const {

    filteredOrders,
    activeFleet,
    handleSearch,
    handleFilter,
    handleFleetSelect,
    setFilteredOrders,
    setOrders,
  } = useOrder();


  function toModifyOrderItem(
    order: OrderItem,
    inventory: InventoryItem | undefined
  ): ModifyOrderItem {
    return {
      inventory: inventory || null,
      id: order.id,
      name: order.name,
      note: order.note || "",
      quantity: typeof order.quantity === 'number' ? order.quantity : Number(order.quantity) || 0,
      unitPrice: Number(order.unitPrice) || 0,
      selectUnit: order.selectUnit || "",
      unitSize: Number(order.unitSize) || 0,
      total: order.total ? Number(order.total) : 0,
      fleet: order.fleet,
      boat: order.boat,
      lastUpdated: order.lastUpdated ? new Date(order.lastUpdated) : new Date()
    };
  }

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

  useEffect(() => {
    if (isModifyOpen && selectedOrder) {
      const inventoryMatch = inventoryItems.find(
        (item) => item.name === selectedOrder.name && item.unitPrice === selectedOrder.unitPrice
      );
      
      const transformed = toModifyOrderItem(selectedOrder, inventoryMatch);
      setModifyOrderItem(transformed);
    }
  }, [isModifyOpen, selectedOrder, inventoryItems]);

  const handleModifyItem = async (quantity: number, fleet: string, boat: string) => {
    console.log("to be updated sa next push");
  };
  

  const handleRemoveItem = (id: number) => {
    setFilteredOrders((prev) => prev.filter((order) => order.id !== id));
    setOrders((prev) => prev.filter((order) => order.id !== id));
    setSelectedOrder(null);
    setIsModifyOpen(false);
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

        <ModifyModal
          isOpen={isModifyOpen}
          setIsOpen={setIsModifyOpen}
          onModify={handleModifyItem}
          onRemove={handleRemoveItem}
          selectedOrder={modifyOrderItem}
          isDeleting={isDeleting}
          isModifying={isModifying}
        />
      </main>
    </div>
  );
};

export default Orders;