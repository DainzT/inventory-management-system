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
    fleet_name: "F/B DONYA DONYA 2X",
  },
  boat: {
    id: 1,
    boat_name: "F/B Lady Rachelle",
    fleet_id: 1,
  },
  archived: false,
  outDate: new Date("2023-01-01"),
  currentQuantity: 10,
};

const mockProps = {
  isOpen: true,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
  onRemove: jest.fn(),
  order: mockOrder,
};

describe("ModifyModal Component", () => {
  it("renders product information correctly", () => {
    render(<ModifyModal {...mockProps} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("₱10.99")).toBeInTheDocument();
  });

  it("allows changing quantity using increment and decrement", () => {
    render(<ModifyModal {...mockProps} />);
    const quantityDisplay = screen.getByTestId("quantity-display");

    const incrementButton = screen.getByLabelText("Increment quantity");
    const decrementButton = screen.getByLabelText("Decrement quantity");

    fireEvent.click(incrementButton);
    expect(quantityDisplay).toHaveTextContent("3");

    fireEvent.click(decrementButton);
    expect(quantityDisplay).toHaveTextContent("2");
  });

  it("displays and updates fleet and boat selections", () => {
    render(<ModifyModal {...mockProps} />);

    const fleetSelect = screen.getByLabelText("Fleet Assignment") as HTMLSelectElement;
    const boatSelect = screen.getByLabelText("Boat Assignment") as HTMLSelectElement;

    expect(fleetSelect.value).toBe("F/B DONYA DONYA 2X");
    expect(boatSelect.value).toBe("F/B Lady Rachelle");

    fireEvent.change(fleetSelect, { target: { value: "F/B Doña Librada" } });
    expect(fleetSelect.value).toBe("F/B Doña Librada");

    fireEvent.change(boatSelect, { target: { value: "F/B Adomar" } });
    expect(boatSelect.value).toBe("F/B Adomar");
  });

  it("calculates total price correctly after quantity change", () => {
    render(<ModifyModal {...mockProps} />);
    expect(screen.getByText("₱21.98")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Increment quantity"));
    expect(screen.getByText("₱32.97")).toBeInTheDocument();
  });

  it("displays updated remaining stock correctly", () => {
    render(<ModifyModal {...mockProps} />);
    const remaining = screen.getByTestId("remaining-stock");
    expect(remaining).toHaveTextContent("10");

    fireEvent.click(screen.getByLabelText("Increment quantity"));
    expect(remaining).toHaveTextContent("9");
  });

  it("calls onClose when Cancel is clicked", () => {
    render(<ModifyModal {...mockProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it("calls onConfirm when Confirm Changes is clicked", () => {
    render(<ModifyModal {...mockProps} />);
    fireEvent.click(screen.getByTestId("confirm-changes-button"));
    expect(mockProps.onConfirm).toHaveBeenCalled();
  });

  it("opens delete confirmation modal when Remove Item is clicked", () => {
    render(<ModifyModal {...mockProps} />);
    fireEvent.click(screen.getByTestId("remove-item-button"));
    expect(screen.getByText(/are you sure you want to remove/i)).toBeInTheDocument();
  });
});
