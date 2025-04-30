import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FleetCard } from "../../components/OrderFleetDisplay/FleetCards";

// Removed FleetList-related tests as it is not exported from FleetCards.tsx

describe("FleetCard Component", () => {
  const mockProps = {
    title: "Test Fleet",
    backgroundColor: "bg-blue-500",
    isActive: false,
    onClick: jest.fn(),
  };

  it("renders correctly with default props", () => {
    render(<FleetCard {...mockProps} />);

    const card = screen.getByRole("article");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("bg-blue-500");
    expect(card).toHaveClass("h-[150px]");
    expect(card).toHaveClass("w-[280px]");
    expect(screen.getByText("Test Fleet")).toBeInTheDocument();
  });

  it("renders with active state when isActive is true", () => {
    render(<FleetCard {...mockProps} isActive={true} />);

    const card = screen.getByRole("article");
    expect(card).toHaveClass("h-[170px]");
    expect(card).toHaveClass("w-[320px]");
    expect(card).toHaveClass("shadow-2xl");
  });

  it("calls onClick when clicked", () => {
    render(<FleetCard {...mockProps} />);

    const card = screen.getByRole("article");
    fireEvent.click(card);
    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("renders the SVG icons", () => {
    render(<FleetCard {...mockProps} />);

    expect(document.querySelectorAll("svg").length).toBeGreaterThan(0);
  });
});
