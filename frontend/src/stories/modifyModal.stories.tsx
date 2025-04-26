import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, waitFor, expect, fn } from "@storybook/test";
import { OrderItemProps } from "@/types/fleet-order";
import ModifyModal from "@/components/ModifyModal/ModifyModal";

const meta: Meta<typeof ModifyModal> = {
  title: "Components/ModifyModal",
  component: ModifyModal,
  tags: ["autodocs"],
  args: {
    onClose: fn(),
    onConfirm: fn(),
    onRemove: fn(),
  },
  argTypes: {
    isOpen: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ModifyModal>;

const sampleFleet: Fleet = {
  id: 1,
  name: "F/B DONYA DONYA 2X"
};

const sampleBoat: Boat = {
  id: 1,
  boat_name: "F/B Lady Rachelle",
  fleet_id: 1
};

const sampleOrder: OrderItemProps = {
  id: 1,
  productName: "Marine Rope - 16mm",
  note: "High strength nylon rope",
  unitPrice: 125.75,
  quantity: 3,
  selectUnit: "meter",
  unitSize: "16mm",
  fleet: "F/B DONYA DONYA 2X",
  boat: "F/B Lady Rachelle",
  dateOut: "2023-05-15",
};

export const Default: Story = {
  args: {
    isOpen: true,
    order: sampleOrder,
    onClose: fn(),
    onConfirm: fn(),
    onRemove: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Modify Item")).toBeInTheDocument();
    await expect(canvas.getByText(sampleOrder.name)).toBeInTheDocument();
    await expect(canvas.getByText("Modify Item")).toBeInTheDocument();
    await expect(canvas.getByText(sampleOrder.productName)).toBeInTheDocument();
    await expect(
      canvas.getByText(`₱${sampleOrder.unitPrice.toFixed(2)}`)
    ).toBeInTheDocument();
  },
};

export const QuantityAdjustment: Story = {
  args: {
    isOpen: true,
    order: sampleOrder,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const quantityDisplay = canvas.getByTestId("quantity-display");
    const incrementButton = canvas.getByRole("button", { name: /increment quantity/i });
    const decrementButton = canvas.getByRole("button", { name: /decrement quantity/i });

    const buttons = canvas.getAllByRole("button");
    const decrementButton = buttons[1];
    const incrementButton = buttons[2];

    const quantityDisplay =
      canvas.getByTestId("quantity-display") ||
      canvas.getByText("3").closest('div[class*="bg-gray-100"]');

    if (!quantityDisplay) {
      throw new Error("Quantity display not found");
    }

    await userEvent.click(decrementButton);
    await waitFor(() => {
      expect(quantityDisplay).toHaveTextContent("2");
    });

    await userEvent.click(incrementButton);
    await userEvent.click(incrementButton);
    await waitFor(() => {
      expect(quantityDisplay).toHaveTextContent("4");
    });
  },
};

export const FleetAndBoatAssignment: Story = {
  args: {
    isOpen: true,
    order: sampleOrder,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fleetSelect = canvas.getByLabelText("Fleet Assignment");
    const boatSelect = canvas.getByLabelText("Boat Assignment");

    const quantityLabel = canvas.getByText("Quantity");
    const unitSelect = quantityLabel.parentElement?.querySelector("select");

    if (!unitSelect) {
      throw new Error("Unit select not found");
    }

    await userEvent.selectOptions(unitSelect, "kilogram");
    await expect(unitSelect).toHaveValue("kilogram");
  },
};


export const UnsavedChanges: Story = {
  args: {
    isOpen: true,
    order: sampleOrder,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const fleetLabel = canvas.getByText("Fleet Assignment");
    const fleetSelect = fleetLabel.nextElementSibling;

    if (!fleetSelect || !(fleetSelect instanceof HTMLSelectElement)) {
      throw new Error("Fleet select not found");
    }

    await userEvent.selectOptions(fleetSelect, "F/B Doña Librada");
    await expect(fleetSelect).toHaveValue("F/B Doña Librada");

    const boatLabel = canvas.getByText("Boat Assignment");
    const boatSelect = boatLabel.nextElementSibling;

    if (!boatSelect || !(boatSelect instanceof HTMLSelectElement)) {
      throw new Error("Boat select not found");
    }

    await expect(boatSelect.options[0]).toHaveValue("F/B Adomar");
  },
};

export const ConfirmationFlow: Story = {
  args: {
    isOpen: true,
    order: sampleOrder,
    onConfirm: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const confirmButton = canvas.getByRole("button", {
      name: /Confirm Changes/i,
    });

    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(args.onConfirm).toHaveBeenCalledWith(
        sampleOrder.quantity,
        sampleFleet.name,
        sampleBoat.boat_name
      );
    });
  },
};

