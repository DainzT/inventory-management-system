import { Meta, StoryObj } from "@storybook/react";
import { fn, within, expect } from "@storybook/test";
import { UnsavedChangesModal } from "@/components/shared/modals/UnsavedChangesModal";

const meta: Meta<typeof UnsavedChangesModal> = {
    title: "shared/modals/UnsavedChangesModal",
    component: UnsavedChangesModal,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A Modal to verify users if they would like persist on exiting with changes.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        isOpen: {
            control: 'boolean',
            defaultValue: true,
            description: 'Called when modal visibility changes (true=opened, false=closed)',
            table: {
                category: 'State',
            }
        },
        onClose: {
            action: 'onClose',
            description: 'Triggered when close',
            table: {
                category: 'Events',
            }
        },
        onConfirm: {
            action: 'onConfirm',
            description: 'Triggered when confirmed',
            table: {
                category: 'Events',
            }
        },
        text: {
            control: { type: 'text' },
            description: 'Body of the modal',
            table: {
                type: { summary: 'string' },
                category: 'Content',
            }
        },
        header: {
            control: { type: 'text' },
            description: 'Summary of the modal',
            table: {
                type: { summary: 'string' },
                category: 'Content',
            }
        }
    },
    args: {
        isOpen: false,
        onClose: fn(),
        onConfirm: fn(),
        text: 'You have unsaved changes. Are you sure you want to leave without saving?',
        header: 'Unsaved Changes',
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof UnsavedChangesModal>;

export default meta;
type Story = StoryObj<typeof UnsavedChangesModal>

export const Default: Story = {
    args: {
        isOpen: true
    },
    parameters: {
        docs: {
            description: {
                story: 'The default fallback of the modal.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.getByText('Cancel')).toBeInTheDocument();
        expect(canvas.getByText('Discard Changes')).toBeInTheDocument();
        expect(canvas.getByText('Unsaved Changes')).toBeInTheDocument();
        expect(canvas.getByText('You have unsaved changes. Are you sure you want to leave without saving?')).toBeInTheDocument();
    }
}

export const EmptyUnsavedChangesModal: Story = {
    args: {
        isOpen: true,
        text: '',
        header:''
    },
    parameters: {
        docs: {
            description: {
                story: 'Modal when it is empty.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.getByText('Cancel')).toBeInTheDocument();
        expect(canvas.getByText('Discard Changes')).toBeInTheDocument();
    }
}

export const CustomUnsavedChangesModal: Story = {
    args: {
        isOpen: true,
        text: 'This is a custom content. Are you sure you would like to continue?',
        header:'Custom Content'
    },
    parameters: {
        docs: {
            description: {
                story: 'Modal with personal header and text.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.getByText('Cancel')).toBeInTheDocument();
        expect(canvas.getByText('Discard Changes')).toBeInTheDocument();
        expect(canvas.getByText('Custom Content')).toBeInTheDocument();
        expect(canvas.getByText('This is a custom content. Are you sure you would like to continue?')).toBeInTheDocument();
    }
}