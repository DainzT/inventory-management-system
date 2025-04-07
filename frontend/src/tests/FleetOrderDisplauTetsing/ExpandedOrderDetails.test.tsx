import React from "react";
import { getByTestId, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ExpandedOrderDetails } from "../../components/OrderFleetDisplay/ExpandedOrderDetails";
import { OrderItemProps } from "@/types/fleet-order";

describe("ExpandedOrderDetails", () => {
  const order: OrderItemProps = {
    id: 1,
    productName: "Product A",
    note: "This is a note",
    quantity: 10,
    unitPrice: 1,
    total: 10,
    boat: "Boat 1",
    dateOut: "2025-03-25",
    fleet: "Fleet A",
    selectUnit: "Unit A",
    unitSize: "Size A",
  };

  it("renders the component with order details", () => {
    const { getByText, getByTestId } = render(
      <ExpandedOrderDetails order={order} />
    );

    expect(getByText("Total Price")).toBeInTheDocument();
    expect(getByTestId("total-price")).toHaveTextContent("10");
    expect(getByText("Fleet Assigned:")).toBeInTheDocument();
    expect(getByText("Fleet A")).toBeInTheDocument();
    expect(getByText("Selected Unit")).toBeInTheDocument();
    expect(getByText("Unit A")).toBeInTheDocument();
    expect(getByText("Unit Size")).toBeInTheDocument();
    expect(getByText("Size A")).toBeInTheDocument();
  });
});
