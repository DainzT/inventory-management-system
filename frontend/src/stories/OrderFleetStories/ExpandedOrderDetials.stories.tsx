import type { Meta, StoryObj } from "@storybook/react";
import { ExpandedOrderDetails } from "../../components/orders/OrdersManagementTable/ExpandedOrderDetails";
import { OrderItem } from "@/types/order-item";

const mockOrder: OrderItem = {
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
  lastUpdated: new Date("2025-04-29T14:24:43.369Z"),
  archived: false,
};

const meta: Meta<typeof ExpandedOrderDetails> = {
  title: "Order Components/ExpandedOrderDetails",
  component: ExpandedOrderDetails,
  tags: ["autodocs"],
  argTypes: {
    order: {
      control: "object",
      description: "Order details object",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ExpandedOrderDetails>;

export const Default: Story = {
  args: {
    order: mockOrder,
  },
};

export const UnassignedFleet: Story = {
  args: {
    order: {
      ...mockOrder,
      fleet: { id: 0, fleet_name: "Unassigned" },
    },
  },
};

export const NoLastUpdated: Story = {
  args: {
    order: {
      ...mockOrder,
      lastUpdated: undefined,
    },
  },
};
