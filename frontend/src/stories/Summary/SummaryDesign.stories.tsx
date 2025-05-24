import { Meta, StoryFn } from "@storybook/react";
import SummaryDesign from "@/components/summary/SummaryDesign";
import { OrderItem } from "@/types";

export default {
  title: "Summary Components/SummaryDesign",
  component: SummaryDesign,
  decorators: [],
} as Meta<typeof SummaryDesign>;

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
    fleet: { id: 2, fleet_name: "F/B Doña Librada" },
    boat: { id: 8, fleet_id: 2, boat_name: "F/B Ruth Gaily" },
    outDate: new Date("2024-01-15"),
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
    outDate: new Date("2024-01-30"),
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
    outDate: new Date("2024-01-20"),
    archived: false,
  },
];

export const Default: StoryFn<typeof SummaryDesign> = () => (
  <SummaryDesign
    orders={sampleOrders}
    fleetName="F/B Doña Librada"
    isLoading={false}
  />
);

export const Loading: StoryFn<typeof SummaryDesign> = () => (
  <SummaryDesign orders={[]} fleetName="F/B Doña Librada" isLoading={true} />
);

export const NoOrders: StoryFn<typeof SummaryDesign> = () => (
  <SummaryDesign orders={[]} fleetName="F/B Doña Librada" isLoading={false} />
);