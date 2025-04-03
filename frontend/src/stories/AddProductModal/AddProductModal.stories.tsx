import { Meta, StoryObj } from "@storybook/react";
import { fn, expect, userEvent, within, waitFor } from "@storybook/test";
import AddProductModal from "@/components/AddProductModal/AddProductModal";
import { action } from "@storybook/addon-actions";
import { fireEvent } from "@testing-library/react";
import { useState } from "react";

const meta: Meta<typeof AddProductModal> = {
    title: "Add Product Modal/AddProductModal",
    component: AddProductModal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        isOpen: {
            control: 'boolean',
            defaultValue: true,
        },
        setIsOpen: {
            action: 'setIsOpen',
        },
        onAddItem: {
            action: 'onAddItem',
        }
    },
    args: {
        isOpen: false,
        setIsOpen: fn(),
        onAddItem: fn(),
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
} satisfies Meta<typeof AddProductModal>;


export default meta;
type Story = StoryObj<typeof AddProductModal>

const StatefulWrapper = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const handleAddItem = () => {
        console.log("Add item clicked with empty data");
    };

    return (
        <AddProductModal
            onAddItem={handleAddItem}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        />
    );
};

export const Default: Story = {
    args: {
        isOpen: true,
        setIsOpen: action('setIsOpen'),
        onAddItem: action('Item Added'),
    },
};

export const OpenModal: Story = {
    args: {
        isOpen: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await waitFor(async () => {
            const addProductElements = canvas.queryAllByText(/add product/i);
            expect(addProductElements).toHaveLength(2);

            const heading = canvas.getByRole('heading', {
                name: /add product/i,
                level: 1
            });

            expect(heading).toBeVisible();

            const button = canvas.getByRole('button', {
                name: /add product/i
            });

            expect(button).toBeVisible();
            expect(button).toBeEnabled();

            const productName = canvas.queryByText(/product name/i);
            const note = canvas.queryByText(/note/i);
            const quantity = canvas.queryByText(/quantity/i);
            const selectUnit = canvas.queryByText(/select unit/i);
            const pricePerUnit = canvas.queryByText(/price per unit/i);
            const total = canvas.queryByText(/total/i);

            expect(productName).toBeInTheDocument();
            expect(note).toBeInTheDocument();
            expect(quantity).toBeInTheDocument();
            expect(selectUnit).toBeInTheDocument();
            expect(pricePerUnit).toBeInTheDocument();
            expect(total).toBeInTheDocument();
        });

    },
};

export const CloseModal: Story = {
    render: () => {
        return (
            <StatefulWrapper />
        );
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        await waitFor(async () => {
            await userEvent.hover(canvas.getByLabelText('Close dialog'));
            await delay(500)
            await userEvent.click(canvas.getByLabelText('Close dialog'));
            expect(args.isOpen).toBeFalsy();
        });

        await waitFor(() => {
            const addProductElements = canvas.queryAllByText(/add product/i);
            expect(addProductElements).toHaveLength(0);

            expect(canvas.queryByRole('heading', {
                name: /add product/i,
                level: 1
            })).toBeNull();

            expect(canvas.queryByRole('button', {
                name: /add product/i
            })).toBeNull();

            const productName = canvas.queryByText(/product name/i);
            const note = canvas.queryByText(/note/i);
            const quantity = canvas.queryByText(/quantity/i);
            const selectUnit = canvas.queryByText(/select unit/i);
            const pricePerUnit = canvas.queryByText(/price per unit/i);
            const total = canvas.queryByText(/total/i);

            expect(productName).not.toBeInTheDocument();
            expect(note).not.toBeInTheDocument();
            expect(quantity).not.toBeInTheDocument();
            expect(selectUnit).not.toBeInTheDocument();
            expect(pricePerUnit).not.toBeInTheDocument();
            expect(total).not.toBeInTheDocument();
        });
    },
};

export const EmptyForm: Story = {
    args: {
        isOpen: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await waitFor(() => {
            const inputTextConfigs = [
                {
                    label: /product name/i,
                    role: 'textbox',
                    placeholder: 'Enter product name',
                    expectedValue: '',
                },
                {
                    label: /note/i,
                    role: 'textbox',
                    placeholder: 'Enter note',
                    expectedValue: '',
                },
                {
                    label: /select unit/i,
                    role: 'select',
                    isCustomSelect: true,
                    placeholder: 'Unit',
                    expectedValue: 'Unit',
                },
            ];

            const inputNumberConfigs = [
                {
                    label: /quantity/i,
                    role: 'spinbutton',
                    placeholder: '0.00',
                    expectedValue: null,
                },
                {
                    label: /price per unit/i,
                    role: 'spinbutton',
                    placeholder: '0.00',
                    expectedValue: null,
                },
                {
                    label: /price per unit/i,
                    role: 'spinbutton',
                    required: true,
                    placeholder: '0.00',
                    expectedValue: null,
                },
                {
                    label: /total/i,
                    role: 'spinbutton',
                    placeholder: '0.00',
                    expectedValue: null,
                },
            ];

            inputTextConfigs.forEach(config => {
                const label = canvas.getByText(config.label);
                expect(label).toBeInTheDocument();

                if (config.isCustomSelect) {
                    const div = label.closest('div') as HTMLDivElement;
                    const unitSpan = within(div).getByText('Unit');
                    expect(unitSpan).toHaveTextContent('Unit');
                } else {
                    const inputs = canvas.getAllByRole(config.role)
                    const matchingInput = inputs.find(input =>
                        input.getAttribute('placeholder') === config.placeholder
                    );

                    expect(matchingInput).toBeInTheDocument();
                    expect(matchingInput).toHaveAttribute('placeholder', config.placeholder);
                    expect(matchingInput).toHaveValue(config.expectedValue);
                }
            });

            inputNumberConfigs.forEach((config, index) => {
                const label = canvas.getByText(config.label);
                expect(label).toBeInTheDocument();

                const spinButton = canvas.getAllByRole('spinbutton')[index];
                expect(spinButton).toHaveAttribute('placeholder', config.placeholder);
                expect(spinButton).toHaveValue(config.expectedValue);
            })

        });
    },
};

export const FilledForm: Story = {
    args: {
        isOpen: true,
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
        await waitFor(async () => {
            for (const [index, config] of inputTextConfigs.entries()) {
                const input = canvas.getAllByRole(config.role)[index];
                await userEvent.type(input, config.value);
                expect(input).toHaveValue(config.value);
            }
        })
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

            await userEvent.hover(within(div).getByText('Piece'));
            await userEvent.hover(within(div).getByText('Box'));
            await userEvent.hover(within(div).getByText('Bundle'));
            await userEvent.click(within(div).getByText('Meter'));
        })
    }
};

export const DiscardConfirmationModal: Story = {
    args: {
        isOpen: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const inputTextConfigs = [
            {
                role: 'textbox',
                value: 'Net',
            },
            {
                role: 'textbox',
                value: '10 meter wide',
            },
        ];
        await waitFor(async () => {
            for (const [index, config] of inputTextConfigs.entries()) {
                const input = canvas.getAllByRole(config.role)[index];
                await userEvent.type(input, config.value);
                expect(input).toHaveValue(config.value);
            }
        })

        await waitFor(async () => {
            await userEvent.click(canvas.getByLabelText('Close dialog'));
            expect(canvas.getByText('Discard Changes')).toBeInTheDocument();
            expect(canvas.getByText('Cancel')).toBeInTheDocument();
        })
    }
};

export const DiscardCancelConfirmation: Story = {
    args: {
        isOpen: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const inputTextConfigs = [
            {
                role: 'textbox',
                value: 'Net',
            },
            {
                role: 'textbox',
                value: '10 meter wide',
            },
        ];
        await waitFor(async () => {
            for (const [index, config] of inputTextConfigs.entries()) {
                const input = canvas.getAllByRole(config.role)[index];
                await userEvent.type(input, config.value);
                expect(input).toHaveValue(config.value);
            }
        })

        await waitFor(async () => {
            await userEvent.click(canvas.getByLabelText('Close dialog'));
        });

        await waitFor(async () => {
            expect(canvas.getByText('Cancel')).toBeInTheDocument();
            await userEvent.hover(canvas.getByText('Cancel'));
            await delay(500);
            await userEvent.click(canvas.getByText('Cancel'));
        });
    }
};

export const DiscardChangesConfirmation: Story = {
    render: () => {
        return (
            <StatefulWrapper />
        );
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const inputTextConfigs = [
            {
                role: 'textbox',
                value: 'Net',
            },
            {
                role: 'textbox',
                value: '10 meter wide',
            },
        ];
        await waitFor(async () => {
            for (const [index, config] of inputTextConfigs.entries()) {
                const input = canvas.getAllByRole(config.role)[index];
                await userEvent.clear(input);
                await userEvent.type(input, config.value);
                expect(input).toHaveValue(config.value);
            }
        })

        await waitFor(async () => {
            await userEvent.click(canvas.getByLabelText('Close dialog'));
        });

        await waitFor(async () => {
            expect(canvas.getByText('Discard Changes')).toBeInTheDocument();
            await userEvent.hover(canvas.getByText('Discard Changes'));
            await delay(500);
            await userEvent.click(canvas.getByText('Discard Changes'));
            expect(args.isOpen).toBeFalsy();
        });

    }
};

export const SubmitWithEmptyForm: Story = {
    args: {
        isOpen: true,
    },
    play: async({ canvasElement }) => {
        const canvas = within(canvasElement)
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        await waitFor( async() => {
            const button = canvas.getByRole('button', {
                name: /add product/i
            });

            expect(button).toBeVisible();
            expect(button).toBeEnabled();
            await delay(1000)
            await userEvent.click(button)
        });
    }
};

export const SubmitIncompleteForm: Story = {
    args: {
        isOpen: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const inputTextConfigs = [
            {
                role: 'textbox',
                value: 'Net',
            },
            {
                role: 'textbox',
                value: '10 meter wide',
            },
        ];

        await waitFor(async () => {
            for (const [index, config] of inputTextConfigs.entries()) {
                const input = canvas.getAllByRole(config.role)[index];
                await userEvent.clear(input);
                await userEvent.type(input, config.value);
                expect(input).toHaveValue(config.value);
            }
        })

        const inputNumberConfigs = [
            {
                role: 'spinbutton',
                value: '0',
            },
            {
                role: 'spinbutton',
                value: "500",
            },
        ];

        await waitFor(async () => {
            for (const [index, config] of inputNumberConfigs.entries()) {
                const input = canvas.getAllByRole(config.role)[index];
                if (config.value === "0.00") {
                    fireEvent.change(input);
                    await waitFor(() => expect(input).toHaveValue(Number(config.value)));
                } else {
                    await userEvent.type(input, config.value);
                    await waitFor(() => expect(input).toHaveValue(Number(config.value)));
                }
            }
        })

        await waitFor(async () => {
            const button = canvas.getByRole('button', {
                name: /add product/i
            });

            expect(button).toBeVisible();
            expect(button).toBeEnabled();
            await delay(500)
            await userEvent.click(button)
        })

        await waitFor(async () => {
            const errorMessage =  [
                'Please select a unit', 
                'Enter a valid quantity',
                'Enter a valid unit size'
            ]
            errorMessage.forEach(async (error) => {
                const errorMessage = await canvas.findByText(
                    (content) => content.includes(error),
                );
                expect(errorMessage).toBeInTheDocument();
            })
        })
    }
};

export const SubmitCompleteForm: Story = {
    args: {
        isOpen: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        
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
        await waitFor(async () => {
            for (const [index, config] of inputTextConfigs.entries()) {
                const input = canvas.getAllByRole(config.role)[index];
                await userEvent.type(input, config.value);
                expect(input).toHaveValue(config.value);
            }
        })
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

            await userEvent.hover(within(div).getByText('Piece'));
            await userEvent.hover(within(div).getByText('Box'));
            await userEvent.hover(within(div).getByText('Bundle'));
            await userEvent.click(within(div).getByText('Meter'));
        })

        await waitFor(async () => {
            const button = canvas.getByRole('button', {
                name: /add product/i
            });

            expect(button).toBeVisible();
            expect(button).toBeEnabled();
            await delay(500)
            await userEvent.click(button)
        })
    }
};


