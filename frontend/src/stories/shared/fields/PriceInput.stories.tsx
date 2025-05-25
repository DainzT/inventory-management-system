import { Meta, StoryObj } from "@storybook/react";
import { fn, expect, userEvent, within, waitFor } from "@storybook/test";
import { PriceInput } from "@/components/shared/fields/PriceInput";
import { useState } from "react";

const meta: Meta<typeof PriceInput> = {
    title: "shared/fields/PriceInput",
    component: PriceInput,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A specialized input component for handling monetary values with unit pricing',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        label: {
            control: 'text',
            description: 'Label for the input field',
            table: {
                type: { summary: 'string' },
                category: 'Content',
            }
        },
        value: {
            control: 'number',
            description: 'Current price value',
            table: {
                type: { summary: 'number | ""' },
                category: 'Value',
            }
        },
        unitSize: {
            control: 'number',
            description: 'Current unit size value',
            table: {
                type: { summary: 'number | ""' },
                category: 'Value',
            }
        },
        onChange: {
            action: 'onChange',
            description: 'Callback when price value changes',
            table: {
                type: { summary: '(value: number | "") => void' },
                category: 'Events',
            }
        },
        unitChange: {
            action: 'unitChange',
            description: 'Callback when unit size changes',
            table: {
                type: { summary: '(value: number | "") => void' },
                category: 'Events',
            }
        },
        readonly: {
            control: 'boolean',
            description: 'Makes the input read-only',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
                category: 'State',
            }
        },
        required: {
            control: 'boolean',
            description: 'Marks the input as required',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
                category: 'Validation',
            }
        },
        unit: {
            control: 'text',
            description: 'Unit label (e.g., kg, g, L)',
            table: {
                type: { summary: 'string' },
                category: 'Content',
            }
        },
        quantity: {
            control: 'number',
            description: 'Maximum allowed unit size',
            table: {
                type: { summary: 'number | ""' },
                category: 'Validation',
            }
        },
        error: {
            control: 'object',
            description: 'Error messages for price and unit size',
            table: {
                type: { summary: '{ unitPrice?: string; unitSize?: string }' },
                category: 'Validation',
            }
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the input field',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
                category: 'State',
            }
        }
    },
    args: {
        label: 'Unit Price',
        value: "",
        unitSize: "",
        onChange: fn(),
        unitChange: fn(),
        readonly: false,
        required: false,
        unit: 'unit',
        quantity: "",
        error: undefined,
        disabled: false
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof PriceInput>;


export default meta;
type Story = StoryObj<typeof PriceInput>

export const Default: Story = {
    args : {
        value: ""
    }
};

export const WithValue: Story = {
    args: {
        value: 12.99,
    },
    parameters: {
        docs: {
            description: {
                story: 'Price input with pre-filled values'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const priceInput = canvas.getByDisplayValue('12.99');
        expect(priceInput).toBeInTheDocument();
    }
};

export const RequiredField: Story = {
    args: {
        value: 12.99,
        required: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Price input with pre-filled values and custom unit',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const priceInput = canvas.getByDisplayValue('12.99');
        expect(priceInput).toBeInTheDocument();
    }
};


export const WithValidation: Story = {
    args: {
        required: true,
        quantity: 10,
        unitSize: 15,
        error: {
            unitSize: 'Unit size cannot exceed quantity',
            unitPrice: 'Unit Price Cannot be 0'
        }
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the required indicator (*) and enables validation',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const required = canvas.getByText("*")
        expect(required).toBeInTheDocument();
        expect(required).toHaveClass("text-[#FF5757]")
    }
};

export const ReadOnly: Story = {
    args: {
        value: 9.99,
        unitSize: 1,
        readonly: true
    },
    parameters: {
        docs: {
            description: {
                story: 'Read-only state shows values but prevents editing',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const priceInput = canvas.getByDisplayValue('9.99');
        expect(priceInput).toHaveAttribute('readonly');
        expect(priceInput).toHaveClass('cursor-default');
    }
};

export const DisabledState: Story = {
    args: {
        disabled: true,
        value: 5.5,
    },
    parameters: {
        docs: {
            description: {
                story: 'Disabled state prevents interaction and shows grayed-out values',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const priceInput = canvas.getByDisplayValue('5.5');
        expect(priceInput).toBeDisabled();
    }
};

export const InteractiveExample: Story = {
    render: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [price, setPrice] = useState<number | "">("");
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [unitSize, setUnitSize] = useState<number | "">("");
        return (
            <PriceInput
                {...args}
                value={price}
                onChange={setPrice}
                unitSize={unitSize}
                unitChange={setUnitSize}
            />
        );
    },
    args: {
        required: true,
        unit: 'piece'
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive example demonstrating live value changes',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const priceInputs = canvas.getAllByPlaceholderText('0.00');
        await userEvent.type(priceInputs[0], '24.99');
        await userEvent.type(priceInputs[1], '5');

        await waitFor(() => {
            expect(priceInputs[0]).toHaveValue(24.99);
            expect(priceInputs[1]).toHaveValue(5);
        });
    }
};