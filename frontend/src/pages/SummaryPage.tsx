import React from "react";
import SummaryDesign from "@/components/Summary/SummaryDesign";
import { PageTitle } from "@/components/PageTitle";
import { Boat, Fleet, Order } from "@/types";
import { useParams } from "react-router-dom";

const fleets: Fleet[] = [
  { id: 1, name: "F/B DONYA DONYA 2x" },
  { id: 2, name: "F/B Doña Librada" },
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
      name: "Engine Oil 15W-40",
      note: "For main engine service",
      quantity: 20,
      unitPrice: 450,
      selectUnit: "liters",
      unitSize: 1,
      total: 9000,
      fleet_id: fleets[0],
      boat_id: boats[1], // F/B Mariella
      archived: false,
      outDate: new Date("2025-05-10"),
      lastUpdated: new Date("2023-05-10"),
    },
    {
      id: 2,
      name:"Engine Oil 15W-40",
      note: "For main engine service",
      quantity: 4,
      unitPrice: 1200,
      selectUnit: "pieces",
      unitSize: 1,
      total: 4800,
      fleet_id: fleets[0],
      boat_id: boats[1], // F/B My Mariella
      archived: false,
      outDate: new Date("2025-05-10"),
      lastUpdated: new Date("2023-05-12"),
    },
    {
      id: 3,
      name: "Paint (Blue)",
      note: "Hull repainting",
      quantity: 15,
      unitPrice: 650,
      selectUnit: "gallons",
      unitSize: 1,
      total: 9750,
      fleet_id: fleets[0],
      boat_id: boats[1],  // F/B My Mariella
      archived: false,
      outDate: new Date("2025-05-15"),
      lastUpdated: new Date("2023-05-15"),
    },
    {
      id: 4,
      name: "Propeller",
      note: "Spare propeller",
      quantity: 1,
      unitPrice: 25000,
      selectUnit: "pieces",
      unitSize: 1,
      total: 25000,
      fleet_id: fleets[0],
      boat_id: boats[0], // F/B Lady Rachelle
      archived: true,
      outDate: new Date("2025-05-20"),
      lastUpdated: new Date("2023-05-20"),
    },
    {
      id: 5,
      name: "Fishing Nets",
      note: "Replacement nets",
      quantity: 2,
      unitPrice: 18000,
      selectUnit: "sets",
      unitSize: 1,
      total: 36000,
      fleet_id: fleets[1],
      boat_id: boats[7], // F/B Ruth Gaily
      archived: false,
      outDate: new Date("2025-05-18"),
      lastUpdated: new Date("2023-05-18"),
    },
    {
      id: 6,
      name: "Coolant",
      note: "Engine cooling system",
      quantity: 30,
      unitPrice: 320,
      selectUnit: "liters",
      unitSize: 1,
      total: 9600,
      fleet_id: fleets[0],
      boat_id: boats[3], // F/B Abigail
      archived: false,
      outDate: new Date("2026-05-05"),
      lastUpdated: new Date("2023-05-05"),
    },
    {
      id: 7,
      name: "Navigation Lights",
      note: "Port and starboard lights",
      quantity: 2,
      unitPrice: 3500,
      selectUnit: "sets",
      unitSize: 1,
      total: 7000,
      fleet_id: fleets[1],
      boat_id: boats[6], // F/B Prince of Peace
      archived: false,
      outDate: new Date("2025-05-22"),
      lastUpdated: new Date("2023-05-22"),
    },
    {
      id: 8,
      name: "Life Jackets",
      note: "Crew safety equipment",
      quantity: 12,
      unitPrice: 1200,
      selectUnit: "pieces",
      unitSize: 1,
      total: 14400,
      fleet_id: fleets[0],
      boat_id: boats[4], // F/B DC-9
      archived: false,
      outDate: new Date("2025-05-08"),
      lastUpdated: new Date("2023-05-08"),
    },
    {
      id: 9,
      name: "Anchor Chain",
      note: "50m replacement chain",
      quantity: 1,
      unitPrice: 42000,
      selectUnit: "set",
      unitSize: 1,
      total: 42000,
      fleet_id: fleets[1],
      boat_id: boats[8], // F/V Vadeo Scout
      archived: false,
      outDate: new Date("2025-05-25"),
      lastUpdated: new Date("2023-05-25"),
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
      )
      console.log(filteredOrders)
  return (
    <div className="flex-1 p-0">
      <PageTitle title={String(modifiedName)} />
      <SummaryDesign
        fleetName={String(fleetName)}
        orders={filteredOrders}
      />
    </div>
  );
};

export default Summary;