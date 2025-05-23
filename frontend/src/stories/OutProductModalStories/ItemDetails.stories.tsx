import type { Meta, StoryObj } from "@storybook/react";
import ItemDetails from "@/components/OutItemModal/ItemDetails";

const meta: Meta<typeof ItemDetails> = {
  title: "Out Product Modal/ItemDetails",
  component: ItemDetails,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays details of an inventory item, including name, price, note, and stock.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    item: {
      control: "object",
      description: "Inventory item object",
      table: { category: "Value" },
    },
    maxNoteLength: {
      control: "number",
      description: "Maximum note length before truncation",
      table: { category: "Content" },
    },
  },
  args: {
    item: {
      id: 1,
      name: "Sample Product",
      note: "This is a sample note for the product. It is long enough to be truncated for demonstration.",
      unitPrice: 100,
      unitSize: 1,
      selectUnit: "Piece",
      quantity: 50,
      total: 5000,
      dateCreated: new Date(),
    },
    maxNoteLength: 35,
  },
  decorators: [(Story) => <Story />],
};

export default meta;
type Story = StoryObj<typeof ItemDetails>;

export const Default: Story = {
  args: {
    item: {
      id: 1,
      name: "Sample Product",
      note: "This is a sample note for the product. It is long enough to be truncated for demonstration.",
      unitPrice: 100,
      unitSize: 1,
      selectUnit: "Piece",
      quantity: 50,
      total: 5000,
      dateCreated: new Date(),
    },
    maxNoteLength: 35,
  },
  parameters: {
    docs: {
      description: {
        story: "Default item details with a long note.",
      },
    },
  },
};

export const ShortNote: Story = {
  args: {
    item: {
      id: 2,
      name: "Short Note Product",
      note: "Short note.",
      unitPrice: 50,
      unitSize: 2,
      selectUnit: "Box",
      quantity: 10,
      total: 500,
      dateCreated: new Date(),
    },
    maxNoteLength: 35,
  },
  parameters: {
    docs: {
      description: {
        story: "Item details with a short note that does not get truncated.",
      },
    },
  },
};
