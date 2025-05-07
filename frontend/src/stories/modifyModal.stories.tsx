import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, waitFor, expect, fn, screen } from "@storybook/test";
import type { ModifyOrderItem } from "@/types/modify-order-item";
import ModifyModal from "@/components/ModifyModal/ModifyModal";


const mockOrderItem: ModifyOrderItem = {
  id: 1,
  name: "Premium Fish Food",
  note: "wow naay nasunog wowowowow",
  quantity: 5,
  unitPrice: 120.50,
  unitSize: 1,
  total: 602.50,
  selectUnit: "kg",
  inventory: {
    id: 1,
    name: "Premium Fish Food",
    note: "wow naay nasunog wowowowow",
    unitPrice: 120.50,
    unitSize: 1,
    selectUnit: "kg",
    total: 120.50,
    dateCreated: new Date(),
    quantity: 10,
  },
  fleet: {
    id: 1,
    fleet_name: "F/B DONYA DONYA 2x",
  },
  boat: {
    fleet_id: 1,
    id: 1,
    boat_name: "F/B Lady Rachelle",
  },
};

const meta: Meta<typeof ModifyModal> = {
  title: "Components/ModifyModal",
  component: ModifyModal,
  tags: ["autodocs"],
  argTypes: {
    isOpen: { control: "boolean" },
    setIsOpen: { action: "setIsOpen" },
    onModify: { action: "onModify" },
    onRemove: { action: "onRemove" },
    isDeleting: { control: "boolean" },
    isModifying: { control: "boolean" },
  },
  args: {
    isOpen: true,
    setIsOpen: fn(),
    onModify: fn().mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }),
    onRemove: fn(),
    isDeleting: false,
    isModifying: false,
    selectedOrder: mockOrderItem,
  },
};

export default meta;
type Story = StoryObj<typeof ModifyModal>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const expectedPriceText = `₱${Number(mockOrderItem.unitPrice).toFixed(2)}`;
    const priceElement = canvas.getByTestId('price-display');

    await expect(canvas.getByText("Modify Product")).toBeInTheDocument();
    await expect(canvas.getByText(mockOrderItem.name)).toBeInTheDocument();
    await expect(priceElement).toHaveTextContent(expectedPriceText);
    await expect(canvas.getByText(mockOrderItem.note)).toBeInTheDocument();
  },
};

export const QuantityAdjustment: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const quantityInput = canvas.getByLabelText("Quantity");

    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "8");
    await expect(quantityInput).toHaveValue(8);

    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "20");
    await userEvent.click(canvas.getByText("Confirm Changes"));
    
    await waitFor(() => {
      expect(canvas.getByText(/Cannot exceed available stock/)).toBeInTheDocument();
    });
  },
};

export const FleetAndBoatSelection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const fleetSelect = await canvas.getByLabelText(/assign to fleet/i);
    await userEvent.selectOptions(fleetSelect, "F/B Doña Librada");
    await expect(fleetSelect).toHaveValue("F/B Doña Librada");

    const boatSelect = canvas.getByLabelText(/assign to boat/i);
    await waitFor(() => {
      expect(boatSelect).toHaveValue("F/B Adomar"); 
    });

    await userEvent.selectOptions(boatSelect, "F/B Mariene");
    await expect(boatSelect).toHaveValue("F/B Mariene");
  },
};

export const UnsavedChanges: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const quantityInput = canvas.getByLabelText("Quantity");
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "7");

    await userEvent.click(canvas.getByTestId("close-button"));

    await waitFor(async () => {
      expect(
        await screen.findByRole('heading', { name: /Unsaved Changes/i })
      ).toBeInTheDocument();

      expect(
        await screen.findByText(/You have unsaved changes/i)
      ).toBeInTheDocument();
    }, { timeout: 5000 });
  },
};

export const DeleteConfirmationModal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const deleteButton = await canvas.findByRole("button", { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();

    await userEvent.click(deleteButton);

    const confirmMessage = await canvas.findByText(
      /are you sure you want to remove this item from your order/i
    );
    expect(confirmMessage).toBeInTheDocument();

    const confirmButton = await canvas.findByRole("button", { name: /remove item/i });
    expect(confirmButton).toBeInTheDocument();
  },
};



export const ConfirmChanges: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    const quantityInput = canvas.getByLabelText("Quantity");
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "7");
    
    const fleetSelect = canvas.getByLabelText("Assign to Fleet");
    await userEvent.selectOptions(fleetSelect, "F/B Doña Librada");
    
    const boatSelect = canvas.getByLabelText("Assign to Boat");
    await userEvent.selectOptions(boatSelect, "F/B Adomar");
    
    await userEvent.click(canvas.getByText("Confirm Changes"));
    
    await waitFor(() => {
      expect(args.onModify).toHaveBeenCalledWith(
        7,
        "F/B Doña Librada",
        "F/B Adomar"
      );
    });
  },
};

export const NoInventory: Story = {
  args: {
    selectedOrder: {
      ...mockOrderItem,
      inventory: {
        id:0,
        name: "wala sa inventory",
        note: "no more cannot be found",
        unitPrice: 0,
        unitSize: 0,
        selectUnit: "Piece",
        total: 0,
        dateCreated: new Date(),
        quantity: 0,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("This item no longer exists in inventory")).toBeInTheDocument();
  },
};