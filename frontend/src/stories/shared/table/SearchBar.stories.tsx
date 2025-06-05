import { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import { SearchBar } from "@/components/shared/table/SearchBar";

const meta: Meta<typeof SearchBar> = {
    title: "shared/table/SearhBar",
    component: SearchBar,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A component that handles filtered searches',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        placeholder: {
            control: { type: 'text' },
            description: 'For storing description',
            table: {
                type: { summary: 'string' },
                category: 'Styling',
            },
        },
        onSearch: {
            action: 'onSearch',
            description: 'When passing search value',
            table: {
                type: { summary: '(query: string) => void' },
                category: 'Events',
            },
        },
    },
    args: {
        placeholder: 'Search Items...',
        onSearch: fn(),
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof SearchBar>

export const Default: Story = {
    args: {
    },
    parameters: {
        docs: {
            description: {
                story: 'The default look of the component.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.getByPlaceholderText('Search Items...')).toBeInTheDocument();
    }
};

export const EmptyPlaceholder: Story = {
    args: {
        placeholder: "",
    },
    parameters: {
        docs: {
            description: {
                story: 'Empty placeholder for search bar.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.queryByText('Search Items...')).not.toBeInTheDocument();
    }
};


export const CustomPlaceholder: Story = {
    args: {
        placeholder: "This is a custom...",
    },
    parameters: {
        docs: {
            description: {
                story: 'Custom placeholder for search bar.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.queryByText('This is a custom...')).not.toBeInTheDocument();
    }
};

export const InteractiveExample: Story = {
    args: {
    },
    parameters: {
        docs: {
            description: {
                story: 'An interactive example of how the search bar component functions.'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByPlaceholderText('Search Items...')).toBeInTheDocument();
        await userEvent.type(canvas.getByPlaceholderText('Search Items...'), 'Puruna');
        await expect(canvas.getByPlaceholderText('Puruna')).toBeInTheDocument();
    }
};