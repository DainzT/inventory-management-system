import { Meta, StoryFn } from "@storybook/react";

import { Invoice, InvoiceProps } from "@/components/summary/Invoice";
import { OrderItem } from "@/types/order-item";


export default {
  title: "Summary Components/Invoice",
  component: Invoice,
  decorators: [
    (Story) => (
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

const Template: StoryFn<InvoiceProps> = (args: InvoiceProps) => (
  <Invoice {...args} />
);

const sampleOrders: OrderItem[] = [
  {
    id: 1,
    name: "Fishing Reel",
    note: "Spinning reel, corrosion-resistant",
    quantity: 1,
    unitPrice: 480.0,
    selectUnit: "piece",
    unitSize: 2,
    total: 480.0,
    fleet: { id: 2, fleet_name: "F/B DONYA DONYA 2x" },
    boat: { id: 8, fleet_id: 2, boat_name: "F/B DC-9" },
    outDate: new Date("Jan 15, 2024"),
    archived: false,
  },
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
    outDate: new Date("Jan 30, 2024"),
    archived: false,
  },
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
    outDate: new Date("Jan 20, 2024"),
    archived: false,
  },
];

export const Default = Template.bind({});
Default.args = {
  orders: sampleOrders,
  selectedMonth: "January",
  selectedYear: 2024,
  total: 4367.5,
  fleetName: "All Fleets",
} as InvoiceProps;

export const SingleBoat = Template.bind({});
SingleBoat.args = {
  orders: sampleOrders.filter((order) => order.boat.boat_name === "F/B DC-9"),
  selectedMonth: "January",
  selectedYear: 2024,
  total: 480,
  fleetName: "F/B DONYA DONYA 2x",
} as InvoiceProps;

export const Empty = Template.bind({});
Empty.args = {
  orders: [],
  selectedMonth: "January",
  selectedYear: 2024,
  total: 0,
  fleetName: "F/B Doña Librada",
} as InvoiceProps;

