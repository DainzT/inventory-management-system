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
import { useOrder } from "@/hooks/useOrder";
import { useUpdateAssignedItem } from "@/hooks/useUpdateAssignedItem";
import { HighlightedItem } from "@/types";
import { fixEncoding } from "@/utils/Normalization";
import { OrdersSkeleton } from "@/components/OrderFleetDisplay/OrdersSkeleton";

const Orders: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [modifyOrderItem, setModifyOrderItem] =
    useState<ModifyOrderItem | null>(null);
  const [isModifyOpen, setIsModifyOpen] = useState<boolean>(false);
  const [highlightedItem, setHighlightedItem] = useState<HighlightedItem>(null);

  const { handleModifyItem, handleDeleteOrderItem } = useUpdateAssignedItem();
  const [isModifying, setIsModifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleEditItem = async (id: number, quantity: number, fleet_name: string, boat_name: string) => {
    setIsModifying(true)
    try {
      await handleModifyItem(id, quantity, fleet_name, boat_name);
      const Orders = await fetchAssignedItems();
      setOrders(Orders)

      setIsModifyOpen(false);
      setSelectedOrder(null);
      if (modifyOrderItem)
        setHighlightedItem({
          id: modifyOrderItem.id,
          type: 'edited'
        });

      setTimeout(() => {
        setHighlightedItem(null);
      }, 3000);
    } catch (error) {
      console.error("Error removing order:", error);
    } finally {
      setIsModifying(false);
    }
  };


  const handleRemoveItem = async (id: number) => {
    setIsDeleting(true);
    try {
    await handleDeleteOrderItem(id);
    const Orders = await fetchAssignedItems();
    setOrders(Orders);
    setIsModifyOpen(false);
    setSelectedOrder(null);
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const allFleetCount = orders.filter((order) => !order.archived).length;
  const donyaDonyaCount = orders.filter(
    (order) => !order.archived && order.fleet.fleet_name === "F/B DONYA DONYA 2x"
  ).length;
  const donaLibradaCount = orders.filter(
    (order) => !order.archived && fixEncoding(order.fleet.fleet_name) === "F/B Doña Librada"
  ).length;

  return (
    <div>
      <main className="flex-1">
        <PageTitle title={activeFleet} />
        {isLoading ? (
          <OrdersSkeleton />
        ) : (
          <>
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

            <div className="p-[30px]">
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
                highlightedItem={highlightedItem}
              />
            </div>
          </>
        )}
        <ModifyModal
          isOpen={isModifyOpen}
          setIsOpen={setIsModifyOpen}
          onModify={handleEditItem}
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