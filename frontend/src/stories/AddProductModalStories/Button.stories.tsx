import { Meta, StoryObj } from "@storybook/react";
import { fn, expect, userEvent, within } from "@storybook/test";
import { Button } from "@/components/AddProductModal/Button";

const meta: Meta<typeof Button> = {
    title: "Add Product Modal/Button",
    component: Button,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A flexible Button component with variants, customizeable inputs, and styles',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['primary', 'secondary'],
            description: 'Visual style variant of the button',
            table: {
                type: { summary: 'primary | secondary' },
                defaultValue: { summary: 'primary' },
            },
        },
        children: {
            control: { type: 'text' },
            description: 'Button label content',
            table: {
                type: { summary: 'ReactNode' },
            },
        },
        onClick: {
            action: 'clicked',
            description: 'Callback when button is clicked',
            table: {
                type: { summary: '() => void' },
                category: 'Events',
            },
        },
        type: {
            control: { type: 'select' },
            options: ['button', 'submit'],
            description: 'HTML button type attribute',
            table: {
                type: { summary: 'button | submit' },
                defaultValue: { summary: 'button' },
                category: 'HTML Attributes',
            },
        },
        className: {
            control: { type: 'text' },
            description: 'Additional CSS classes for custom styling',
            table: {
                type: { summary: 'string' },
                category: 'Styling',
            },
        },
        disabled: {
            control: { type: 'boolean' },
            description: 'Disables the button and shows visual feedback',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
                category: 'State',
            },
        },
    },
    args: {
        variant: 'primary',
        children: 'Button',
        onClick: fn(),
        type: 'button',
        className: '',
        disabled: false,
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof Button>;


export default meta;
type Story = StoryObj<typeof Button>

export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Primary Button',
    },
    parameters: {
        docs: {
            description: {
                story: 'The main button style used for primary actions throughout the application.',
            },
        },
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button');

        expect(button).toHaveClass('px-6');
        expect(button).toHaveClass('py-2');
        expect(button).toHaveClass('rounded-[5px]');
        expect(button).toHaveClass('inter-font');
        expect(button).toHaveClass('cursor-pointer');

        expect(button).toHaveClass('bg-[#1B626E]');
        expect(button).toHaveClass('text-white');
        expect(button).toHaveClass('hover:bg-[#297885]');
        expect(button).toHaveClass('active:bg-[#145965]');
        expect(button).toHaveClass('transition-colors');

        await userEvent.click(button);
        expect(args.onClick).toHaveBeenCalled();
        expect(button).toHaveTextContent("Primary Button");
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
    },
    parameters: {
        docs: {
            description: {
                story: 'Used for secondary actions that need less visual prominence than primary buttons.',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('px-6');
        expect(button).toHaveClass('py-2');
        expect(button).toHaveClass('rounded-[5px]');
        expect(button).toHaveClass('inter-font');
        expect(button).toHaveClass('cursor-pointer');
        
        expect(button).toHaveClass('border-[1px]');
        expect(button).toHaveClass('border-[#1B626E]');
        expect(button).toHaveClass('text-[#1B626E]');
        expect(button).toHaveClass('hover:bg-[#1B626E]/5');
        expect(button).toHaveClass('active:bg-[#1B626E]/10');
        expect(button).toHaveClass('transition-colors');

        expect(button).toHaveTextContent("Secondary Button");
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        children: 'Disabled Button',
    },
    parameters: {
        docs: {
            description: {
                story: 'Disabled buttons appear inactive and cannot be interacted with.',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveTextContent("Disabled Button");
    },
};

export const SubmitButton: Story = {
    args: {
        type: 'submit',
        children: 'Submit Form',
    },
    parameters: {
        docs: {
            description: {
                story: 'When used within forms, this button will trigger form submission.',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent("Submit Form");
    },
};

export const CustomStyling: Story = {
    args: {
        children: 'Custom Button',
        className: 'text-lg font-bold uppercase',
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates how to apply custom styles while maintaining the base button functionality.',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('text-lg');
        expect(button).toHaveClass('font-bold');
        expect(button).toHaveClass('uppercase');
        expect(button).toHaveClass('px-6');
        expect(button).toHaveClass('py-2');
        expect(button).toHaveClass('rounded-[5px]');
        expect(button).toHaveTextContent("Custom Button");
    },
};
