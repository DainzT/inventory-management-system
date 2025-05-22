import type { Meta, StoryObj } from "@storybook/react";
import OutItemModal from "@/components/OutItemModal/OutItemModal";
import { fn, within, userEvent, waitFor } from "@storybook/test";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof OutItemModal> = {
  title: "Out Product Modal/OutItemModal",
  component: OutItemModal,
  parameters: {
    layout: "centered",
    description: {
      component:
        "The Out Product Modal Component allows assigning inventory items to boats/fleets.",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      defaultValue: true,
      description: "Modal open state",
      table: { category: "Visibility" },
    },
    setIsOpen: { action: "setIsOpen" },
    selectedItem: { control: "object", description: "Selected inventory item" },
    onOutItem: {
      action: "onOutItem",
      description: "Triggered when item is assigned",
      table: { category: "Data" },
    },
    isAssigning: {
      control: "boolean",
      defaultValue: false,
      description: "Toggles loading indicator during assignment",
      table: { category: "State" },
    },
  },
  args: {
    isOpen: false,
    setIsOpen: fn(),
    selectedItem: {
      id: 1,
      name: "Sample Product",
      note: "This is a sample note for the product.",
      unitPrice: 100,
      unitSize: 1,
      selectUnit: "Piece",
      quantity: 50,
      total: 5000,
      dateCreated: new Date(),
    },
    onOutItem: fn(),
    isAssigning: false,
  },
  decorators: [(Story) => <Story />],
};

export default meta;
type Story = StoryObj<typeof OutItemModal>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Default open state of the Out Product Modal.",
      },
    },
  },
};
