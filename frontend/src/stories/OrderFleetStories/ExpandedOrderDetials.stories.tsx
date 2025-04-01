import type { Meta, StoryObj } from "@storybook/react";
import { ExpandedOrderDetails } from "../../components/OrderFleetDisplay/ExpandedOrderDetails";
import { OrderItemProps } from "@/types/fleetorders";

const mockOrder: OrderItemProps = {
  id: 1,
  productName: "Fishing Reel",
  note: "Spinning reel, corrosion-resistant",
  quantity: 1,
  unitPrice: 480.0,
  selectUnit: "piece",
  unitSize: 2,
  total: 480.0,
  fleet: "F/B DONYA DONYA 2X",
  boat: "F/B Lady Rachelle",
  dateOut: "Jan 15, 2024",
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
      fleet: "Unassigned",
    },
  },
};

export const NoUnit: Story = {
  args: {
    order: {
      ...mockOrder,
      selectUnit: "No unit",
      unitSize: "No unit",
    },
  },
};
