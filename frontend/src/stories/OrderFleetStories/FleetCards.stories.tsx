import type { Meta, StoryObj } from "@storybook/react";
import { FleetCard } from "../../components/OrderFleetDisplay/FleetCards";
import { Decorator } from "@storybook/react";

const defaultArgs = {
  title: "Fleet Card",
  backgroundColor: "bg-cyan-800",
  isActive: false,
  onClick: () => {},
};

const CenterDecorator: Decorator = (Story) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <Story />
  </div>
);

const meta: Meta<typeof FleetCard> = {
  title: "Order Components/FleetCard",
  component: FleetCard,
  tags: ["autodocs"],
  args: defaultArgs,
  argTypes: {
    backgroundColor: {
      control: "select",
      options: ["bg-cyan-800", "bg-emerald-800", "bg-red-800", "bg-gray-500"],
      description: "Tailwind background color class",
    },
    isActive: {
      control: "boolean",
      description: "Whether the card is in active state",
    },
    onClick: {
      action: "clicked",
      description: "Callback when card is clicked",
    },
  },
  decorators: [CenterDecorator],
} satisfies Meta<typeof FleetCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllFleets: Story = {
  args: {
    ...defaultArgs,
    title: "All Fleets",
    backgroundColor: "bg-emerald-800",
    isActive: true,
  },
};

export const DonyaDonya: Story = {
  args: {
    ...defaultArgs,
    title: "F/B DONYA DONYA 2X",
    backgroundColor: "bg-cyan-800",
    isActive: true,
  },
};

export const Inactive: Story = {
  args: {
    ...defaultArgs,
    title: "Inactive Fleet",
    backgroundColor: "bg-red-800",
    isActive: false,
  },
};
