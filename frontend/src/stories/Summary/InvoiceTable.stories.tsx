import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import {
  InvoiceTable,
  InvoiceTableProps,
} from "@/components/Summary/InvoiceTable";
import { GroupedOrders } from "@/types";

export default {
  title: "Summary Components/InvoiceTable",
  component: InvoiceTable,
} as Meta<typeof InvoiceTable>;

const sampleItemSummary: GroupedOrders[] = [
  {
    boatId: 1,
    boatName: "F/B Ruth Gaily",
    orders: [
      {
        id: 1,
        name: "Fishing Reel",
        note: "Spinning reel, corrosion-resistant",
        quantity: 1,
        unitPrice: 480.0,
        selectUnit: "piece",
        unitSize: 2,
        total: 480.0,
        fleet: { id: 2, fleet_name: "F/B Doña Librada" },
        boat: { id: 8, fleet_id: 2, boat_name: "F/B Ruth Gaily" },
        outDate: new Date("2024-01-15"),
        archived: false,
      },
    ],
  },
  {
    boatId: 2,
    boatName: "F/V Vadeo Scout",
    orders: [
      {
        id: 3,
        name: "Hook",
        note: "small size",
        quantity: 10,
        unitPrice: 12.5,
        selectUnit: "pack",
        unitSize: 10,
        total: 125,
        fleet: { id: 2, fleet_name: "F/B Doña Librada" },
        boat: { id: 9, fleet_id: 2, boat_name: "F/V Vadeo Scout" },
        outDate: new Date("2024-01-30"),
        archived: false,
      },
    ],
  },
  {
    boatId: 3,
    boatName: "F/B Adomar",
    orders: [
      {
        id: 2,
        name: "Nylon Fishing Line",
        note: "500m, high-tensile strength",
        quantity: 25,
        unitPrice: 150.5,
        selectUnit: "roll",
        unitSize: 1,
        total: 3762.5,
        fleet: { id: 2, fleet_name: "F/B Doña Librada" },
        boat: { id: 6, fleet_id: 2, boat_name: "F/B Adomar" },
        outDate: new Date("2024-01-20"),
        archived: false,
      },
    ],
  },
];

export const Default: StoryFn<typeof InvoiceTable> = (args) => (
  <InvoiceTable {...args} />
);

Default.args = {
  itemSummary: sampleItemSummary,
} as InvoiceTableProps;

export const NoOrders: StoryFn<typeof InvoiceTable> = (args) => (
  <InvoiceTable {...args} />
);

NoOrders.args = {
  itemSummary: [],
} as InvoiceTableProps;
