import type { Meta, StoryObj } from "@storybook/react";
import SummarySection from "@/components/shared/contents/SummarySection";

const meta: Meta<typeof SummarySection> = {
  title: "Out Product Modal/SummarySection",
  component: SummarySection,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Displays total price and remaining stock summary.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    totalPrice: {
      control: "number",
      description: "Total price",
      table: { category: "Value" },
    },
    remainingStock: {
      control: "number",
      description: "Remaining stock",
      table: { category: "Value" },
    },
    unit: {
      control: "text",
      description: "Unit of measurement",
      table: { category: "Content" },
    },
  },
  args: {
    totalPrice: 150.5,
    remainingStock: 25,
    unit: "Piece",
  },
  decorators: [(Story) => <Story />],
};

export default meta;
type Story = StoryObj<typeof SummarySection>;

export const Default: Story = {
  args: {
    totalPrice: 150.5,
    remainingStock: 25,
    unit: "Piece",
  },
  parameters: {
    docs: {
      description: {
        story: "Default summary section with sample values.",
      },
    },
  },
};

export const ZeroStock: Story = {
  args: {
    totalPrice: 0,
    remainingStock: 0,
    unit: "Piece",
  },
  parameters: {
    docs: {
      description: {
        story: "Summary section with zero stock and price.",
      },
    },
  },
};
