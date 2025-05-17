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
import { toast } from "react-toastify";
import { useOrder } from "@/hooks/useOrder";
import { useUpdateAssignedItem } from "@/hooks/useUpdateAssignedItem";

const Orders: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [modifyOrderItem, setModifyOrderItem] =
    useState<ModifyOrderItem | null>(null);
  const [isModifyOpen, setIsModifyOpen] = useState<boolean>(false);

  const { updateAssignedItem, isLoading: isModifying, deleteOrderItem, isDeleting } = useUpdateAssignedItem();

  const {
    orders,
    filteredOrders,
    activeFleet,
    handleSearch,
    handleFilter,
    handleFleetSelect,
    setFilteredOrders,
    setOrders,
    isLoading,
    searchQuery,
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
      quantity:
        typeof order.quantity === "number"
          ? order.quantity
          : Number(order.quantity) || 0,
      unitPrice: Number(order.unitPrice) || 0,
      selectUnit: order.selectUnit || "",
      unitSize: Number(order.unitSize) || 0,
      total: order.total ? Number(order.total) : 0,
      fleet: order.fleet,
      boat: order.boat,
      lastUpdated: order.lastUpdated ? new Date(order.lastUpdated) : new Date(),
    };
  }

  useEffect(() => {
    const fetchOrdersAndInventory = async () => {
      try {
        const [ordersResponse, inventoryResponse] = await Promise.all([
          fetchAssignedItems(),
          fetchInventoryItems(),
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
        (item) =>
          item.name === selectedOrder.name &&
          item.unitPrice === selectedOrder.unitPrice
      );

      const transformed = toModifyOrderItem(selectedOrder, inventoryMatch);
      setModifyOrderItem(transformed);
    }
  }, [isModifyOpen, selectedOrder, inventoryItems]);

  const handleModifyItem = async (quantity: number, fleetName: string, boatName: string) => {
    if (!modifyOrderItem) return;

    try {
      const result = await updateAssignedItem({
        id: modifyOrderItem.id,
        quantity,
        fleet_id: modifyOrderItem.fleet.id,
        boat_id: modifyOrderItem.boat.id,
        fleet_name: fleetName,
        boat_name: boatName
      });

      if (result.success) {
        if (result.deleted) {
          setOrders(prev => prev.filter(order => order.id !== modifyOrderItem.id));
          setFilteredOrders(prev => prev.filter(order => order.id !== modifyOrderItem.id));

          setIsModifyOpen(false);
          setSelectedOrder(null);
          toast.success("Item removed and quantity restored to inventory");

        } else if (result.data) {
          const updatedOrder = {
            ...result.data,
            fleet: {
              ...modifyOrderItem.fleet,
              fleet_name: fleetName
            },
            boat: {
              ...modifyOrderItem.boat,
              boat_name: boatName
            }
          };

          setOrders(prev => prev.map(order =>
            order.id === modifyOrderItem.id ? updatedOrder : order
          ));
          setFilteredOrders(prev => prev.map(order =>
            order.id === modifyOrderItem.id ? updatedOrder : order
          ));
          toast.success("Item updated successfully");
        }
      }
    } catch (error) {
      console.error("Error modifying item:", error);
      toast.error("Failed to update item. Please try again.");
    }
  };


  const handleRemoveItem = async (id: number) => {
    await deleteOrderItem(id);

    const Orders = await fetchAssignedItems();

    setOrders(Orders)
    setSelectedOrder(null);
    setIsModifyOpen(false);
  };
  
  const allFleetCount = orders.filter((order) => !order.archived).length;
  const donyaDonyaCount = orders.filter(
    (order) => !order.archived && order.fleet.fleet_name === "F/B DONYA DONYA 2x"
  ).length;
  const donaLibradaCount = orders.filter(
    (order) => !order.archived && order.fleet.fleet_name === "F/B Doña Librada"
  ).length;


  return (
    <div>
      <main className="flex-1">
        <PageTitle title={activeFleet} />

        <div className="flex justify-center items-center h-[200px]">
          <div className="justify-start items-center flex gap-16">
            <FleetCard
              title="All Fleets"
              backgroundColor="bg-emerald-800"
              isActive={activeFleet === "All Fleets"}
              onClick={() => handleFleetSelect("All Fleets")}
              orderCount={allFleetCount}
            />
            <FleetCard
              title="F/B DONYA DONYA 2X"
              backgroundColor="bg-cyan-800"
              isActive={activeFleet === "F/B DONYA DONYA 2X"}
              onClick={() => handleFleetSelect("F/B DONYA DONYA 2X")}
              orderCount={donyaDonyaCount}
            />
            <FleetCard
              title="F/B Doña Librada"
              backgroundColor="bg-red-800"
              isActive={activeFleet === "F/B Doña Librada"}
              onClick={() => handleFleetSelect("F/B Doña Librada")}
              orderCount={donaLibradaCount}
            />
          </div>
        </div>

        <div className="p-[20px]">
          <OrdersTable
            orders={filteredOrders}
            onSearch={handleSearch}
            searchQuery={searchQuery}
            onFilter={handleFilter}
            activeFleet={activeFleet}
            isLoading={isLoading}
            setIsModifyOpen={(isOpen, item) => {
              setSelectedOrder(item || null);
              setIsModifyOpen(isOpen);
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