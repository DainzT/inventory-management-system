import React, { useState, useEffect } from "react";
import { FleetCard } from "@/components/OrderFleetDisplay/FleetCards";
import { OrdersTable } from "@/components/OrderFleetDisplay/OrdersTable";
import { OrderItem } from "@/types/order-item";
import { ModifyModal } from "@/components/ModifyModal/ModifyModal";
import { fetchAssignedItems, updateArchivedStatus } from "@/api/orderAPI";
import { PageTitle } from "@/components/PageTitle";

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
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);
  const [archivedOrders, setArchivedOrders] = useState<OrderItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFleet, setActiveFleet] = useState("All Fleets");
  const [selectedBoat, setSelectedBoat] = useState("All Boats");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(
    null
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchAssignedItems();
        console.log("Fetched orders:", response);
        setOrders(response);
        setFilteredOrders(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const updatedArchivedOrders = orders.map((order) => {
      const orderDate = new Date(order.outDate);
      const isPastMonth =
        orderDate.getFullYear() < currentYear ||
        (orderDate.getFullYear() === currentYear &&
          orderDate.getMonth() < currentMonth);

      return {
        ...order,
        archived: isPastMonth,
      };
    });

    setArchivedOrders(updatedArchivedOrders);

    const updateArchiveInDB = async () => {
      try {
        console.log("Updating archive in DB:", updatedArchivedOrders); // Log the data
        await updateArchivedStatus(updatedArchivedOrders);
        console.log("Archived status updated in the database");
      } catch (error) {
        console.error(
          "Failed to update archived status in the database:",
          error
        );
      }
    };

    updateArchiveInDB();
  }, [orders]);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const filteredOrders = archivedOrders.filter((order) => {
      const orderDate = new Date(order.outDate);
      const isCurrentMonth =
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear;

      const matchesSearch = [
        order.name.toLowerCase(),
        order.note.toLowerCase(),
        order.quantity.toString(),
        order.unitPrice.toString(),
        order.selectUnit.toLowerCase(),
        order.unitSize.toString(),
        order.total?.toString() || "",
        order.boat.boat_name.toLowerCase(),
        order.outDate.toString(),
      ].some((field) => field.includes(searchQuery.toLowerCase()));

      const matchesFleet =
        activeFleet === "All Fleets" ||
        fleetBoats[activeFleet as keyof typeof fleetBoats]?.includes(
          order.boat.boat_name
        ) ||
        order.boat.boat_name === activeFleet;

      const matchesBoat =
        selectedBoat === "All Boats" || order.boat.boat_name === selectedBoat;

      return isCurrentMonth && matchesSearch && matchesFleet && matchesBoat;
    });

    setFilteredOrders(filteredOrders);
  }, [archivedOrders, searchQuery, activeFleet, selectedBoat]);

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
      <main className="flex-1 p-0">
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
