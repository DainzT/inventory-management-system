import UnsavedChangesModal from "@/components/DiscardChangesModal";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, waitFor, expect, fn } from "@storybook/test";


const meta: Meta<typeof UnsavedChangesModal> = {
  title: "Components/UnsavedChangesModal",
  component: UnsavedChangesModal,
  tags: ["autodocs"],
  args: {
    onCancel: fn(),
    onDiscard: fn(),
  },
  argTypes: {
    isOpen: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof UnsavedChangesModal>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Discard changes"))
      .toBeInTheDocument();
  },
};

export const ConfirmationFlow: Story = {
  args: {
    isOpen: true,
    onDiscard: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const discardButton = canvas.getByTestId("discard-changes-button");
    await userEvent.click(discardButton);
    await waitFor(() => {
      expect(args.onDiscard).toHaveBeenCalled();
    });
  },
};

export const CancellationFlow: Story = {
  args: {
    isOpen: true,
    onCancel: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cancelButton = canvas.getByRole("button", { name: /Cancel/i });
    await userEvent.click(cancelButton);
    await waitFor(() => {
      expect(args.onCancel).toHaveBeenCalled();
    });
  },
};
