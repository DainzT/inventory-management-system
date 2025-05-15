import DeleteConfirmationModal from "@/components/ModifyModal/DeleteConfirmationModal";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, waitFor, expect, fn } from "@storybook/test";


const meta: Meta<typeof DeleteConfirmationModal> = {
  title: "Components/DeleteConfirmationModal",
  component: DeleteConfirmationModal,
  tags: ["autodocs"],
  args: {
    onClose: fn(),
    onConfirm: fn(),
  },
  argTypes: {
    isOpen: { control: "boolean" },
    title: { control: "text" },
    message: { control: "text" },
    confirmButtonText: { control: "text" },
    cancelButtonText: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DeleteConfirmationModal>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Are you sure?"))
      .toBeInTheDocument();
  },
};

export const WithCustomText: Story = {
  args: {
    isOpen: true,
    title: "Delete Item?",
    message: "This will permanently delete the item. Are you sure?",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "No, Cancel",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Delete Item?"))
      .toBeInTheDocument();
  },
};

export const ConfirmationFlow: Story = {
  args: {
    isOpen: true,
    onConfirm: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const confirmButton = canvas.getByRole("button", { name: /Delete field/i });
    await userEvent.click(confirmButton);
    await waitFor(() => {
      expect(args.onConfirm).toHaveBeenCalled();
    });
  },
};

export const CancellationFlow: Story = {
  args: {
    isOpen: true,
    onClose: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cancelButton = canvas.getByRole("button", { name: /Cancel/i });
    await userEvent.click(cancelButton);
    await waitFor(() => {
      expect(args.onClose).toHaveBeenCalled();
    });
  },
};
