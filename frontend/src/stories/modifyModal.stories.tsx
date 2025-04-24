import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, waitFor, expect, fn } from "@storybook/test";
import ModifyModal from "@/components/ModifyModal/ModifyModal";
import { OrderItemProps } from "@/types/fleet-order";
import { Fleet, Boat } from "@/types/summary-item";

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
  name: "Marine Rope - 16mm",
  note: "High strength nylon rope",
  unitPrice: 125.75,
  quantity: 3,
  selectUnit: "meter",
  unitSize: 16,
  total: 377.25,
  fleet: sampleFleet,
  boat: sampleBoat,
  archived: false,
  outDate: "2023-05-15"
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

    if (typeof sampleOrder.unitPrice === "number") {
      await expect(
        canvas.getByText(`₱${sampleOrder.unitPrice.toFixed(2)}`)
      ).toBeInTheDocument();
    }
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

    await userEvent.click(incrementButton);
    await waitFor(() => expect(quantityDisplay).toHaveTextContent("4"));
    
    await userEvent.click(decrementButton);
    await waitFor(() => expect(quantityDisplay).toHaveTextContent("3"));
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

    await userEvent.click(fleetSelect);
    await userEvent.selectOptions(fleetSelect, "F/B Doña Librada");
    await expect(fleetSelect).toHaveValue("F/B Doña Librada");

    await userEvent.click(boatSelect);
    await userEvent.selectOptions(boatSelect, "F/B Adomar");
    await expect(boatSelect).toHaveValue("F/B Adomar");
  },
};


export const UnsavedChanges: Story = {
  args: {
    isOpen: true,
    order: sampleOrder,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const incrementButton = canvas.getByRole("button", { name: /increment quantity/i });
    await userEvent.click(incrementButton);

    const cancelButton = canvas.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    const unsavedChangesModal = within(canvasElement).getByText("Unsaved Changes");
    await expect(unsavedChangesModal).toBeInTheDocument();

    const unsavedText = within(canvasElement).getByText(
      "You have unsaved changes. Are you sure you want to leave without saving?"
    );
    await expect(unsavedText).toBeInTheDocument();

    const discardButton = within(canvasElement).getByRole("button", { name: /discard changes/i });
    await userEvent.click(discardButton);

    await waitFor(() => expect(canvas.queryByText("Unsaved Changes")).not.toBeInTheDocument());
  },
};

export const ConfirmationFlow: Story = {
  args: {
    isOpen: true,
    order: sampleOrder,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const confirmButton = canvas.getByRole("button", { name: /Confirm Changes/i });
    
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