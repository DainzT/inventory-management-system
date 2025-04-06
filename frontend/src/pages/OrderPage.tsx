import React, { useState } from "react";
import { FleetCard } from "@/components/OrderFleetDisplay/FleetCards";
import { OrdersTable } from "@/components/OrderFleetDisplay/OrdersTable";
import { OrderItemProps } from "@/types/fleetorders";
import { ModifyModal } from "@/components/ModifyModal/ModifyModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFleet, setActiveFleet] = useState("All Fleets");
  const [selectedBoat, setSelectedBoat] = useState("All Boats");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderItemProps | null>(
    null
  );

  const orders: OrderItemProps[] = [
    {
      id:1,
      productName: "Fishing Reel",
      note: "Spinning reel, corrosion-resistant",
      quantity: 1,
      unitPrice: 480.0,
      selectUnit: "piece",
      unitSize: 2,
      total: 480.0,
      fleet: "F/B DONYA DONYA 2X",
      boat: "F/B Lady Rachelle",
      dateOut: "Jan 15, 2024",
    },
    {
      id:2,
      productName: "Nylon Fishing Line",
      note: "500m, high-tensile strength",
      quantity: 25,
      unitPrice: 150.5,
      selectUnit: "roll",
      unitSize: 1,
      total: 3762.5,
      fleet: "F/B DONYA DONYA 2X",
      boat: "F/B Mariella",
      dateOut: "Jan 20, 2024",
    },
    {
      id:3,
      productName: "Hook",
      note: "small size",
      quantity: 10,
      unitPrice: 12.5,
      selectUnit: "pack",
      unitSize: 10,
      total: 125,
      fleet: "F/B Doña Librada",
      boat: "F/B Mariene",
      dateOut: "Jan 30, 2024",
    },
    {
      id:4,
      productName: "Rice",
      note: "Jasmine rice",
      quantity: 1,
      unitPrice: 130.00,
      selectUnit: "kilo",
      unitSize: 1,
      total: 130.00,
      fleet: "F/B DONYA DONYA 2X",
      boat: "F/B DC-9",
      dateOut: "Jan 15, 2024",
    },
  ];

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = [
      order.productName.toLowerCase(),
      order.note.toLowerCase(),
      order.quantity.toString(),
      order.unitPrice.toString(),
      order.selectUnit.toLowerCase(),
      order.unitSize.toString(),
      order.total?.toString() || "",
      order.boat.toLowerCase(),
      order.dateOut.toLowerCase(),
    ].some((field) => field.includes(searchQuery.toLowerCase()));

    const matchesFleet =
      activeFleet === "All Fleets" ||
      fleetBoats[activeFleet as keyof typeof fleetBoats]?.includes(
        order.boat
      ) ||
      order.boat === activeFleet;

    const matchesBoat =
      selectedBoat === "All Boats" || order.boat === selectedBoat;

    return matchesSearch && matchesFleet && matchesBoat;
  });

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

        <div className = "-mt-5 scale-97">
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
