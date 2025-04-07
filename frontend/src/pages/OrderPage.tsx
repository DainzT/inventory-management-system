import React, { useState, useEffect } from "react";
import { FleetCard } from "@/components/OrderFleetDisplay/FleetCards";
import { OrdersTable } from "@/components/OrderFleetDisplay/OrdersTable";
import { OrderItemProps } from "@/types/fleet-order";
import { ModifyModal } from "@/components/ModifyModal/ModifyModal";
import { fetchAssignedItems } from "@/api/orderAPI";

const fleetBoats = {
  "F/B DONYA DONYA 2X": [
    "F/B Lady Rachelle",
    "F/B Mariella",
    "F/B My Shield",
    "F/B Abigail",
    "F/B DC-9",
  ],
  "F/B Doña Librada": [
    "F/B Adomar",
    "F/B Prince of Peace",
    "F/B Ruth Gaily",
    "F/V Vadeo Scout",
    "F/B Mariene",
  ],
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderItemProps[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderItemProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFleet, setActiveFleet] = useState("All Fleets");
  const [selectedBoat, setSelectedBoat] = useState("All Boats");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderItemProps | null>(
    null
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchAssignedItems();
        console.log("Fetched orders:", response);
        setOrders(response);
        setFilteredOrders(response); // Initialize filtered orders with all orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length >= 0) {
      const filteredOrders = orders?.filter((order) => {
        const matchesSearch = [
          order.item.name.toLowerCase(),
          order.item.note.toLowerCase(),
          order.quantity.toString(),
          order.item.unitPrice.toString(),
          order.item.selectUnit.toLowerCase(),
          order.item.unitSize.toString(),
          order.total?.toString() || "",
          order.boat.boat_name.toLowerCase(),
          order.outDate as string,
        ].some((field) => field.includes(searchQuery.toLowerCase()));

        const matchesFleet =
          activeFleet === "All Fleets" ||
          fleetBoats[activeFleet as keyof typeof fleetBoats]?.includes(
            order.boat.boat_name
          ) ||
          order.boat.boat_name === activeFleet;

        const matchesBoat =
          selectedBoat === "All Boats" || order.boat.boat_name === selectedBoat;

        return matchesSearch && matchesFleet && matchesBoat;
      });

      setFilteredOrders(filteredOrders);
    }
  }, [orders, searchQuery, activeFleet, selectedBoat]);

  const handleModify = (id: number) => {
    const order = orders.find((order) => order.id === id);
    if (order) {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (boat: string) => {
    setSelectedBoat(boat);
  };

  const handleFleetSelect = (fleet: string) => {
    setActiveFleet(fleet);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleConfirmChanges = (
    quantity: number,
    fleet: string,
    boat: string,
    unit: string
  ) => {
    if (selectedOrder) {
      console.log("Changes confirmed:", {
        selectedOrder,
        quantity,
        fleet,
        boat,
        unit,
      });
      setIsModalOpen(false);
    }
  };

  const handleRemoveItem = () => {
    if (selectedOrder) {
      console.log("Item removed:", selectedOrder);
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <main className="flex-1">
        <h1 className="mt-4 text-5xl font-bold text-[#295C65]">
          Orders for {activeFleet}
        </h1>

        <div className="-mt-5 flex justify-center items-center gap-25  h-[300px]">
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

        <div className="-mt-5 scale-97">
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
