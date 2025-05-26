import { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, waitFor, expect } from "@storybook/test";
import DeleteButton from "@/components/shared/buttons/DeleteButton";

const meta: Meta<typeof DeleteButton> = {
    title: "shared/buttons/DeleteButton",
    component: DeleteButton,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A button for when deleting an item.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        children: {
            control: { type: 'text' },
            description: 'Button label content',
            table: {
                type: { summary: 'ReactNode' },
                category: 'Content',
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
        isDeleting: {
            control: { type: 'boolean' },
            description: 'Disables the button and shows visual feedback',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
                category: 'State',
            },
        },
        title: {
            control: { type: 'text' },
            description: 'Summary of the modal',
            table: {
                type: { summary: 'string' },
                category: 'Content',
            }
        },
        message: {
            control: { type: 'text' },
            description: 'Body of the modal',
            table: {
                type: { summary: 'string' },
                category: 'Content',
            }
        },
        confirmButtonText: {
            control: { type: 'text' },
            description: 'text for confirm button',
            table: {
                type: { summary: 'string' },
                category: 'Content',
            }
        },
        cancelButtonText: {
            control: { type: 'text' },
            description: 'text for cancel button',
            table: {
                type: { summary: 'string' },
                category: 'Content',
            }
        }
    },
    args: {
        children: 'Delete',
        onClick: fn(),
        className: '',
        disabled: false,
        isDeleting: false,
        title: '',
        message: '',
        confirmButtonText: 'Delete field',
        cancelButtonText: 'Cancel',
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof DeleteButton>;

export default meta;
type Story = StoryObj<typeof DeleteButton>

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const Default: Story = {
    args: {

    },
    parameters: {
        docs: {
            description: {
                story: 'The default state of the delete button.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.getByText('Delete')).toBeInTheDocument();
    }
}

export const WhenClickDelete: Story = {
    args: {

    },
    parameters: {
        docs: {
            description: {
                story: 'A confirmation shows when click.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await delay(1000)
        userEvent.click(canvas.getByText('Delete'))

        await waitFor(() => {
            expect(canvas.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
            expect(canvas.getByRole('button', { name: 'Delete field' })).toBeInTheDocument();
        })
    }
}

export const CustomDeleteButton: Story = {
    args: {
        children: "Custom",
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when customizing on the delete button.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('Custom')).toBeInTheDocument();
    }
}

export const CustomDeleteConfirmationModal: Story = {
    args: {
        children: "Custom",
        title: "Trassh?",
        message: "Dont trash me pleaase",
        confirmButtonText: "Trashh",
        cancelButtonText: "Dontt..",
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when customizing on the delete button.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await delay(2000)
        userEvent.click(canvas.getByText('Custom'))

        await delay(1000)
        await expect(canvas.getByRole('button', { name: 'Trashh' })).toBeInTheDocument();
        await expect(canvas.queryByRole('button', { name: 'Dontt..' })).toBeInTheDocument();
        await expect(canvas.getByText('Trassh?')).toBeInTheDocument();
        await expect(canvas.getByText('Dont trash me pleaase')).toBeInTheDocument();
    }
}

export const WhenProcessingDelete: Story = {
    args: {
        isDeleting: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when confirming on delete'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await delay(2000)
        userEvent.click(canvas.getByText('Delete'))

        await delay(1000)
        await expect(canvas.getByRole('button', { name: 'Updating...' })).toBeDisabled();
        await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    }
}

export const DisabledState: Story = {
    args: {
        disabled: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when delete is in a disabled state'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        userEvent.click(canvas.getByText('Delete'))
        await expect(canvas.getByText('Delete')).toBeDisabled();
    }
}