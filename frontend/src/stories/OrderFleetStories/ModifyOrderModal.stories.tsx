import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, waitFor, expect, fn } from "@storybook/test";
import ModifyModal from "@/components/orders/modals/ModifyOrderModal";
import type { ModifyOrderItem } from "@/types/modify-order-item";
import { Fleet, Boat } from "@/types";

const sampleFleet: Fleet = {
  id: 1,
  fleet_name: "F/B DONYA DONYA 2X",
};

const sampleBoat: Boat = {
  id: 1,
  boat_name: "F/B Lady Rachelle",
  fleet_id: 1,
};

const sampleOrder: ModifyOrderItem = {
  id: 1,
  name: "Marine Rope - 16mm",
  note: "High strength nylon rope",
  unitPrice: 125.75,
  quantity: 3,
  fleet: sampleFleet,
  boat: sampleBoat,
  inventory: {
    id: 1,
    name: "Marine Rope - 16mm",
    note: "High strength nylon rope",
    unitPrice: 125.75,
    selectUnit: "meter",
    unitSize: 1,
    quantity: 100,
    total: 12575,
    dateCreated: new Date(),
  },
  selectUnit: "meter",
  unitSize: 1,
  total: 377.25
};

const meta: Meta<typeof ModifyModal> = {
  title: "Order Components/ModifyOrderModal",
  component: ModifyModal,
  tags: ["autodocs"],
  args: {
    isOpen: true,
    setIsOpen: fn(),
    selectedOrder: sampleOrder,
    onModify: fn(),
    onRemove: fn(),
    isDeleting: false,
    isModifying: false,
  },
  argTypes: {
    isOpen: { control: "boolean" },
    isDeleting: { control: "boolean" },
    isModifying: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ModifyModal>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Edit Order")).toBeInTheDocument();
    await expect(canvas.getByText(sampleOrder.name)).toBeInTheDocument();
    await expect(
      canvas.getByText(`₱${Number(sampleOrder.unitPrice).toFixed(2)} / ${sampleOrder.unitSize} ${sampleOrder.selectUnit}`)
    ).toBeInTheDocument();
  },
};

export const QuantityAdjustment: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const quantityInput = canvas.getByRole("spinbutton");
    
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "5");
    
    await waitFor(() => {
      expect(quantityInput).toHaveValue(5);
    });
  },
};

export const FleetAndBoatAssignment: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const fleetSelector = canvas.getByTestId("fleet-selector");
    await userEvent.click(fleetSelector);

    const fleetOption = canvas.getByTestId("fleet-option-F/B Doña Librada");
    await userEvent.click(fleetOption);

    const boatSelector = canvas.getByTestId("boat-selector");
    await userEvent.click(boatSelector);

    await waitFor(() => {
      expect(canvas.getByText("F/B Adomar")).toBeInTheDocument();
    });
  },
};

export const UnsavedChangesWarning: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const quantityInput = canvas.getByRole("spinbutton");
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "5");

    const closeButton = canvas.getByTestId("close-button");
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(canvas.getByRole("heading", { name: "Unsaved Changes" })).toBeInTheDocument();
      expect(
        canvas.getByText("You have unsaved changes. Are you sure you want to leave without saving?")
      ).toBeInTheDocument();

      const cancelButton = canvas.getByTestId("cancel-button");
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton).toHaveTextContent("Cancel");
      
      const discardButton = canvas.getByRole("button", { name: "Discard Changes" });
      expect(discardButton).toBeInTheDocument();
    });

    const cancelButton = canvas.getByTestId("cancel-button");
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(quantityInput).toHaveValue(5);
      expect(canvas.getByText("Edit Order")).toBeInTheDocument();
    });
  }
};

export const ValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const quantityInput = canvas.getByRole("spinbutton");
    
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "999");
    
    const confirmButton = canvas.getByRole("button", { name: /Confirm Changes/i });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(canvas.getByText(/Cannot exceed available stock/i)).toBeInTheDocument();
    });
  },
};

export const LoadingStates: Story = {
  args: {
    isModifying: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Updating...")).toBeInTheDocument();
  },
};

export const DeletingState: Story = {
  args: {
    isDeleting: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const deleteButton = canvas.getByRole("button", { name: /Delete/i });
    await expect(deleteButton).toBeDisabled();
  },
};
