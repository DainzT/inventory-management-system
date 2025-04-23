import type { Meta, StoryObj } from "@storybook/react";
import { FleetCard } from "../../components/OrderFleetDisplay/FleetCards";

const defaultArgs = {
  title: "Fleet Card",
  backgroundColor: "bg-cyan-800",
  isActive: false,
  onClick: () => console.log("Fleet card clicked"),
};

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
  play: async () => {
    console.log("All Fleets card is active:", true);
  },
};

export const DonyaDonya: Story = {
  args: {
    ...defaultArgs,
    title: "F/B DONYA DONYA 2X",
    backgroundColor: "bg-cyan-800",
    isActive: true,
  },
  play: async () => {
    console.log("Donya Donya card is active:", true);
  },
};

export const DonaLibrada: Story = {
  args: {
    ...defaultArgs,
    title: "F/B Doña Librada",
    backgroundColor: "bg-red-800",
    isActive: true,
  },
  play: async () => {
    console.log("Dona Librada card is active:", true);
  },
};

export const Inactive: Story = {
  args: {
    ...defaultArgs,
    title: "Inactive Fleet",
    backgroundColor: "bg-cyan-800",
    isActive: false,
  },
  play: async () => {
    console.log("Inactive card is active:", false);
  },
};
