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
    name: "Fishing Reel Pro X",
    note: "Spinning reel, corrosion-resistant",
    quantity: 2,
    unitPrice: 89.99,
    selectUnit: "piece",
    unitSize: 1,
    total: 179.98,
    dateCreated: new Date("2023-05-15"),
    lastUpdated: new Date("2023-05-15"),
  },
  {
    id: 2,
    name: "Titanium Fishing Hooks",
    note: "Size 4, pack of 10",
    quantity: 5,
    unitPrice: 12.50,
    selectUnit: "pack",
    unitSize: 5,
    total: 62.50 / 5,
    dateCreated: new Date("2023-05-16"),
    lastUpdated: new Date("2023-05-16"),
  },
  {
    id: 3,
    name: "Carbon Fiber Fishing Rod",
    note: "7ft medium action",
    quantity: 1,
    unitPrice: 149.95,
    selectUnit: "piece",
    unitSize: 1,
    total: 149.95,
    dateCreated: new Date("2023-05-17"),
    lastUpdated: new Date("2023-05-17"),
  },
  {
    id: 4,
    name: "Waterproof Tackle Box",
    note: "Large capacity with 3 trays",
    quantity: 3,
    unitPrice: 45.00,
    selectUnit: "piece",
    unitSize: 1,
    total: 135.00,
    dateCreated: new Date("2023-05-18"),
    lastUpdated: new Date("2023-05-18"),
  },
  {
    id: 5,
    name: "Fishing Line (300yds)",
    note: "20lb test, braided",
    quantity: 4,
    unitPrice: 24.99,
    selectUnit: "roll",
    unitSize: 1,
    total: 99.96,
    dateCreated: new Date("2023-05-19"),
    lastUpdated: new Date("2023-05-19"),
  },
  {
    id: 6,
    name: "Fishing Lures Set",
    note: "12-piece assorted colors",
    quantity: 2,
    unitPrice: 18.75,
    selectUnit: "set",
    unitSize: 1,
    total: 37.50,
    dateCreated: new Date("2023-05-20"),
    lastUpdated: new Date("2023-05-20"),
  },
  {
    id: 7,
    name: "Fishing Waders",
    note: "Breathable, size L",
    quantity: 1,
    unitPrice: 129.99,
    selectUnit: "pair",
    unitSize: 1,
    total: 129.99,
    dateCreated: new Date("2023-05-21"),
    lastUpdated: new Date("2023-05-21"),
  },
  {
    id: 8,
    name: "Fishing Net",
    note: "Rubber-coated, extendable handle",
    quantity: 1,
    unitPrice: 35.50,
    selectUnit: "piece",
    unitSize: 1,
    total: 35.50,
    dateCreated: new Date("2023-05-22"),
    lastUpdated: new Date("2023-05-22"),
  },
  {
    id: 9,
    name: "Fishing Pliers",
    note: "Stainless steel with line cutter",
    quantity: 2,
    unitPrice: 22.99,
    selectUnit: "piece",
    unitSize: 1,
    total: 45.98,
    dateCreated: new Date("2023-05-23"),
    lastUpdated: new Date("2023-05-23"),
  },
  {
    id: 10,
    name: "Fishing Hat",
    note: "UV protection, adjustable",
    quantity: 3,
    unitPrice: 19.99,
    selectUnit: "piece",
    unitSize: 1,
    total: 59.97,
    dateCreated: new Date("2023-05-24"),
    lastUpdated: new Date("2023-05-24"),
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
  {
    id: 1, 
    item_id: inventoryItems[0],
    fleet_id: fleets[0], 
    boat_id: boats[1], 
    quantity: 5,
    total: 5 * Number(inventoryItems[0].unitPrice),
    outDate: new Date("2025-05-10"),
    lastUpdated: new Date("2023-05-10"),
  },
  {
    id: 2, 
    item_id: inventoryItems[1],
    fleet_id: fleets[0],
    boat_id: boats[2], 
    quantity: 2,
    total: 2 * Number(inventoryItems[1].unitPrice),
    outDate: new Date("2025-05-18"),
    lastUpdated: new Date("2023-05-17"),
  },
  {
    id: 3, 
    item_id: inventoryItems[0],
    fleet_id: fleets[0],
    boat_id: boats[4], 
    quantity: 8,
    total: 8 * Number(inventoryItems[0].unitPrice),
    outDate: new Date("2025-05-22"),
    lastUpdated: null,
  },

  {
    id: 1, 
    item_id: inventoryItems[2],
    fleet_id: fleets[1],
    boat_id: boats[6], 
    quantity: 10,
    total: 10 * Number(inventoryItems[2].unitPrice),
    outDate: new Date("2025-05-15"),
    lastUpdated: null,
  },
  {
    id: 2, 
    item_id: inventoryItems[3],
    fleet_id: fleets[1],
    boat_id: boats[8], 
    quantity: 1,
    total: 1 * Number(inventoryItems[3].unitPrice),
    outDate: new Date("2025-05-20"),
    lastUpdated: new Date("2026-05-19"),
  },
  {
    id: 3, 
    item_id: inventoryItems[0],
    fleet_id: fleets[1],
    boat_id: boats[6], 
    quantity: 3,
    total: 3 * Number(inventoryItems[0].unitPrice),
    outDate: new Date("2025-05-22"),
    lastUpdated: null,
  },
  {
    id: 4, 
    item_id: inventoryItems[7],
    fleet_id: fleets[1],
    boat_id: boats[7], 
    quantity: 3,
    total: 3 * Number(inventoryItems[7].unitPrice),
    outDate: new Date("2025-05-22"),
    lastUpdated: null,
  },
  {
    id: 5, 
    item_id: inventoryItems[8],
    fleet_id: fleets[1],
    boat_id: boats[8], 
    quantity: 3,
    total: 3 * Number(inventoryItems[8].unitPrice),
    outDate: new Date("2025-05-22"),
    lastUpdated: null,
  },
  {
    id: 6, 
    item_id: inventoryItems[6],
    fleet_id: fleets[1],
    boat_id: boats[8], 
    quantity: 3,
    total: 3 * Number(inventoryItems[6].unitPrice),
    outDate: new Date("2025-05-22"),
    lastUpdated: null,
  },
  {
    id: 7, 
    item_id: inventoryItems[4],
    fleet_id: fleets[1],
    boat_id: boats[8], 
    quantity: 3,
    total: 3 * Number(inventoryItems[4].unitPrice),
    outDate: new Date("2025-05-22"),
    lastUpdated: null,
  },
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
  
    <div className="flex-1 p-0">
      <PageTitle title={String(modifiedName)}/>
      <SummaryDesign
         orders={filteredOrders}
      />
    </div>
  );
};

export default Summary;