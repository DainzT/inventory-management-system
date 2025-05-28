import { Meta, StoryObj } from "@storybook/react";
import { fn, expect, userEvent, within, waitFor } from "@storybook/test";
import AddProductForm from "@/components/inventory/modals/AddProductModal/AddProductForm";
import { fireEvent } from "@testing-library/react";

const meta: Meta<typeof AddProductForm> = {
    title: "inventory/modals/AddProductModal/AddProductForm",
    component: AddProductForm,
    parameters: {
        layout: 'centered',
        description: {
            component: 'The Add Product Form Component that handles inputs and form submission',
        },
    },
    tags: ['autodocs'],
    argTypes: {
        onSubmit: {
            action: 'onSubmit',
            description: 'Callback when form is submitted with valid data',
            table: {
                category: 'Events',
            }
        },
        onFormChange: {
            action: 'onFormChange',
            description: 'Triggered when form dirty state changes',
            table: {
                category: 'Events',
            }
        },
        isAdding: {
            control: 'boolean',
            defaultValue: false,
            description: 'Controls loading state during submission',
            table: {
                category: 'State',
            }
        }
    },
    args: {
        onSubmit: fn(),
        onFormChange: fn(),
        isAdding: false
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof AddProductForm>;


export default meta;
type Story = StoryObj<typeof AddProductForm>

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const EmptyState: Story = {
    args: {
        isAdding: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'How it looks when it is empty'
            },
        },
    },
}

export const WithProcessingState: Story = {
    args: {
        isAdding: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'An ininite spinner that appears only when a form has been process'
            },
        },
    },
}

export const WithValidationErrors: Story = {
    args: {
        isAdding: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'When a form is submitted but contains unfilled values'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await userEvent.click(canvas.getByRole('button', { name: /add product/i }));

        await expect(canvas.getByText('Product name is required.')).toBeInTheDocument();
        await expect(canvas.getByText('Note is required.')).toBeInTheDocument();
        await expect(canvas.getByText('Enter a valid quantity.')).toBeInTheDocument();
        await expect(canvas.getByText('Enter a valid price.')).toBeInTheDocument();
        await expect(canvas.getByText('Please select a unit.')).toBeInTheDocument();
        await expect(canvas.getByText('Enter a valid unit size.')).toBeInTheDocument();

    }
}

export const WithUnitSelection: Story = {
    args: {
        isAdding: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'A display of how units are interacted'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const selectUnit = {
            text: 'Select Unit',
            placeholder: 'Unit',
            expectedValue: 'Unit',
        }

        const label = canvas.getByText(selectUnit.text);
        const div = label.closest('div') as HTMLDivElement;

        await waitFor(async () => {
            const selectDiv = within(div).getByText('Unit').closest('div') as HTMLDivElement;
            await userEvent.click(selectDiv);
            await delay(500)
        })

        await waitFor(async () => {
            const searchInput = within(div)
                .queryAllByRole('textbox')
                .find((input) => {
                    const placeholder = input.getAttribute('placeholder');
                    return placeholder === 'Search units';
                }) as HTMLInputElement;

            await delay(500)
            await userEvent.type(searchInput, 'Meter')
            await delay(200)
            await userEvent.clear(searchInput);
        })

        const typeInput = within(div)
            .queryAllByRole('textbox')
            .find((input) => {
                const placeholder = input.getAttribute('placeholder');
                return placeholder === 'Custom unit';
            }) as HTMLInputElement;
        await userEvent.type(typeInput, 'Inch')
        expect(typeInput).toHaveValue('Inch');

    }
}

export const WithSuccessfulSubmission: Story = {
    args: {
        isAdding: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'The data is wrap in an object after filling up the form and submitting'
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const inputTextConfigs = [
            {
                role: 'textbox',
                value: 'Fishing Pliers',
            },
            {
                role: 'textbox',
                value: 'Stainless steel with line cutter',
            },
        ];

        for (const [index, config] of inputTextConfigs.entries()) {
            const input = canvas.getAllByRole(config.role)[index];
            await userEvent.type(input, config.value);
            expect(input).toHaveValue(config.value);
        }

        const inputNumberConfigs = [
            {
                role: 'spinbutton',
                value: "10"
            },
            {
                role: 'spinbutton',
                value: "200",
            },
            {
                role: 'spinbutton',
                value: "1",
            },
            {
                role: 'spinbutton',
                value: `${200 * 10}`,
            },
        ];

        await waitFor(async () => {
            for (const [index, config] of inputNumberConfigs.entries()) {
                const input = canvas.getAllByRole(config.role)[index];
                if (config.value === "2000") {
                    fireEvent.change(input);
                    await waitFor(() => expect(input).toHaveValue(Number(config.value)));
                } else {
                    await userEvent.type(input, config.value);
                    await waitFor(() => expect(input).toHaveValue(Number(config.value)));
                }
            }
        })

        const selectUnit = {
            text: 'Select Unit',
            placeholder: 'Unit',
            expectedValue: 'Unit',
        }

        await waitFor(async () => {
            const label = canvas.getByText(selectUnit.text);
            const div = label.closest('div') as HTMLDivElement;
            const selectDiv = within(div).getByText('Unit').closest('div') as HTMLDivElement;
            await userEvent.click(selectDiv);
            await userEvent.click(within(div).getByText('Meter'));
        })

        await waitFor(async () => {
            const button = canvas.getByRole('button', {
                name: /add product/i
            });

            expect(button).toBeVisible();
            expect(button).toBeEnabled();
            await userEvent.click(button)
        })
    }
};


