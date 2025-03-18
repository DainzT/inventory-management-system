"use client";
import React, { useState } from "react";
import { FleetCard } from "./FleetCard";
import { OrdersTable } from "./OrdersTable";
import { OrderItemProps } from "@/types/FleetsOrder";

interface MainContentProps {
  activeFleet: string;
  onFleetSelect: (fleet: string) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  activeFleet,
  onFleetSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("All Boats");

  const orders: OrderItemProps[] = [
    {
      id: 1,
      productName: "Fishing Reel",
      description: "Spinning reel, corrosion-resistant",
      quantity: 8,
      unitPrice: 60.0,
      fleet: "F/B Doña Librada",
      dateOut: "Jan 15, 2024",
    },
    {
      id: 2,
      productName: "Nylon Fishing Line",
      description: "500m, high-tensile strength",
      quantity: 25,
      unitPrice: 150.5,
      fleet: "F/B DONYA DONYA",
      dateOut: "Jan 20, 2024",
    },
  ];

  const handleModify = (id: number) => {
    console.log(`Modify order with ID: ${id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (filter: string) => {
    setFilterValue(filter);
  };

  const filteredOrders = orders.filter((order) => {
    // Convert all fields to strings and make them lowercase for case-insensitive search
    const searchableFields = [
      order.productName.toLowerCase(),
      order.description.toLowerCase(),
      order.quantity.toString(),
      order.unitPrice.toString(),
      order.fleet.toLowerCase(),
      order.dateOut.toLowerCase(),
    ];

    // Check if any field includes the search query
    const matchesSearch = searchableFields.some((field) =>
      field.includes(searchQuery.toLowerCase())
    );

    // Filter by selected fleet
    const matchesFleet =
      filterValue === "All" || order.fleet === filterValue;

    return matchesSearch && matchesFleet;
  });

  return (
    <main className="flex-1 p-10">
      <h1 className="text-6xl font-bold text-cyan-800">Orders</h1>

      <div className="flex gap-3 mt-12">
        <FleetCard
          title="All Fleets"
          backgroundColor="bg-emerald-800"
          onClick={() => onFleetSelect("All Fleets")}
        />
        <FleetCard
          title="Fleet 1"
          backgroundColor="bg-cyan-800"
          onClick={() => onFleetSelect("Fleet 1")}
        />
        <FleetCard
          title="Fleet 2"
          backgroundColor="bg-red-800"
          onClick={() => onFleetSelect("Fleet 2")}
        />
      </div>

      <h2 className="mt-24 text-6xl font-bold text-cyan-800">
        Orders for {activeFleet}
      </h2>

      <div className="flex gap-9 mt-10">
        <OrdersTable
          orders={filteredOrders}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onModify={handleModify}
        />
      </div>
    </main>
  );
};

