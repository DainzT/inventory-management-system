import { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import { InventoryTable } from "@/components/inventory/InventoryManagementTable/InventoryTable";
import { InventoryItem } from "@/types";
import { useState } from "react";

const sampleProducts: InventoryItem[] = [
    {
        id: 1,
        name: 'Test Product A',
        note: 'Standard inventory item',
        quantity: 10,
        selectUnit: 'Piece',
        unitPrice: 100,
        unitSize: 1,
        total: 1000,
        dateCreated: new Date('2023-01-15'),
    },
    {
        id: 2,
        name: 'Test Product B',
        note: 'This is an extremely long note that should trigger the truncation behavior in the TableRow component. It exceeds th',
        quantity: 5,
        selectUnit: 'Box',
        unitPrice: 250.50,
        unitSize: 10,
        total: 1252.50,
        dateCreated: new Date('2023-02-20'),
    },
    {
        id: 3,
        name: 'Test Product C',
        note: 'Bulk item',
        quantity: 3.5,
        selectUnit: 'Kilogram',
        unitPrice: 12.75,
        unitSize: 0.5,
        total: 89.25,
        dateCreated: new Date('2023-03-10'),
    },
    {
        id: 4,
        name: 'Out of Stock Item',
        note: 'This product needs restocking',
        quantity: 0,
        selectUnit: 'Piece',
        unitPrice: 50,
        unitSize: 1,
        total: 0,
        dateCreated: new Date('2023-04-01')
    },
    {
        id: 5,
        name: 'Out of Stock Item Two',
        note: 'This product needs restocking',
        quantity: 0,
        selectUnit: 'Piece',
        unitPrice: 50,
        unitSize: 1,
        total: 0,
        dateCreated: new Date('2023-04-01')
    }
];

const meta: Meta<typeof InventoryTable> = {
    title: "inventory/InventoryManagementTable/InventoryTable",
    component: InventoryTable,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A component that stores multiple rows of data',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        items: {
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
        onToggleExpand: {
            action: 'onToggle',
            description: 'Callback when button is clicked',
            table: {
                type: { summary: '(id: number) => void' },
                category: 'Events',
            },
        },

    },
    args: {
        items: sampleProducts.slice(0, 3),
        expandedItem: null,
        onToggleExpand: fn(),
        onOut: fn(),
        onEdit: fn(),
        searchQuery: '',
        highlightedItem: null,
        currentPage: 1,
        itemsPerPage: 10,
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof InventoryTable>;

export default meta;
type Story = StoryObj<typeof InventoryTable>

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const StatefulWrapper = () => {
    const [isExpanded, setIsExpanded] = useState<number | null>(null);
    const handleItem = () => {
        console.log("Delete/Edit item clicked with empty data");
    };
    const handleToggle = (id: number) => {
        setIsExpanded(id)
    }
    return (
        <InventoryTable
            expandedItem={isExpanded}
            items={sampleProducts}
            onOut={handleItem}
            onEdit={handleItem}
            onToggleExpand={handleToggle}
            searchQuery=""
            currentPage={1}
            itemsPerPage={10}
        />
    );
};

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default state of Table.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('Test Product A')).toBeInTheDocument();
        await expect(canvas.getByText('Test Product B')).toBeInTheDocument();
        await expect(canvas.getByText('Test Product C')).toBeInTheDocument();
    }
}

export const ExpandingItems: Story = {
    render: () => {
        return (
            <StatefulWrapper />
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'When an item in the table is expanded'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const rows = canvas.getAllByRole('article')
        for (const row of rows) {
            const divs = row.querySelectorAll('div');
            await delay(1000);
            await userEvent.click(divs[9]);
        }
    }
}

export const ItemsWithQuantityZero: Story = {
    args: {
        items: sampleProducts.slice(0, 5)
    },
    parameters: {
        docs: {
            description: {
                story: 'When multiple item are out of stock.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('Out of Stock Item')).toBeInTheDocument();
        await expect(canvas.getAllByText('0 Pieces')).toHaveLength(2);
    }
}

export const HighlightItems: Story = {
    args: {
        items: sampleProducts.slice(0, 3),
        searchQuery: 'Test Product'
    },
    parameters: {
        docs: {
            description: {
                story: 'When multiple items are highlighted.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getAllByText('Test Product')).toHaveLength(3);
    }
}

export const HighlightEditedItem: Story = {
    args: {
        items: sampleProducts,
        highlightedItem: {
            id: 2,
            type: 'edited'
        }
    },
    parameters: {
        docs: {
            description: {
                story: 'When an item is edited.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const rows = canvas.getAllByRole('article')
        const divs = rows[1].querySelectorAll('div');
        await expect(canvas.getByText('Test Product B')).toBeInTheDocument();
        await expect(divs[0]).toHaveClass('bg-amber-50/30 border-l-6 border-amber-400')
    }
}

export const HighlightAssignedItem: Story = {
    args: {
        items: sampleProducts,
        highlightedItem: {
            id: 3,
            type: 'assigned'
        }
    },
    parameters: {
        docs: {
            description: {
                story: 'When an item is assigned.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const rows = canvas.getAllByRole('article')
        const divs = rows[2].querySelectorAll('div');
        await expect(canvas.getByText('Test Product C')).toBeInTheDocument();
        await expect(divs[0]).toHaveClass('bg-sky-50/30 border-l-6 border-sky-400')
    }
}

export const HighlightAddedItem: Story = {
    args: {
        items: sampleProducts,
        highlightedItem: {
            id: 1,
            type: 'added'
        }
    },
    parameters: {
        docs: {
            description: {
                story: 'When an item is added.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const rows = canvas.getAllByRole('article')
        const divs = rows[0].querySelectorAll('div');
        await expect(canvas.getByText('Test Product A')).toBeInTheDocument();
        await expect(divs[0]).toHaveClass('bg-emerald-50/30 border-l-6 border-emerald-400')
    }
}