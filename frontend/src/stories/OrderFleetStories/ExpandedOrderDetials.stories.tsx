import type { Meta, StoryObj } from "@storybook/react";
import { ExpandedOrderDetails } from "../../components/OrderFleetDisplay/ExpandedOrderDetails";
import { OrderItemProps } from "@/types/fleet-order";

const mockOrder: OrderItemProps = {
  id: 1,
  name: "Fishing Reel",
  note: "Spinning reel, corrosion-resistant",
  quantity: 1,
  unitPrice: 480.0,
  selectUnit: "piece",
  unitSize: 2,
  total: 480.0,
  fleet: { id: 2, name: "F/B Doña Librada" },
  boat: { id: 8, fleet_id: 2, boat_name: "F/B Ruth Gaily" },
  outDate: "Jan 15, 2024",
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
      fleet: { id: 0, name: "Unassigned" },
    },
  },
};

export const NoUnit: Story = {
  args: {
    order: {
      ...mockOrder,
      selectUnit: "",
      unitSize: "",
    },
  },
};
