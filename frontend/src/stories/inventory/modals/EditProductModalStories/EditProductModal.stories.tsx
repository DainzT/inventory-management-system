import { Meta, StoryObj } from "@storybook/react";
import { fn, expect, userEvent, within, waitFor } from "@storybook/test";
import EditProductModal from "@/components/inventory/modals/EditProductModal/EditProductModal";
import { InventoryItem } from "@/types";
import { useState } from "react";

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


const meta: Meta<typeof EditProductModal> = {
    title: "inventory/modals/EditProductModal/EditProductModal",
    component: EditProductModal,
    parameters: {
        layout: 'centered',
        description: {
            component: 'The Edit Product Modal Component allows editing values and control various states',
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
        setIsOpen: {
            action: 'setIsOpen',
        },
        selectedItem: {
            description: 'Selected data',
            table: {
                category: 'Value',
            }
        },
        onDeleteItem: {
            action: 'onDelete',
            description: 'Callback when form is submitted with valid data',
            table: {
                category: 'Events',
            }
        },
        onEditItem: {
            action: 'onEdit',
            description: 'Triggered when form dirty state changes',
            table: {
                category: 'Events',
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
        isOpen: false,
        setIsOpen: fn(),
        selectedItem: sampleProduct,
        onDeleteItem: fn(),
        onEditItem: fn(),
        isEditing: false,
        isDeleting: false,
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof EditProductModal>;


export default meta;
type Story = StoryObj<typeof EditProductModal>

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const StatefulWrapper = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const handleEditItem = () => {
        setIsEditing(true)
        console.log("Delete/Edit item clicked with empty data");
    };
    const handleDeleteItem = () => {
        setIsDeleting(true);
        console.log("Delete/Edit item clicked with empty data");
    };
    return (
        <EditProductModal
            selectedItem={sampleProduct}
            onDeleteItem={handleDeleteItem}
            onEditItem={handleEditItem}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isEditing={isEditing}
            isDeleting={isDeleting}
        />
    );
};


export const EditableState: Story = {
    args: {
        selectedItem: sampleProduct,
        isOpen: true
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when an item is in an editable state.'
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
        const getUnit = canvas.getAllByText('Piece')
        getUnit.forEach(unit => {
            expect(unit).toBeInTheDocument();
            const value = within(unit).getByText('Piece');
            expect(value).toBeInTheDocument();
        })
    }
}

export const CloseModal: Story = {
    render: () => {
        return (
            <StatefulWrapper />
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when the modal is close without being edited.'
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
        const getUnit = canvas.queryAllByText('Piece')
        getUnit.forEach(unit => {
            expect(unit).toBeInTheDocument();
            const value = within(unit).getByText('Piece');
            expect(value).toBeInTheDocument();
        })
        await delay(1000)
        await userEvent.click(canvas.getByLabelText('Close dialog'));

        await waitFor(() => {
            expect(canvas.queryByDisplayValue('Test edit')).not.toBeInTheDocument();
            expect(canvas.queryByDisplayValue('Fresh from edit')).not.toBeInTheDocument();
            expect(canvas.queryByDisplayValue('10')).not.toBeInTheDocument();
            expect(canvas.queryByDisplayValue('100')).not.toBeInTheDocument();
            expect(canvas.queryByDisplayValue('1')).not.toBeInTheDocument();
            getUnit.forEach(unit => {
                expect(unit).not.toBeInTheDocument();
                const value = within(unit).getByText('Piece');
                expect(value).not.toBeInTheDocument();
            })
        });
    }
}

export const DiscardEditConfirmationModal: Story = {
    args: {
        selectedItem: sampleProduct,
        isOpen: true
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when an item is edited.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await waitFor(async () => {
            const name = canvas.getByDisplayValue('Test edit')
            userEvent.clear(name)
            await userEvent.type(name, 'Lightbulb')
        })
        await delay(1000)
        await userEvent.click(canvas.getByLabelText('Close dialog'));
        await expect(canvas.getByText('Discard Changes')).toBeInTheDocument();
        await expect(canvas.getByText('Cancel')).toBeInTheDocument();
    }
}

export const DiscardCancelConfirmation: Story = {
    args: {
        selectedItem: sampleProduct,
        isOpen: true
    },
    parameters: {
        docs: {
            description: {
                story: 'When an item is cancelled from being discarded.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await waitFor(async () => {
            const name = canvas.getByDisplayValue('Test edit')
            userEvent.clear(name)
            await userEvent.type(name, 'Lightbulb')
        })
        await delay(1000)
        await userEvent.click(canvas.getByLabelText('Close dialog'));
        await expect(canvas.getByText('Discard Changes')).toBeInTheDocument();
        await expect(canvas.getByText('Cancel')).toBeInTheDocument();

        await delay(1000);
        userEvent.click(canvas.getByRole('button', { name: /Cancel/i }));

        await waitFor(() => {
            expect(canvas.queryByText('Discard Changes')).toBeNull();
            expect(canvas.queryByText('Cancel')).toBeNull();
        });

        await waitFor(() => {
            expect(canvas.getByDisplayValue('Lightbulb')).toBeInTheDocument();
            expect(canvas.getByDisplayValue('Fresh from edit')).toBeInTheDocument();
            expect(canvas.getByDisplayValue('10')).toBeInTheDocument();
            expect(canvas.getByDisplayValue('100')).toBeInTheDocument();
            expect(canvas.getByDisplayValue('1')).toBeInTheDocument();
            expect(canvas.getByDisplayValue('1000')).toBeInTheDocument();
        })
    }
}

export const DiscardChangesConfirmation: Story = {
    render: () => {
        return (
            <StatefulWrapper />
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'When an edited item is discarded.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await waitFor(async () => {
            const name = canvas.getByDisplayValue('Test edit')
            userEvent.clear(name)
            await userEvent.type(name, 'Lightbulb')
        })
        await delay(1000)
        await userEvent.click(canvas.getByLabelText('Close dialog'));
        await expect(canvas.getByText('Discard Changes')).toBeInTheDocument();
        await expect(canvas.getByText('Cancel')).toBeInTheDocument();

        await delay(1000);
        userEvent.click(canvas.getByRole('button', { name: /Discard Changes/i }));

        await waitFor(() => {
            expect(canvas.queryByText('Lightbulb')).toBeNull();
        })
    }
}

export const DeleteConfirmationModal: Story = {
    args: {
        selectedItem: sampleProduct,
        isOpen: true,
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

export const DeleteCancelConfirmation: Story = {
    args: {
        selectedItem: sampleProduct,
        isOpen: true
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when clicking cancel on delete.'
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

export const DeleteFieldConfirmation: Story = {
    render: () => {
        return (
            <StatefulWrapper />
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when deleting an item'
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

export const SubmitWithBlankEdits: Story = {
    args: {
        selectedItem: sampleProduct,
        isOpen: true
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when an item has blank edits when submitted'
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
            const quantity = canvas.getByDisplayValue('10')
            userEvent.clear(quantity)
            const unitSize = canvas.getByDisplayValue('1')
            userEvent.clear(unitSize)
            const unitPrice = canvas.getByDisplayValue('100')
            userEvent.clear(unitPrice)
        })

        await userEvent.click(canvas.getByRole('button', { name: /Confirm Changes/i }));
    }
}

export const SubmitEditedForm: Story = {
    render: () => {
        return (
            <StatefulWrapper />
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when an item is edited.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(async () => {
            const name = canvas.getByDisplayValue('Test edit')
            userEvent.clear(name)
            await userEvent.type(name, 'Lightbulb')
        })

        await waitFor(async () => {
            const note = canvas.getByDisplayValue('Fresh from edit')
            userEvent.clear(note)
            await userEvent.type(note, '100 watts')
        })

        await expect(canvas.getByDisplayValue('Lightbulb')).toBeInTheDocument();
        await expect(canvas.getByDisplayValue('100 watts')).toBeInTheDocument();

        await userEvent.click(canvas.getByRole('button', { name: /Confirm Changes/i }));

        
        await expect(canvas.getByDisplayValue('Lightbulb')).toBeInTheDocument();
        await expect(canvas.getByDisplayValue('Lightbulb')).toBeInTheDocument();
        await expect(canvas.getByDisplayValue('Lightbulb')).toBeDisabled();
        await expect(canvas.getByDisplayValue('Lightbulb')).toBeDisabled();
        await expect(canvas.getByDisplayValue('100')).toBeDisabled();
        await expect(canvas.getByDisplayValue('1')).toBeDisabled();
        await expect(canvas.getByDisplayValue('1000')).toBeDisabled();
        const getUnit = canvas.getAllByText('Piece')[0]
        expect(getUnit).toBeInTheDocument();
        const value = within(getUnit).getByText('Piece').closest('div');
        expect(value).toHaveClass(/cursor-not-allowed/);
        await expect(canvas.getByRole('button', { name: /Updating.../i })).toBeDisabled();
    }
}
