import ModifyModal from "@/components/ModifyModal";
import React, { useState } from "react";
import { ProductItemProps } from "@/components/ProductItemProps";
import { FleetCard } from "@/components/OrderFleetDisplay/FleetCards";
import { OrdersTable } from "@/components/OrderFleetDisplay/OrdersTable";
import { OrderItemProps } from "@/types/FleetsOrder";

const fleetBoats = {
  "F/B Donya Donya": [
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
  const orders: OrderItemProps[] = [
    {
      id: 1,
      productName: "Fishing Reel",
      note: "Spinning reel, corrosion-resistant",
      quantity: 1,
      unitPrice: 480.0,
      selectUnit: "piece",
      unitSize: 2,
      total: 480.0,
      fleet: "F/B Donya Donya",
      dateOut: "Jan 15, 2024",
    },
    {
      id: 2,
      productName: "Nylon Fishing Line",
      note: "500m, high-tensile strength",
      quantity: 25,
      unitPrice: 150.5,
      selectUnit: "roll",
      unitSize: 1,
      total: 3762.5,
      fleet: "F/B Mariella",
      dateOut: "Jan 20, 2024",
    },
    {
      id: 3,
      productName: "Hook",
      note: "small size",
      quantity: 10,
      unitPrice: 12.5,
      selectUnit: "pack",
      unitSize: 10,
      total: 125,
      fleet: "F/B Mariene",
      dateOut: "Jan 30, 2024",
    },
  ];
  
   const handleModify = (id: number) => {
    console.log(`Modify order with ID: ${id}`);
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

  const product: ProductItemProps = {
    name: "Fishing Line",
    price: 60.00,
    description: "For catching fish",
    stock: 10,
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmChanges = (quantity: number, fleet: string, boat: string, unit: string) => {
    console.log('Changes confirmed:', { quantity, fleet, boat, unit });
    setIsModalOpen(false); 
  };

  const handleRemoveItem = () => {
    console.log('Item removed');
    setIsModalOpen(false);
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
      order.fleet.toLowerCase(),
      order.dateOut.toLowerCase(),
    ].some((field) => field.includes(searchQuery.toLowerCase()));

    const matchesFleet =
      activeFleet === "All Fleets" ||
      (fleetBoats[activeFleet as keyof typeof fleetBoats]?.includes(order.fleet)) ||
      order.fleet === activeFleet;

      const matchesBoat = selectedBoat === "All Boats" || order.fleet === selectedBoat;


    return matchesSearch && matchesFleet && matchesBoat;
  });

  return (
     <div className="p-4 bg-[#F4F4F4] h-full">
      <main className="flex-1 p-10">
        <h1 className="text-6xl font-bold text-cyan-800">Orders</h1>

        <div className="flex gap-8 mt-12 h-[260px]">
          <FleetCard
            title="All Fleets"
            backgroundColor="bg-emerald-800"
            isActive={activeFleet === "All Fleets"}
            onClick={() => handleFleetSelect("All Fleets")}
          />
          <FleetCard
            title="F/B Donya Donya"
            backgroundColor="bg-cyan-800"
            isActive={activeFleet === "F/B Donya Donya"}
            onClick={() => handleFleetSelect("F/B Donya Donya")}
          />
          <FleetCard
            title="F/B Doña Librada"
            backgroundColor="bg-red-800"
            isActive={activeFleet === "F/B Doña Librada"}
            onClick={() => handleFleetSelect("F/B Doña Librada")}
          />
        </div>

        <h2 className="mt-15 text-5xl font-bold text-cyan-800">
          Orders for {activeFleet}
        </h2>

        <div className="flex gap-9 mt-10">
          <OrdersTable
            orders={filteredOrders}
            onSearch={handleSearch}
            onFilter={handleFilter}
            onModify={handleModify}
          />
       
      <ModifyModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmChanges}
        onRemove={handleRemoveItem}
        product={product} // Pass the product data to the modal
      />
      
     </div>
    </main>
  );
};

export default Orders;