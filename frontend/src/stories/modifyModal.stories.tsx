import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, waitFor, expect, fn } from "@storybook/test";
import ModifyModal from "@/components/ModifyModal/ModifyModal";
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
  inventory: null,
  selectUnit: "",
  unitSize: 0,
  total: 0
};

const meta: Meta<typeof ModifyModal> = {
  title: "Components/ModifyModal",
  component: ModifyModal,
  tags: ["autodocs"],
  args: {
    isOpen: true,
    onRemove: fn(),
  },
  argTypes: {
    isOpen: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ModifyModal>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Modify Item")).toBeInTheDocument();
    await expect(canvas.getByText(sampleOrder.name)).toBeInTheDocument();
    await expect(canvas.getByText(`₱${Number(sampleOrder.unitPrice).toFixed(2)}`)).toBeInTheDocument();
  },
};

export const QuantityAdjustment: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const quantityDisplay = canvas.getByTestId("quantity-display");
    const incrementButton = canvas.getByRole("button", { name: /increment quantity/i });
    const decrementButton = canvas.getByRole("button", { name: /decrement quantity/i });

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const fleetSelect = canvas.getByLabelText("Fleet Assignment") as HTMLSelectElement;
    const boatSelect = canvas.getByLabelText("Boat Assignment") as HTMLSelectElement;

    await userEvent.selectOptions(fleetSelect, "F/B Doña Librada");
    await expect(fleetSelect).toHaveValue("F/B Doña Librada");

    await waitFor(() => {
      expect(boatSelect.options.length).toBeGreaterThan(0);
    });
  },
};

export const UnsavedChanges: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const fleetSelect = canvas.getByLabelText("Fleet Assignment") as HTMLSelectElement;
    await userEvent.selectOptions(fleetSelect, "F/B Doña Librada");
    await expect(fleetSelect).toHaveValue("F/B Doña Librada");

    const boatSelect = canvas.getByLabelText("Boat Assignment") as HTMLSelectElement;

    await waitFor(() => {
      expect(boatSelect.options[0].value).toBe("F/B Adomar");
    });
  },
};


export const ConfirmationFlow: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const confirmButton = canvas.getByRole("button", {
      name: /Confirm Changes/i,
    });

    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(args).toHaveBeenCalledWith(
        sampleOrder.quantity,
        sampleFleet.fleet_name,
        sampleBoat.boat_name
      );
    });
  },
};
