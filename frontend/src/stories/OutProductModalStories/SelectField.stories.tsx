import type { Meta, StoryObj } from "@storybook/react";
import SelectField from "@/components/OutItemModal/SelectField";
import { fn, within, userEvent, waitFor } from "@storybook/test";

const meta: Meta<typeof SelectField> = {
  title: "Out Product Modal/SelectField",
  component: SelectField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A dropdown select field for Out Product Modal forms.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label for the select field",
      table: { category: "Content" },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
      table: { category: "Content" },
    },
    value: {
      control: "text",
      description: "Selected value",
      table: { category: "Value" },
    },
    onChange: {
      action: "changed",
      description: "Callback when value changes",
      table: { category: "Events" },
    },
    options: {
      control: { type: "select" },
      description: "Options for the select",
      table: { category: "Content" },
    },
    required: {
      control: "boolean",
      description: "Required field",
      table: { category: "Validation" },
    },
    disabled: {
      control: "boolean",
      description: "Disables the select",
      table: { category: "State" },
    },
    error: {
      control: "text",
      description: "Error message",
      table: { category: "Validation" },
    },
  },
  args: {
    label: "Fleet",
    placeholder: "Select fleet...",
    value: "",
    onChange: fn(),
    options: ["F/B DONYA DONYA 2x", "F/B Doña Librada"],
    required: false,
    disabled: false,
    error: undefined,
  },
  decorators: [(Story) => <Story />],
};

export default meta;
type Story = StoryObj<typeof SelectField>;

export const Default: Story = {
  args: {
    value: "",
  },
  parameters: {
    docs: {
      description: {
        story: "Default state of the select field.",
      },
    },
  },
};

export const WithValue: Story = {
  args: {
    value: "F/B DONYA DONYA 2x",
  },
  parameters: {
    docs: {
      description: {
        story: "Select field with a value selected.",
      },
    },
  },
};

export const WithError: Story = {
  args: {
    error: "Please select a fleet",
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Select field showing an error state.",
      },
    },
  },
};
