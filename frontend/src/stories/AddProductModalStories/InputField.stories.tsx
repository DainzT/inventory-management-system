import { Meta, StoryObj } from "@storybook/react";
import { fn, expect, userEvent, within, waitFor } from "@storybook/test";
import { InputField } from "@/components/AddProductModal/InputField";
import { useState } from "react";

const meta: Meta<typeof InputField> = {
    title: "Add Product Modal/InputField",
    component: InputField,
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
        label: {
            control: 'text',
            description: 'Label text for the input field',
            table: {
                type: { summary: 'string' },
                category: 'Content',
            }
        },
        required: {
            control: 'boolean',
            description: 'Shows required indicator and enables validation',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
                category: 'Validation',
            }
        },
        type: {
            control: 'select',
            options: ['text', 'textarea'],
            description: 'Input type - regular text or textarea',
            table: {
                type: { summary: 'text | textarea' },
                defaultValue: { summary: 'text' },
                category: 'Type',
            }
        },
        value: {
            control: 'text',
            description: 'Controlled input value',
            table: {
                type: { summary: 'string' },
                category: 'Value',
            }
        },
        onChange: {
            action: 'changed',
            description: 'Callback when input value changes',
            table: {
                type: { summary: '(value: string) => void' },
                category: 'Events',
            }
        },
        placeholder: {
            control: 'text',
            description: 'Input placeholder text',
            table: {
                type: { summary: 'string' },
                category: 'Content',
            }
        },
        error: {
            control: 'text',
            description: 'Error message to display below input',
            table: {
                type: { summary: 'string' },
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
        label: 'Input Label',
        required: false,
        type: 'text',
        value: '',
        onChange: fn(),
        placeholder: 'Enter text here...',
        error: undefined,
        disabled: false,
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof InputField>;


export default meta;
type Story = StoryObj<typeof InputField>

export const Default: Story = {
    render: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = useState('');
        return <InputField {...args} value={value} onChange={setValue} />;
    },
    args: {
        label: 'Default Input',
        type: 'text',
    },
    parameters: {
        docs: {
            description: {
                story: 'The default text input field with basic styling and functionality.',
            },
        },
    },
}

export const WithValue: Story = {
    args: {
        type: "text",
        value: "With Value",
        required: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Field with prefilled text values',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const value = canvas.getByRole('textbox')
        expect(value).toHaveValue('With Value')
    }
}

export const RequiredField: Story = {
    args: {
        label: 'Required Field',
        type: "text",
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
}

export const WithValidation: Story = {
    args: {
        required: true,
        label: 'Input with Error',
        error: 'This field is required',
    },
    parameters: {
        docs: {
            description: {
                story: 'Displays validation error message and error styling',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.getByText('This field is required')).toBeInTheDocument();
        expect(canvas.getByRole('textbox')).toHaveClass('border-red-500');
    }
}

export const Textarea: Story = {
    args: {
        label: 'Text Area',
        type: 'textarea',
    },
    parameters: {
        docs: {
            description: {
                story: 'Textarea variant with fixed height and no resize handle',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const textarea = canvas.getByRole('textbox');
        expect(textarea).toHaveClass('h-[76px]');
        expect(textarea).toHaveStyle('resize: none');
    }
};

export const DisabledState: Story = {
    args: {
        label: 'Disabled Input',
        disabled: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Disabled state prevents user interaction',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole('textbox');
        expect(input).toBeDisabled();
    }
};

export const InteractiveExample: Story = {
    render: (args) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = useState('');
        return <InputField {...args} value={value} onChange={setValue} />;
    },
    args: {
        label: 'Interactive Example',
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates live interaction with the input field',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole('textbox');
        
        await userEvent.type(input, 'Interactive test');
        await waitFor(() => {
            expect(input).toHaveValue('Interactive test');
        });
    }
};