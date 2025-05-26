import { Meta, StoryObj } from "@storybook/react";
import InventoryManagementTableSkeleton from "@/components/inventory/InventoryManagementTable/InventoryManagementTableSkeleton";

const meta: Meta<typeof InventoryManagementTableSkeleton> = {
    title: "inventory/InventoryManagementTable/InventoryManagementTableSkeleton",
    component: InventoryManagementTableSkeleton,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Initial component when rendering data in inventory page',
            },
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof InventoryManagementTableSkeleton>;


export default meta;
type Story = StoryObj<typeof InventoryManagementTableSkeleton>

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The only state of the skeleton loading component.'
            },
        },
    },
}
