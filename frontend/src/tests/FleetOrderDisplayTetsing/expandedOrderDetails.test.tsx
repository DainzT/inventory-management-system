import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ExpandedOrderDetails } from "../../components/OrderFleetDisplay/ExpandedOrderDetails";
import { OrderItemProps } from "@/types/fleet-order";

describe("ExpandedOrderDetails", () => {
  const order: OrderItemProps = {
    id: 1,
    name: "Product A",
    note: "This is a note",
    quantity: 10,
    unitPrice: 1,
    total: 10,
    boat: { id: 8, fleet_id: 2, boat_name: "F/B Ruth Gaily" },
    outDate: "2025-03-25",
    fleet: { id: 2, name: "F/B Doña Librada" },
    selectUnit: "Unit A",
    archived: false,
    unitSize: 10,
  };

  it("renders the component with order details", () => {
    const { getByText, getByTestId } = render(
      <ExpandedOrderDetails order={order} />
    );

    expect(getByText("Total Price")).toBeInTheDocument();
    expect(getByTestId("total-price")).toHaveTextContent("₱10.00");
    expect(getByText("Fleet Assigned:")).toBeInTheDocument();
    expect(getByText("F/B Doña Librada")).toBeInTheDocument();
    expect(getByText("Selected Unit")).toBeInTheDocument();
    expect(getByText("Unit A")).toBeInTheDocument();
    expect(getByText("Unit Size")).toBeInTheDocument();
    expect(getByText("10")).toBeInTheDocument();
  });
});
