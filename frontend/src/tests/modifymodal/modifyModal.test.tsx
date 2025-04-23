import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModifyModal from "@/components/ModifyModal/ModifyModal";

const mockOrder = {
  id: 123,
  name: "Test Product",
  note: "Test Note",
  quantity: 2,
  unitPrice: 10.99,
  selectUnit: "piece",
  unitSize: 1, 
  total: 21.98,
  fleet: {
    id: 1, 
    name: "F/B DONYA DONYA 2X",
  },
  boat: {
    id: 1, 
    boat_name: "F/B Lady Rachelle",
    fleet_id: 1, 
  },
  archived: false,
  outDate: "2023-01-01",
};

const mockProps = {
  isOpen: true,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
  onRemove: jest.fn(),
  order: mockOrder,
};

describe("ModifyModal Frontend Interactions", () => {
  it("renders product information correctly", () => {
    render(<ModifyModal {...mockProps} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("₱10.99")).toBeInTheDocument();
  });

  it("allows changing quantity", () => {
    render(<ModifyModal {...mockProps} />);

    const quantityDisplay = screen.getByText("2").parentElement;
    const buttons = screen.getAllByRole("button");

    const decrementButton = buttons[1];
    const incrementButton = buttons[2];

    fireEvent.click(incrementButton);
    expect(quantityDisplay).toHaveTextContent("3");

    fireEvent.click(decrementButton);
    expect(quantityDisplay).toHaveTextContent("2");
  });

  it("changes fleet and boat assignments", () => {
    render(<ModifyModal {...mockProps} />);

    const initialFleetSelect = screen.getByDisplayValue("F/B DONYA DONYA 2X");
    const initialBoatSelect = screen.getByDisplayValue("F/B Lady Rachelle");

    expect(initialFleetSelect).toBeInTheDocument();
    expect(initialBoatSelect).toBeInTheDocument();

    fireEvent.change(initialFleetSelect, {
      target: { value: "F/B Doña Librada" },
    });

    expect(screen.getByDisplayValue("F/B Doña Librada")).toBeInTheDocument();

    const updatedBoatSelect = screen.getByDisplayValue("F/B Adomar");
    expect(updatedBoatSelect).toBeInTheDocument();

    fireEvent.change(updatedBoatSelect, {
      target: { value: "F/B Prince of Peace" },
    });

    expect(screen.getByDisplayValue("F/B Prince of Peace")).toBeInTheDocument();
  });

  it("calculates total price correctly", () => {
    render(<ModifyModal {...mockProps} />);

    expect(screen.getByText("₱21.98")).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    const incrementButton = buttons[2];

    fireEvent.click(incrementButton);
    expect(screen.getByText("₱32.97")).toBeInTheDocument();
  });

  it("closes when cancel button is clicked", () => {
    render(<ModifyModal {...mockProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it("saves changes when confirm button is clicked", () => {
    render(<ModifyModal {...mockProps} />);
    fireEvent.click(screen.getByText("Confirm Changes"));
    expect(mockProps.onConfirm).toHaveBeenCalled();
  });
});
