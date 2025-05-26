import { Meta, StoryObj } from "@storybook/react";
import { ChevronIcon } from "../../../components/shared/table/ChevronIcon";

const meta: Meta<typeof ChevronIcon> = {
    title: "shared/table/ChevronIcon",
    component: ChevronIcon,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A component that flips state when item expands',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        isExpanded: {
            control: 'boolean',
            defaultValue: true,
            description: 'Called when chevron icon points up or down',
            table: {
                category: 'State',
            }
        },
    },
    args: {
        isExpanded: false,
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof ChevronIcon>;

export default meta;
type Story = StoryObj<typeof ChevronIcon>

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default look of the component.'
            },
        },
    },
}

export const WhenExpanded: Story = {
    args: {
        isExpanded: true
    },
    parameters: {
        docs: {
            description: {
                story: 'When chevron icon is in expanded state.'
            },
        },
    },
}