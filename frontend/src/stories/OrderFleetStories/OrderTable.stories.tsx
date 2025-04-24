import type { Meta, StoryObj } from "@storybook/react";
import { OrdersTable } from "../../components/OrderFleetDisplay/OrdersTable";
import { OrderItemProps } from "@/types/fleet-order";
import { useState } from "react";

const meta: Meta<typeof OrdersTable> = {
  title: " Order Components/OrdersTable",
  component: OrdersTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OrdersTable>;

// Sample data
const sampleOrders: OrderItemProps[] = [
  {
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
  },
  {
    id: 3,
    productName: "Hook",
    note: "small size",
    quantity: 10,
    unitPrice: 12.5,
    selectUnit: "pack",
    unitSize: 10,
    total: 125,
    fleet: "F/B Doña Librada",
    boat: "F/B Mariene",
    dateOut: "Jan 30, 2024",
  },
  {
    id: 2,
    productName: "Nylon Fishing Line",
    note: "500m, high-tensile strength",
    quantity: 25,
    unitPrice: 150.5,
    selectUnit: "roll",
    unitSize: 1,
    total: 3762.5,
    fleet: "F/B DONYA DONYA 2X",
    boat: "F/B Mariella",
    dateOut: "Jan 20, 2024",
  },
];

// Template with state management
const Template: Story["render"] = (args) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("All Boats");
  const [isModifyOpen, setIsModifyOpen] = useState(false);

  const filteredOrders = sampleOrders.filter((order) => {
    const matchesSearch =
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.note.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterValue === "All Boats" || order.boat === filterValue;
    return matchesSearch && matchesFilter;
  });

  return (
    <OrdersTable
      {...args}
      orders={filteredOrders}
      onSearch={(query) => setSearchQuery(query)}
      onFilter={(filter) => setFilterValue(filter)}
      onModify={(id) => console.log(`Modify order ${id}`)}
      isModifyOpen={(isOpen) => setIsModifyOpen(isOpen)}
    />
  );
};

export const Default: Story = {
  render: Template,
  args: {
    activeFleet: "All Fleets",
    orders: sampleOrders,
  },
};

export const EmptyOrder: Story = {
  args: {
    activeFleet: "All Fleets",
    orders: [],
  },
};

export const WithSearch: Story = {
  render: Template,
  args: {
    activeFleet: "All Fleets",
    orders: sampleOrders,
  },
  play: async ({ canvasElement }) => {
    const searchInput = canvasElement.querySelector("input");
    if (searchInput) {
      searchInput.focus();
      searchInput.value = "hook";
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  },
};
