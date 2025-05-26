import { Meta, StoryObj } from "@storybook/react";
import { fn, expect, within } from "@storybook/test";
import { InventoryButton } from "@/components/inventory/InventoryManagementTable/InventoryButton";

const meta: Meta<typeof InventoryButton> = {
    title: "inventory/InventoryManagementTable/InventoryButton",
    component: InventoryButton,
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
            options: ['actions', 'add'],
            description: 'Visual style variant of the button',
            table: {
                type: { summary: 'actions | add' },
                defaultValue: { summary: 'primary' },
                category: 'Type',
            },
        },
        onAdd: {
            action: 'onAdd',
            description: 'Callback when button is clicked',
            table: {
                type: { summary: '() => void' },
                category: 'Events',
            },
        },
        onOut: {
            action: 'onOut',
            description: 'Callback when button is clicked',
            table: {
                type: { summary: '() => void' },
                category: 'Events',
            },
        },
        onEdit: {
            action: 'onEdit',
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
        variant: 'actions',
        onAdd: fn(),
        onOut: fn(),
        onEdit: fn(),
        type: 'button',
        disabled: false,
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof InventoryButton>;


export default meta;
type Story = StoryObj<typeof InventoryButton>

export const ButtonRowActions: Story = {
    args: {
        variant: 'actions'
    },
    play: async ({ canvasElement }) => {
        const canvas  = within(canvasElement)
        expect(canvas.getByRole('button', {name: 'Assign'})).toBeInTheDocument();
        expect(canvas.getByRole('button', {name: 'Edit'})).toBeInTheDocument();
    }
}

export const DisabledAssignActionsButton: Story = {
    args: {
        variant: 'actions',
        disabled: true,
    },
    play: async ({ canvasElement }) => {
        const canvas  = within(canvasElement)
        expect(canvas.getByRole('button', {name: 'Assign'})).toBeDisabled();
        expect(canvas.getByRole('button', {name: 'Edit'})).toBeInTheDocument();
    }
}

export const ButtonAdd: Story = {
    args: {
        variant: 'add'
    },
    play: async ({ canvasElement }) => {
        const canvas  = within(canvasElement)
        expect(canvas.getByRole('button', {name: 'Add Item'})).toBeInTheDocument();
    }
}

