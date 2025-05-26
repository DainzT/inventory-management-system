import { Meta, StoryObj } from "@storybook/react";
import { within, expect } from "@storybook/test";
import { ExpandedItemDetails } from "@/components/inventory/InventoryManagementTable/ExpandedItemDetails";
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

const meta: Meta<typeof ExpandedItemDetails> = {
    title: "inventory/InventoryManagementTable/ExpandedItemDetails",
    component: ExpandedItemDetails,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A component that provide more details about an item',
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
    },
    args: {
        item: sampleProduct,
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof ExpandedItemDetails>;

export default meta;
type Story = StoryObj<typeof ExpandedItemDetails>

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default state of the Expanded Details.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        expect(canvas.getByText('Total Value')).toBeInTheDocument();
        expect(canvas.getByText('Date Created')).toBeInTheDocument();
        expect(canvas.getByText('Last Updated')).toBeInTheDocument();
        expect(canvas.getByText('No date available')).toBeInTheDocument();
        expect(canvas.getByText(/1000.00/i)).toBeInTheDocument();
        expect(canvas.getByText(`${new Date().toLocaleDateString()}`)).toBeInTheDocument();
    }
}


export const ExtraDetails: Story = {
    args: {
        item: sampleProduct,
        extraDetails: [
            {
                label: 'Boat',
                value: 'Donya Donya'
            },
            {
                label: 'Fleet',
                value: 'Donya Librada'
            }
        ]
    },
    parameters: {
        docs: {
            description: {
                story: 'Add more custom details.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        expect(canvas.getByText('Donya Donya')).toBeInTheDocument();
        expect(canvas.getByText('Boat')).toBeInTheDocument();
        expect(canvas.getByText('Fleet')).toBeInTheDocument();
        expect(canvas.getByText('Donya Librada')).toBeInTheDocument();
    }
}

export const withUpdatedDetails: Story = {
    args: {
        item: {
            ...sampleProduct,
            lastUpdated: new Date(),
            total: 0
        }
    },
    parameters: {
        docs: {
            description: {
                story: 'When the item has been updated.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        expect(canvas.queryByText('No date available')).not.toBeInTheDocument();
        expect(canvas.getByText(/0.00/i)).toBeInTheDocument();
        expect(canvas.getAllByText(`${new Date().toLocaleDateString()}`)[1]).toBeInTheDocument();
    }
}