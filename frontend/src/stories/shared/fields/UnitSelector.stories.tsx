import { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, waitFor, expect } from "@storybook/test";
import { UnitSelector } from "@/components/shared/fields/UnitSelector";
import { useState } from "react";

const meta: Meta<typeof UnitSelector> = {
    title: "shared/fields/UnitSelector",
    component: UnitSelector,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A flexible select component with validation and unit selections',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'text',
            description: 'Current selected unit value',
            table: {
                type: { summary: 'string' },
                category: 'Value',
            }
        },
        onChange: {
            action: 'onChange',
            description: 'Callback when unit changes',
            table: {
                type: { summary: '(value: string) => void' },
                category: 'Events',
            }
        },
        error: {
            control: 'text',
            description: 'Error message to display',
            table: {
                type: { summary: 'string' },
                category: 'Validation',
            }
        },
        disabled: {
            control: 'boolean',
            description: 'Disables all interactions',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
                category: 'State',
            }
        }
    },
    args: {
        value: "",
        onChange: fn(),
        error: undefined,
        disabled: false
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof UnitSelector>;


export default meta;
type Story = StoryObj<typeof UnitSelector>

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export const Default: Story = {
    args: {
        value: '',
    },
    parameters: {
        docs: {
            description: {
                story: 'Default state of the unit selector with no value selected.',
            },
        },
    },
};

const InteractiveUnitSelector = () => {
    const [value, setValue] = useState('');
    return <UnitSelector value={value} onChange={setValue} />;
};

export const WithPresetSelected: Story = {
    render: () => <InteractiveUnitSelector />,
    parameters: {
        docs: {
            description: {
                story: 'Unit selector with a preset unit ("Piece") already selected.',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const div = canvas.getByText('Unit').closest('div') as HTMLDivElement
        await delay(500)
        userEvent.click(div)

        await waitFor(async () => {
            await delay(500)
            const preset = canvas.getByText('Pack')
            expect(preset).toBeInTheDocument();
            userEvent.click(preset)
        })

        await waitFor(() => {
            expect(canvas.getByText('Pack')).toBeInTheDocument();
            expect(canvas.queryByText('Unit')).toBeNull();
            expect(canvas.queryByText('Pack')).toBeInTheDocument();
        });
    }
};

export const WithValidation: Story = {
    args: {
        value: '',
        error: 'Please select a unit'
    },
    parameters: {
        docs: {
            description: {
                story: 'Unit selector showing an error state with validation message.',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        expect(canvas.getByText('Please select a unit')).toBeInTheDocument();

    }
};

export const DisabledState: Story = {
    args: {
        value: 'Box',
        disabled: true
    },
    parameters: {
        docs: {
            description: {
                story: 'Disabled state of the unit selector with a pre-selected value that cannot be changed.',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const { getByText, queryByText, queryByPlaceholderText } = within(canvasElement);

        const trigger = getByText('Box');
        expect(trigger).toBeInTheDocument();
        await userEvent.click(trigger);

        await waitFor(() => {
            expect(queryByPlaceholderText('Search units')).toBeNull();
            expect(queryByText('Piece')).toBeNull();
        });
    }
};


export const SearchUnit: Story = {
    render: () => <InteractiveUnitSelector />,
    parameters: {
        docs: {
            description: {
                story: 'Filter search by inputting match letters of desired unit.',
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const div = canvas.getByText('Unit').closest('div') as HTMLDivElement
        await delay(500)
        userEvent.click(div)

        await waitFor(async () => {
            const search = canvas.getByPlaceholderText('Search units')
            await delay(500)
            userEvent.type(search, 'Meter')
        })

        await waitFor(async () => {
            await delay(500)
            const unit = canvas.getByText('Meter')
            userEvent.click(unit)
        })

        await delay(500)
        const meterOption = await canvas.findByText('Meter');
        expect(meterOption).toBeInTheDocument();
    }
}

export const CustomUnit: Story = {
    render: () => <InteractiveUnitSelector />,
    parameters: {
        docs: {
            description: {
                story: "Add custom unit if no other unit's are available.",
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const div = canvas.getByText('Unit').closest('div') as HTMLDivElement
        await delay(500)
        userEvent.click(div)

        await waitFor(async () => {
            const custom = canvas.getByPlaceholderText('Custom unit')
            await delay(500)
            userEvent.type(custom, 'Liter')
        })

        await waitFor(async () => {
            await delay(500)
            const add = canvas.getByRole('button')
            userEvent.click(add)
        })

        await delay(500)
        const literOption = await canvas.findByText('Liter');
        expect(literOption).toBeInTheDocument();
    }
}