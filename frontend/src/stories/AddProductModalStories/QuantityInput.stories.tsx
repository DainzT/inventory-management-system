import { Meta, StoryObj } from "@storybook/react";
import { fn, expect, userEvent, within, waitFor } from "@storybook/test";
import { QuantityInput } from "@/components/AddProductModal/QuantityInput";
import { useState } from "react";

const meta: Meta<typeof QuantityInput> = {
    title: "Add Product Modal/QuantityInput",
    component: QuantityInput,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A flexible input component with validation and multiple input types',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'number',
            description: 'Current quantity value',
            table: {
                type: { summary: 'number | ""' },
                category: 'Value',
            }
        },
        onChange: {
            action: 'onChange',
            description: 'Callback when quantity changes',
            table: {
                type: { summary: '(value: number | "") => void' },
                category: 'Events',
            }
        },
        required: {
            control: 'boolean',
            description: 'Shows required indicator',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
                category: 'Validation',
            }
        },
        error: {
            control: 'text',
            description: 'Error message to display',
            table: {
                type: { summary: 'string' },
                category: 'Validation',
            }
        },
        disabled: {
            control: 'boolean',
            description: 'Disables all interactions',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
                category: 'State',
            }
        }
    },
    args: {
        value: "",
        onChange: fn(),
        required: false,
        error: undefined,
        disabled: false
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof QuantityInput>;


export default meta;
type Story = StoryObj<typeof QuantityInput>

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export const Default: Story = {
    render: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = useState<number | "">("");
        return <QuantityInput {...args} value={value} onChange={setValue} />;
    },
    parameters: {
        docs: {
            description: {
                story: 'Default empty state of the quantity input',
            },
        },
    },
};

export const WithValue: Story = {
    args: {
        value: 5.25,
    },
    parameters: {
        docs: {
            description: {
                story: 'Quantity input with pre-filled value',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.getByDisplayValue('5.25')).toBeInTheDocument();
    }
};


export const RequiredField: Story = {
    args: {
        required: true,
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

export const WithValidation: Story = {
    args: {
        required: true,
        error: "Invalid quantity",
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows error state with message and red border',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.getByText('Invalid quantity')).toBeInTheDocument();
        expect(canvas.getByPlaceholderText('0.00')).toHaveClass('border-red-500');
    }
};

export const DisabledState: Story = {
    args: {
        disabled: true,
        value: 3,
    },
    parameters: {
        docs: {
            description: {
                story: 'Disabled state prevents interaction and shows grayed-out controls',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByDisplayValue('3');
        const buttons = canvas.getAllByRole('button');

        expect(input).toBeDisabled();
        buttons.forEach(button => {
            expect(button).toBeDisabled();
        });
    }
};

export const InteractiveExample: Story = {
    render: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = useState<number | "">(0);
        return <QuantityInput {...args} value={value} onChange={setValue} />;
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive example demonstrating increment/decrement functionality',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByPlaceholderText('0.00');
        const [decrementBtn, incrementBtn] = canvas.getAllByRole('button');

        await waitFor(async () => {
            await userEvent.click(incrementBtn);
            await waitFor(() => {
                expect(input).toHaveValue(1);
            });
        })
        
        await delay(500)
        await userEvent.clear(input);
        await delay(500)

        await waitFor(async () => {
            await userEvent.type(input, '2.5');
            await waitFor(() => {
                expect(input).toHaveValue(2.5);
            });
        })

        await delay(500)

        await waitFor(async () => {
            await userEvent.click(decrementBtn);
            await waitFor(() => {
                expect(input).toHaveValue(1.5);
            });
        })

        await delay(500)

        await userEvent.clear(input);
        await userEvent.type(input, '0.5');
        expect(input).toHaveValue(0.5);
    }
};