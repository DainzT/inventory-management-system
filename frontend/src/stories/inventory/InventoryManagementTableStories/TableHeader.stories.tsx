import { Meta, StoryObj } from "@storybook/react";
import { TableHeader } from "@/components/inventory/InventoryManagementTable/TableHeader";
import { within, expect } from "@storybook/test";

const meta: Meta<typeof TableHeader> = {
    title: "inventory/InventoryManagementTable/TableHeader",
    component: TableHeader,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A component that displays item properties.',
            },
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof TableHeader>;

export default meta;
type Story = StoryObj<typeof TableHeader>

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default state of table header.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByText('ID')).toBeInTheDocument();
        await expect(canvas.getByText('Product Name')).toBeInTheDocument();
        await expect(canvas.getByText('Note')).toBeInTheDocument();
        await expect(canvas.getByText('Quantity')).toBeInTheDocument();
        await expect(canvas.getByText('Unit Price')).toBeInTheDocument();
        await expect(canvas.getByText('Actions')).toBeInTheDocument();
    }
}