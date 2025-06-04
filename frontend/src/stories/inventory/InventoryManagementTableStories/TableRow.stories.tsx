import { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import { TableRow } from "@/components/inventory/InventoryManagementTable/TableRow";
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

const meta: Meta<typeof TableRow> = {
    title: "inventory/InventoryManagementTable/TableRow",
    component: TableRow,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A component that displays item values',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        item: {
            description: 'data',
            table: {
                category: 'Value',
            }
        },
        onOut: {
            action: 'onOut',
            description: 'Callback when out button is clicked',
            table: {
                type: { summary: '(item: InventoryItem) => void' },
                category: 'Events',
            },
        },
        onEdit: {
            action: 'onEdit',
            description: 'Callback when edit button is clicked',
            table: {
                type: { summary: '(item: InventoryItem) => void' },
                category: 'Events',
            },
        },
        onToggle: {
            action: 'onToggle',
            description: 'Callback when button is clicked',
            table: {
                type: { summary: '(id: number) => void' },
                category: 'Events',
            },
        },
        isExpanded: {
            control: { type: 'boolean' },
            description: 'When item row is expanded, reveals more details',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
                category: 'State',
            },
        },
    },
    args: {
        item: sampleProduct,
        index: 1,
        isExpanded: false,
        onToggle: fn(),
        onOut: fn(),
        onEdit: fn(),
        searchQuery: '',
        highlightedItem: null,
        currentPage: 1,
        itemsPerPage: 10,
        maxNoteLength: 46,
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof TableRow>;

export default meta;
type Story = StoryObj<typeof TableRow>

export const Default: Story = {
    args: {
        isExpanded: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'The default state of table row.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('12')).toBeInTheDocument();
        await expect(canvas.getByText('Test edit')).toBeInTheDocument();
        await expect(canvas.getByText('Fresh from edit')).toBeInTheDocument();
        await expect(canvas.getByText('10 Pieces')).toBeInTheDocument();
        await expect(canvas.getByText(/100.00/i)).toBeInTheDocument();
        await expect(canvas.getByText('Assign')).toBeInTheDocument();
        await expect(canvas.getByText('Edit')).toBeInTheDocument();
    }
}

export const WhenExpanded: Story = {
    args: {
        isExpanded: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'When table row is expanded.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('12')).toBeInTheDocument();
        await expect(canvas.getByText('Test edit')).toBeInTheDocument();
        await expect(canvas.getByText('Fresh from edit')).toBeInTheDocument();
        await expect(canvas.getByText('10 Pieces')).toBeInTheDocument();
        await expect(canvas.getByText(/100.00/i)).toBeInTheDocument();
        await expect(canvas.getByText('Assign')).toBeInTheDocument();
        await expect(canvas.getByText('Edit')).toBeInTheDocument();
        await expect(canvas.getByText(/1000.00/i)).toBeInTheDocument();
        await expect(canvas.getByText(`${new Date().toLocaleDateString()}`)).toBeInTheDocument();
        await expect(canvas.getByText('No date available')).toBeInTheDocument();
    }
}

export const HighlightItem: Story = {
    args: {
        searchQuery: 'Test ed',
    },
    parameters: {
        docs: {
            description: {
                story: 'When searching for a specific item.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('12')).toBeInTheDocument();
        await expect(canvas.getByText('Test ed')).toBeInTheDocument();
        await expect(canvas.getByText('Fresh from edit')).toBeInTheDocument();
        await expect(canvas.getByText('10 Pieces')).toBeInTheDocument();
        await expect(canvas.getByText(/100.00/i)).toBeInTheDocument();
        await expect(canvas.getByText('Assign')).toBeInTheDocument();
        await expect(canvas.getByText('Edit')).toBeInTheDocument();
    }
}

export const HighlightItemEdit: Story = {
    args: {
        highlightedItem: {
            id: 1,
            type: "edited"
        }
    },
    parameters: {
        docs: {
            description: {
                story: 'The default state of the edited button.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('12')).toBeInTheDocument();
        await expect(canvas.getByText('Fresh from edit')).toBeInTheDocument();
        await expect(canvas.getByText('10 Pieces')).toBeInTheDocument();
        await expect(canvas.getByText(/100.00/i)).toBeInTheDocument();
        await expect(canvas.getByText('Assign')).toBeInTheDocument();
        await expect(canvas.getByText('Edit')).toBeInTheDocument();
        await expect(canvas.getByText('Edit')).toBeInTheDocument();
        const row = canvas.getByRole('article')
        const divs = row.querySelectorAll('div')
        await expect(divs[0]).toHaveClass('bg-amber-50/30 border-l-6 border-amber-400');
    }
}

export const HighlightItemAssigned: Story = {
    args: {
        highlightedItem: {
            id: 1,
            type: "assigned"
        }
    },
    parameters: {
        docs: {
            description: {
                story: 'Highlight row when assigned.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('12')).toBeInTheDocument();
        await expect(canvas.getByText('Fresh from edit')).toBeInTheDocument();
        await expect(canvas.getByText('10 Pieces')).toBeInTheDocument();
        await expect(canvas.getByText(/100.00/i)).toBeInTheDocument();
        await expect(canvas.getByText('Assign')).toBeInTheDocument();
        await expect(canvas.getByText('Edit')).toBeInTheDocument();
        const row = canvas.getByRole('article')
        const divs = row.querySelectorAll('div')
        await expect(divs[0]).toHaveClass('bg-sky-50/30 border-l-6 border-sky-400');
    }
}

export const HighlightItemAdded: Story = {
    args: {
        highlightedItem: {
            id: 1,
            type: "added"
        }
    },
    parameters: {
        docs: {
            description: {
                story: 'Highlight row when added.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('12')).toBeInTheDocument();
        await expect(canvas.getByText('Fresh from edit')).toBeInTheDocument();
        await expect(canvas.getByText('10 Pieces')).toBeInTheDocument();
        await expect(canvas.getByText(/100.00/i)).toBeInTheDocument();
        await expect(canvas.getByText('Assign')).toBeInTheDocument();
        await expect(canvas.getByText('Edit')).toBeInTheDocument();
        const row = canvas.getByRole('article')
        const divs = row.querySelectorAll('div')
        await expect(divs[0]).toHaveClass('bg-emerald-50/30 border-l-6 border-emerald-400');
    }
}

const sampleProductOverflow: InventoryItem = {
    ...sampleProduct,
    note: 'This is an extremely long note that should definitely exceed the maximum note length'
};

export const WhenNoteOverflows: Story = {
    args: {
        item: sampleProductOverflow,
        maxNoteLength: 20,
    },
    parameters: {
        docs: {
            description: {
                story: 'Note truncates when it reach limit'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('12')).toBeInTheDocument();
        await expect(canvas.getByText('10 Pieces')).toBeInTheDocument();
        await expect(canvas.getByText(/100.00/i)).toBeInTheDocument();
        await expect(canvas.getByText('Assign')).toBeInTheDocument();
        await expect(canvas.getByText('Edit')).toBeInTheDocument();
        const noteElement = canvas.getByText(/↗/);
        await userEvent.hover(noteElement);
        await expect(canvas.getByText(/This is an extremely/i)).toBeInTheDocument();
        await expect(canvas.getByText('long note that should definitely exceed the maximum note length')).toBeInTheDocument();
    }
}

const sampleProductQuantityZero: InventoryItem = {
    ...sampleProduct,
    quantity: 0,
    total: 0,
};

export const DisabledAssignButton: Story = {
    args: {
        item: sampleProductQuantityZero,
    },
    parameters: {
        docs: {
            description: {
                story: 'When an item is at zero quantity or out of stock'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('12')).toBeInTheDocument();
        await expect(canvas.getByText('0 Pieces')).toBeInTheDocument();
        await expect(canvas.getByText(/100.00/i)).toBeInTheDocument();
        await expect(canvas.getByText('Assign')).toBeInTheDocument();
        await expect(canvas.getByText('Edit')).toBeInTheDocument();
        await expect(canvas.getByRole('button', { name: /Assign/i })).toBeDisabled();
    }
}