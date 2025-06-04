import { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import InventoryManagementTable from "@/components/inventory/InventoryManagementTable/InventoryManagementTable";
import { InventoryItem } from "@/types";
import { useState } from "react";
import { waitFor } from "@testing-library/react";
import { roundTo } from "@/utils/RoundTo";
import { pluralize } from "@/utils/Pluralize";

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
        name: 'Test Product D',
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
    },
    {
        id: 6,
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
        id: 7,
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
        id: 8,
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
        id: 9,
        name: 'Test Product D',
        note: 'This product needs restocking',
        quantity: 0,
        selectUnit: 'Piece',
        unitPrice: 50,
        unitSize: 1,
        total: 0,
        dateCreated: new Date('2023-04-01')
    },
    {
        id: 10,
        name: 'Out of Stock Item Two',
        note: 'This product needs restocking',
        quantity: 0,
        selectUnit: 'Piece',
        unitPrice: 50,
        unitSize: 1,
        total: 0,
        dateCreated: new Date('2023-04-01')
    },
    {
        id: 11,
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
        id: 12,
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
        id: 13,
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
        id: 14,
        name: 'Test Product D',
        note: 'This product needs restocking',
        quantity: 0,
        selectUnit: 'Piece',
        unitPrice: 50,
        unitSize: 1,
        total: 0,
        dateCreated: new Date('2023-04-01')
    },
    {
        id: 15,
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


const meta: Meta<typeof InventoryManagementTable> = {
    title: "inventory/InventoryManagementTable/InventoryManagementTable",
    component: InventoryManagementTable,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A component that performs various actions needed to manage an inventory',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        inventoryItems: {
            description: 'data',
            table: {
                category: 'Value',
            }
        },
        setIsOutOpen: {
            action: 'setIsOutOpen',
            description: 'Callback when out button is clicked',
            table: {
                type: { summary: ' (isOpen: boolean, item?: InventoryItem) => void' },
                category: 'Events',
            },
        },
        setIsAddOpen: {
            action: 'setIsAddOpen',
            description: 'Callback when add button is clicked',
            table: {
                type: { summary: '(isOpen: boolean) => void' },
                category: 'Events',
            },
        },
        setIsEditOpen: {
            setIsEditOpen: 'setIsEditOpen',
            description: 'Callback when edit button is clicked',
            table: {
                type: { summary: ' (isOpen: boolean, item?: InventoryItem) => void' },
                category: 'Events',
            },
        },
        isLoading: {
            control: { type: 'boolean' },
            description: 'When data is still being loaded',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
                category: 'State',
            },
        },
    },
    args: {
        inventoryItems: sampleProducts.slice(0, 5),
        setIsAddOpen: fn(),
        setIsOutOpen: fn(),
        setIsEditOpen: fn(),
        isLoading: false,
        searchQuery: '',
        highlightedItem: null,
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof InventoryManagementTable>;

const StatefulWrapper = () => {
    const [isLoading,] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState("");
    const handleItem = () => {
        console.log("Delete/Edit item clicked with empty data");
    };
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredItems = sampleProducts.filter((item) => {
        if (!searchQuery.trim()) return true;

        const lowerQuery = searchQuery.toLowerCase().trim();

        const quantityDisplay = `${roundTo(Number(item.quantity), 2)} ${pluralize(item.selectUnit, Number(item.quantity))}`;
        const priceDisplay = `₱${typeof item.unitPrice === "number" ? item.unitPrice.toFixed(2) : "0.00"}`;
        const unitDisplay = `${item.unitSize} ${pluralize(item.selectUnit, Number(item.unitSize))}`;
        const pricePerUnitDisplay = `${priceDisplay} / ${unitDisplay}`;

        const searchableFields = [
            item.name?.toLowerCase(),
            item.note?.toLowerCase().slice(0, 46),

            item.quantity?.toString(),
            roundTo(Number(item.quantity), 2).toString(),
            quantityDisplay,
            pluralize(item.selectUnit, Number(item.quantity)),
            item.selectUnit,

            item.unitPrice?.toString(),
            priceDisplay.replace('₱', ''),
            priceDisplay,

            item.unitSize?.toString(),
            unitDisplay,
            pricePerUnitDisplay,

            `${item.quantity} ${item.selectUnit}`.toLowerCase(),
            `${roundTo(Number(item.quantity), 2)} ${item.selectUnit}`.toLowerCase()
        ].filter(Boolean).map(f => f.toString().toLowerCase());


        return searchableFields.some(field => field.includes(lowerQuery));
    });

    return (
        <InventoryManagementTable
            inventoryItems={filteredItems}
            setIsAddOpen={handleItem}
            setIsOutOpen={handleItem}
            setIsEditOpen={handleItem}
            onSearch={handleSearch}
            isLoading={isLoading}
            searchQuery={searchQuery}
        />
    );
};

export default meta;
type Story = StoryObj<typeof InventoryManagementTable>

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default state of the Management Table.'
            },
        },
    },
}

export const WhenTablePaginates: Story = {
    args: {
        inventoryItems: sampleProducts.slice(0, 15)
    },
    parameters: {
        docs: {
            description: {
                story: 'Table paginates when there are more than 10 items.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        waitFor(async () => {
            const rows = canvas.getAllByRole('article');
            await expect(rows).toHaveLength(10);
        })

        await delay(1000)
        await userEvent.click(canvas.getByText('Next'))

        waitFor(async () => {
            const rows = canvas.getAllByRole('article');
            await expect(rows).toHaveLength(5);
        })
    }
}

export const FilteredSearch: Story = {
    render: () => {
        return (
            <StatefulWrapper />
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows how items filter base on search query.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await delay(1000)
        userEvent.type(canvas.getByPlaceholderText('Search Items...'), 'Test Product A')
        await delay(1000)
        await waitFor(async () => {
            const rows = canvas.getAllByRole('article');
            await expect(rows).toHaveLength(3);
        })
    }
}

export const ShowExpandedItems: Story = {
    render: () => {
        return (
            <StatefulWrapper />
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows how items are expanded.'
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

export const ShowEditedItem: Story = {
    args: {
        highlightedItem: {
            id: 3,
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
        const rows = canvas.getAllByRole('article');
        const divs = rows[2].querySelectorAll('div');
        await expect(canvas.getByText('Test Product C')).toBeInTheDocument();
        await expect(divs[0]).toHaveClass('bg-amber-50/30 border-l-6 border-amber-400')
    }
}

export const ShowAssignedItem: Story = {
    args: {
        highlightedItem: {
            id: 5,
            type: 'assigned'
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
        const rows = canvas.getAllByRole('article');
        const divs = rows[4].querySelectorAll('div');
        await expect(canvas.getByText('Out of Stock Item Two')).toBeInTheDocument();
        await expect(divs[0]).toHaveClass('bg-sky-50/30 border-l-6 border-sky-400')
    }
}

export const ShowAddedItem: Story = {
    args: {
        highlightedItem: {
            id: 4,
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
        const divs = rows[3].querySelectorAll('div');
        await expect(canvas.getByText('Test Product D')).toBeInTheDocument();
        await expect(divs[0]).toHaveClass('bg-emerald-50/30 border-l-6 border-emerald-400')
    }
}



