import type { Meta, StoryObj } from "@storybook/react";
import QuantitySelector from "@/components/shared/fields/QuantitySelector";
import { fn } from "@storybook/test";

const meta: Meta<typeof QuantitySelector> = {
  title: "Out Product Modal/QuantitySelector",
  component: QuantitySelector,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A quantity selector with increment/decrement and validation.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "number",
      description: "Current quantity",
      table: { category: "Value" },
    },
    onChange: {
      action: "onChange",
      description: "Callback when quantity changes",
      table: { category: "Events" },
    },
    maxQuantity: {
      control: "number",
      description: "Maximum allowed quantity",
      table: { category: "Validation" },
    },
    unitSize: {
      control: "number",
      description: "Unit size for increment/decrement",
      table: { category: "Content" },
    },
    error: {
      control: "text",
      description: "Error message",
      table: { category: "Validation" },
    },
    disabled: {
      control: "boolean",
      description: "Disables the selector",
      table: { category: "State" },
    },
    required: {
      control: "boolean",
      description: "Required field",
      table: { category: "Validation" },
    },
  },
  args: {
    value: 0,
    onChange: fn(),
    maxQuantity: 50,
    unitSize: 1,
    error: undefined,
    disabled: false,
    required: false,
  },
  decorators: [(Story) => <Story />],
};

export default meta;
type Story = StoryObj<typeof QuantitySelector>;

export const Default: Story = {
  args: {
    value: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "Default state of the quantity selector.",
      },
    },
  },
};

export const WithValue: Story = {
  args: {
    value: 10,
  },
  parameters: {
    docs: {
      description: {
        story: "Quantity selector with a pre-filled value.",
      },
    },
  },
};

export const WithError: Story = {
  args: {
    value: 0,
    error: "Invalid quantity",
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Quantity selector showing an error state.",
      },
    },
  },
};
