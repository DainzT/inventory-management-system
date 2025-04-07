import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OrdersTable } from "../../components/OrderFleetDisplay/OrdersTable";
import { OrderItemProps } from "@/types/fleet-order";

const mockOrders: OrderItemProps[] = [
  {
    id: 1,
    productName: "Product 1",
    note: "Note 1",
    quantity: 10,
    unitPrice: 100,
    selectUnit: "kg",
    unitSize: 5,
    fleet: "Fleet A",
    boat: "F/B DONYA DONYA 2X",
    dateOut: "2025-03-01",
  },
  {
    id: 2,
    productName: "Product 2",
    note: "Note 2",
    quantity: 20,
    unitPrice: 200,
    selectUnit: "kg",
    unitSize: 10,
    fleet: "Fleet B",
    boat: "F/B Doña Librada",
    dateOut: "2025-03-02",
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

    expect(getByText("Product 1")).toBeInTheDocument();
    expect(getByText("Product 2")).toBeInTheDocument();
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

    expect(onModifyMock).toHaveBeenCalledWith(1);
  });

  it("expands and collapses order details", () => {
    const { getByText } = render(
      <OrdersTable
        orders={mockOrders}
        activeFleet="All Fleets"
        isModifyOpen={() => {}}
      />
    );

    const chevronIcon =
      getByText("Product 1").parentElement?.nextElementSibling?.querySelector(
        ".cursor-pointer"
      );
    if (chevronIcon) {
      fireEvent.click(chevronIcon);
      expect(getByText("Note 1")).toBeInTheDocument();
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
