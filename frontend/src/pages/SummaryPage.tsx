import React from "react";
import { InventoryItem } from "@/types";
import SummaryDesign from "@/components/Summary/SummaryDesign";
import { PageTitle } from "@/components/PageTitle";
import { Boat, Fleet, Order } from "@/types";
import { useParams } from "react-router-dom";

// Mock Data
const inventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: "Marine Engine Oil",
    note: "Synthetic 10W-40",
    quantity: 50,
    unitPrice: 45.99,
    selectUnit: "liter",
    unitSize: 5,
    total: 45.99 * 50,
    dateCreated: new Date("2023-01-15"),
    lastUpdated: new Date("2023-05-10")
  },
  {
    id: 2,
    name: "Propeller Blades",
    note: "Stainless steel 3-blade",
    quantity: 15,
    unitPrice: 320.50,
    selectUnit: "piece",
    unitSize: 1,
    total: 320.50 * 15,
    dateCreated: new Date("2023-02-20")
  },
  {
    id: 3,
    name: "Life Jackets",
    note: "Coast guard approved",
    quantity: 200,
    unitPrice: 28.75,
    selectUnit: "piece",
    unitSize: 1,
    total: 28.75 * 200,
    dateCreated: new Date("2023-03-05"),
    lastUpdated: new Date("2023-05-15")
  },
  {
    id: 4,
    name: "GPS Units",
    note: "With chartplotter",
    quantity: "",
    unitPrice: 499.99,
    selectUnit: "unit",
    unitSize: 1,
    total: "",
    dateCreated: new Date("2023-04-01")
  }
  
];

const fleets: Fleet[] = [
  { id: 1, name: "F/B DONYA DONYA 2x"},
  { id: 2, name: "F/B Doña Librada"},
];

const boats: Boat[] = [
  { id: 1, name: "F/B Lady Rachelle", fleet_id: 1 },
  { id: 2, name: "F/B Mariella", fleet_id: 1 },
  { id: 3, name: "F/B My Shield", fleet_id: 1 },
  { id: 4, name: "F/B Abigail", fleet_id: 1 },
  { id: 5, name: "F/B DC-9", fleet_id: 1 },
  
  { id: 6, name: "F/B Adomar", fleet_id: 2 },
  { id: 7, name: "F/B Prince of Peace", fleet_id: 2 },
  { id: 8, name: "F/B Ruth Gaily", fleet_id: 2 },
  { id: 9, name: "F/V Vadeo Scout", fleet_id: 2 },
  { id: 10, name: "F/B Mariene", fleet_id: 2 }
];

const orders: Order[] = [
  // Fleet 1 (F/B DONYA DONYA 2x) orders - IDs start with 1
  {
    id: 1, // First order in Fleet 1
    item_id: inventoryItems[0],
    fleet_id: fleets[0], 
    boat_id: boats[1], // F/B Mariella
    quantity: 5,
    total: 5 * Number(inventoryItems[0].unitPrice),
    outDate: new Date("2023-05-10"),
    lastUpdated: new Date("2023-05-10"),
  },
  {
    id: 2, // Second order in Fleet 1
    item_id: inventoryItems[1],
    fleet_id: fleets[0],
    boat_id: boats[2], // F/B My Shield
    quantity: 2,
    total: 2 * Number(inventoryItems[1].unitPrice),
    outDate: new Date("2023-05-18"),
    lastUpdated: new Date("2023-05-17"),
  },
  {
    id: 3, // Third order in Fleet 1
    item_id: inventoryItems[0],
    fleet_id: fleets[0],
    boat_id: boats[4], // F/B DC-9
    quantity: 8,
    total: 8 * Number(inventoryItems[0].unitPrice),
    outDate: new Date("2023-05-22"),
    lastUpdated: null,
  },

  // Fleet 2 (F/B Doña Librada) orders - IDs start with 1
  {
    id: 1, // First order in Fleet 2
    item_id: inventoryItems[2],
    fleet_id: fleets[1],
    boat_id: boats[6], // F/B Prince of Peace
    quantity: 10,
    total: 10 * Number(inventoryItems[2].unitPrice),
    outDate: new Date("2025-05-15"),
    lastUpdated: null,
  },
  {
    id: 2, // Second order in Fleet 2
    item_id: inventoryItems[3],
    fleet_id: fleets[1],
    boat_id: boats[8], // F/V Vadeo Scout
    quantity: 1,
    total: 1 * Number(inventoryItems[3].unitPrice),
    outDate: new Date("2024-05-20"),
    lastUpdated: new Date("2026-05-19"),
  },
  {
    id: 3, // Third order in Fleet 2
    item_id: inventoryItems[0],
    fleet_id: fleets[1],
    boat_id: boats[6], // F/B Prince of Peace
    quantity: 3,
    total: 3 * Number(inventoryItems[0].unitPrice),
    outDate: new Date("2023-05-22"),
    lastUpdated: null,
  }
];

const Summary: React.FC = () => {
  const { fleetName } = useParams<{ fleetName: string }>();
  const modifiedName = fleetName === "f/b-dona-librada" 
  ? fleetName.replace(/n/g, 'ñ')?.replaceAll("-", " ").toUpperCase()
  : fleetName?.replaceAll("-", " ").toUpperCase(); 


  const filteredOrders = 
    !fleetName || fleetName === "all-fleets" 
      ? orders 
      : orders.filter((order) => 
          order.fleet_id?.name.toUpperCase() === modifiedName
      );

  return (
  
    <div className="p-4">
      <PageTitle title={String(modifiedName)}/>
      <SummaryDesign
         orders={filteredOrders}
      />
    </div>
  );
};

export default Summary;