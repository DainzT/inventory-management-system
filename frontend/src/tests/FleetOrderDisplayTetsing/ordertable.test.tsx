import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OrdersTable } from "../../components/OrderFleetDisplay/OrdersTable";
import { OrderItemProps } from "@/types/fleet-order";

const mockOrders: OrderItemProps[] = [
  {
    id: 3,
    name: "Hook",
    note: "small size",
    quantity: 10,
    unitPrice: 12.5,
    selectUnit: "pack",
    unitSize: 10,
    total: 125,
    fleet: { id: 2, name: "F/B Doña Librada" },
    boat: { id: 9, fleet_id: 2, boat_name: "F/V Vadeo Scout" },
    outDate: "Jan 30, 2024",
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
    fleet: { id: 2, name: "F/B Doña Librada" },
    boat: { id: 6, fleet_id: 2, boat_name: "F/B Adomar" },
    outDate: "Jan 20, 2024",
    archived: false,
  },
];

describe("OrdersTable", () => {
  it("renders OrdersTable component", () => {
    const { getByText } = render(
      <OrdersTable
        orders={mockOrders}
        activeFleet="All Fleets"
        isModifyOpen={() => {}}
      />
    );

    expect(getByText("Date Out")).toBeInTheDocument();
    expect(getByText("Product Name")).toBeInTheDocument();
    expect(getByText("Note")).toBeInTheDocument();
    expect(getByText("Quantity")).toBeInTheDocument();
    expect(getByText("Unit Price")).toBeInTheDocument();
    expect(getByText("Boat")).toBeInTheDocument();
    expect(getByText("Actions")).toBeInTheDocument();
  });

  it("renders order items", () => {
    const { getByText } = render(
      <OrdersTable
        orders={mockOrders}
        activeFleet="All Fleets"
        isModifyOpen={() => {}}
      />
    );

    expect(getByText("Nylon Fishing Line")).toBeInTheDocument();
    expect(getByText("Hook")).toBeInTheDocument();
  });

  it("calls onModify when Modify button is clicked", () => {
    const onModifyMock = jest.fn();
    const { getAllByText } = render(
      <OrdersTable
        orders={mockOrders}
        activeFleet="All Fleets"
        onModify={onModifyMock}
        isModifyOpen={() => {}}
      />
    );

    const modifyButtons = getAllByText("Modify");
    fireEvent.click(modifyButtons[0]);

    expect(onModifyMock).toHaveBeenCalledWith(2);
  });

  it("expands and collapses order details", () => {
    const { getByText, queryByText } = render(
      <OrdersTable
        orders={mockOrders}
        activeFleet="All Fleets"
        isModifyOpen={() => {}}
      />
    );

    const chevronIcon =
      getByText(
        "Nylon Fishing Line"
      ).parentElement?.nextElementSibling?.querySelector(".cursor-pointer");

    if (chevronIcon) {
      // Expand details
      fireEvent.click(chevronIcon);
      expect(getByText("500m, high-tensile strength")).toBeInTheDocument();

      // Collapse details
      fireEvent.click(chevronIcon);
      expect(
        queryByText("500m, high-tensile strength")
      ).not.toBeInTheDocument();
    }
  });

  it("renders search bar and filter dropdown", () => {
    const { getByPlaceholderText, getByText } = render(
      <OrdersTable
        orders={mockOrders}
        activeFleet="All Fleets"
        isModifyOpen={() => {}}
      />
    );

    expect(getByPlaceholderText("Search Items...")).toBeInTheDocument();
    expect(getByText("All Boats")).toBeInTheDocument();
  });
});
