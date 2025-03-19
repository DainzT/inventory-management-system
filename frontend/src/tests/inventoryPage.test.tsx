import { render, screen } from "@testing-library/react";
import Inventory from "../pages/InventoryPage";

describe("Inventory Component", () => {
  it("renders the inventory title", () => {
    render(<Inventory />);
    const titleElement = screen.getByText(/Main Inventory/i);
    expect(titleElement).toBeInTheDocument();
  });
});
