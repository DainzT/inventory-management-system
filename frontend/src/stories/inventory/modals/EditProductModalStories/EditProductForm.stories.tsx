import { Meta, StoryObj } from "@storybook/react";
import { fn, expect, userEvent, within, waitFor } from "@storybook/test";
import EditProductForm from "@/components/inventory/modals/EditProductModal/EditProductForm";
import { InventoryItem } from "@/types";

const sampleProduct: InventoryItem = {
    id: 1,
    name: 'Test edit',
    note: 'Fresh from edit',
    quantity: 10,
    selectUnit: 'Piece',
    unitPrice: 100,
    unitSize: 1,
    total: 1000,
    dateCreated: new Date(),
};


const meta: Meta<typeof EditProductForm> = {
    title: "inventory/modals/EditProductModal/EditProductForm",
    component: EditProductForm,
    parameters: {
        layout: 'centered',
        description: {
            component: 'The Edit Product Form Component that handles editable inputs and form submission',
        },
    },
    tags: ['autodocs'],
    argTypes: {
        initialData: {
            description: 'Selected data',
            table: {
                category: 'value',
            }
        },
        onSubmit: {
            action: 'onSubmit',
            description: 'Callback when form is submitted with valid data',
            table: {
                category: 'Events',
            }
        },
        onFormChange: {
            action: 'onFormChange',
            description: 'Triggered when form dirty state changes',
            table: {
                category: 'Form',
            }
        },
        isEditing: {
            control: 'boolean',
            defaultValue: false,
            description: 'Controls loading state during submission of edit',
            table: {
                category: 'State',
            }
        },
        isDeleting: {
            control: 'boolean',
            defaultValue: false,
            description: 'Controls loading state during deletion of item',
            table: {
                category: 'State',
            }
        }
    },
    args: {
        initialData: sampleProduct,
        onSubmit: fn(),
        onDelete: fn(),
        onFormChange: fn(),
        isEditing: false,
        isDeleting: false,
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof EditProductForm>;


export default meta;
type Story = StoryObj<typeof EditProductForm>

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const EditableState: Story = {
    args: {
        initialData: sampleProduct
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when it is edited'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByDisplayValue('Test edit')).toBeInTheDocument();
        await expect(canvas.getByDisplayValue('Fresh from edit')).toBeInTheDocument();
        await expect(canvas.getByDisplayValue('10')).toBeInTheDocument();
        await expect(canvas.getByDisplayValue('100')).toBeInTheDocument();
        await expect(canvas.getByDisplayValue('1')).toBeInTheDocument();
        await expect(canvas.getByDisplayValue('1000')).toBeInTheDocument();
        const getUnit = canvas.getAllByText('Piece')
        getUnit.forEach(unit => {
            expect(unit).toBeInTheDocument();
            const value = within(unit).getByText('Piece');
            expect(value).toBeInTheDocument();
        })
    }
}

export const withProcessingEdit: Story = {
    args: {
        initialData: sampleProduct,
        isEditing: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks after confirming newly change edits.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByText('Updating...')).toBeInTheDocument();
        const submitButton = canvas.getByRole('button', { name: /Updating.../i });
        await expect(submitButton).toBeDisabled();
        await expect(canvas.getByDisplayValue('Test edit')).toBeDisabled();
        await expect(canvas.getByDisplayValue('Fresh from edit')).toBeDisabled();
        await expect(canvas.getByDisplayValue('100')).toBeDisabled();
        await expect(canvas.getByDisplayValue('1')).toBeDisabled();
        await expect(canvas.getByDisplayValue('1000')).toBeDisabled();
        const getUnit = canvas.getAllByText('Piece')[0]
        expect(getUnit).toBeInTheDocument();
        const value = within(getUnit).getByText('Piece').closest('div');
        expect(value).toHaveClass(/cursor-not-allowed/);
    }
}

export const WithValidationErrors: Story = {
    args: {
        initialData: sampleProduct
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when submitting with empty changes.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(async () => {
            const name = canvas.getByDisplayValue('Test edit')
            userEvent.clear(name)
            const note = canvas.getByDisplayValue('Fresh from edit')
            userEvent.clear(note)
            const unitSize = canvas.getByDisplayValue('1')
            userEvent.clear(unitSize)
        })
        await userEvent.click(canvas.getByRole('button', { name: /Confirm Changes/i }));

        await waitFor(() => {
            expect(canvas.getByText('Product name is required.')).toBeInTheDocument();
            expect(canvas.getByText('Note is required.')).toBeInTheDocument();
            expect(canvas.getByText('Enter a valid unit size.')).toBeInTheDocument();
        });
    }
}

export const WithSuccessfulSubmission: Story = {
    args: {
        initialData: sampleProduct
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when submitting with changes in edit.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(async () => {
            const name = canvas.getByDisplayValue('Test edit')
            userEvent.clear(name)
            await userEvent.type(name, 'Puruna')
        })

        const label = canvas.getAllByText('Piece')[0];
        const div = label.closest('div') as HTMLDivElement;

        await waitFor(async () => {
            const selectDiv = within(div).getByText('Piece').closest('div') as HTMLDivElement;
            await userEvent.click(selectDiv);
            await delay(500)
        })

        const selectUnit = canvas.getByText('Box')
        userEvent.click(selectUnit)

        await expect(canvas.getByDisplayValue('Puruna')).toBeInTheDocument();
        await expect(canvas.getByText('Box')).toBeInTheDocument();

        await userEvent.click(canvas.getByRole('button', { name: /Confirm Changes/i }));
    }
}

export const DeleteConfirmationModal: Story = {
    args: {
        initialData: sampleProduct
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when clicking on delete.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await delay(1000);
        await userEvent.click(canvas.getByRole('button', { name: /Delete/i }));

        await expect(canvas.getByText('Delete field')).toBeInTheDocument();
        await expect(canvas.getByText('Cancel')).toBeInTheDocument();
    }
}

export const WithCancelDelete: Story = {
    args: {
        initialData: sampleProduct
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when clicking on delete and then cancelling.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await delay(1000);
        await userEvent.click(canvas.getByRole('button', { name: /Delete/i }));

        await expect(canvas.getByText('Delete field')).toBeInTheDocument();
        await expect(canvas.getByText('Cancel')).toBeInTheDocument();
        await delay(1000);
        await userEvent.click(canvas.getByRole('button', { name: /Cancel/i }));
    }
}

export const WithDeleteFieldConfirmation: Story = {
    args: {
        initialData: sampleProduct
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when clicking on delete and then confirming.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await delay(1000);
        await userEvent.click(canvas.getByRole('button', { name: /Delete/i }));

        await expect(canvas.getByText('Delete field')).toBeInTheDocument();
        await expect(canvas.getByText('Cancel')).toBeInTheDocument();
        await delay(1000);
        await userEvent.click(canvas.getByRole('button', { name: /Delete field/i }));
    }
}

export const WithProcessingDelete: Story = {
    args: {
        initialData: sampleProduct,
        isDeleting: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when delete is processing'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await delay(1000);
        await userEvent.click(canvas.getByRole('button', { name: /Delete/i }));

        await expect(canvas.getByText('Updating...')).toBeInTheDocument();
        await expect(canvas.getByText('Cancel')).toBeInTheDocument();
        await delay(1000);
        await expect(canvas.getByRole('button', { name: /Updating.../i })).toBeDisabled;
    }
}