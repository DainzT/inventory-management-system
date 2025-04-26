import type { Meta, StoryObj } from "@storybook/react";
import { OrdersTable } from "../../components/OrderFleetDisplay/OrdersTable";
import { OrderItem } from "@/types/order-item";
import { useState } from "react";
import { waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const meta: Meta<typeof OrdersTable> = {
  title: " Order Components/OrdersTable",
  component: OrdersTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OrdersTable>;

// Sample data
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

// Template with state management
const Template: Story["render"] = (args) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("All Boats");

  const filteredOrders = sampleOrders.filter((order) => {
    const matchesSearch =
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.note.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterValue === "All Boats" || order.boat.boat_name === filterValue;
    return matchesSearch && matchesFilter;
  });

  return (
    <OrdersTable
      {...args}
      orders={filteredOrders}
      onSearch={(query) => setSearchQuery(query)}
      onFilter={(filter) => setFilterValue(filter)}
      onModify={(id) => console.log(`Modify order ${id}`)}
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
    const canvas = within(canvasElement);
    const searchInput = canvas.getByRole("textbox");
    console.log(searchInput);
    await userEvent.type(searchInput, "Fishing Reel");
    await waitFor(() => {
      expect(canvas.getByText("Fishing Reel")).toBeInTheDocument();
    });
  },
};
