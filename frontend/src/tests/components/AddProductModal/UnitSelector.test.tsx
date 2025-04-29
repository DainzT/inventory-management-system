import { render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";
import { UnitSelector } from '@/components/AddProductModal/UnitSelector';


describe('UnitSelector', () => {
    const mockOnChange = jest.fn()
    const presetUnits = [
        "Piece", "Box", "Pack", "Dozen", "Case",
        "Bundle", "Set", "Kit", "Roll", "Meter",
    ];

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    test('renders with default props', () => {
        render(<UnitSelector value="" onChange={mockOnChange} />);

        expect(screen.getByText('Select Unit')).toBeInTheDocument();
        expect(screen.getByText('*')).toBeInTheDocument();
        expect(screen.getByText('Unit')).toBeInTheDocument();
    })

    test('renders with initial value', () => {
        render(<UnitSelector value="Box" onChange={mockOnChange} />);

        expect(screen.getByText('Select Unit')).toBeInTheDocument();
        expect(screen.getByText('*')).toBeInTheDocument();
        expect(screen.getByText('Box')).toBeInTheDocument();

    });

    test('toggles dropdown when clicked', async () => {
        render(<UnitSelector value="" onChange={mockOnChange} />);
        const trigger = screen.getByText('Unit').parentElement!;

        await userEvent.click(trigger);
        expect(screen.getByPlaceholderText('Search units')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Custom unit')).toBeInTheDocument();
        presetUnits.forEach(unit => {
            expect(screen.getByText(unit)).toBeInTheDocument();
        });

        await userEvent.click(trigger);
        expect(screen.queryByPlaceholderText('Search units')).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText('Custom unit')).not.toBeInTheDocument();
        presetUnits.forEach(unit => {
            expect(screen.queryByText(unit)).not.toBeInTheDocument();
        });
    })

    test('selects preset unit and closes dropdown', async () => {
        render(<UnitSelector value="" onChange={mockOnChange} />);
        const trigger = screen.getByText('Unit').parentElement!;

        await userEvent.click(trigger);
        await userEvent.click(screen.getByText('Pack'));

        expect(mockOnChange).toHaveBeenCalledWith('Pack');
        expect(screen.queryByPlaceholderText('Search units')).not.toBeInTheDocument();
    });

    test('filters unit based on search input', async () => {
        render(<UnitSelector value="" onChange={mockOnChange} />);
        const trigger = screen.getByText('Unit').parentElement!;

        await userEvent.click(trigger);
        const searchInput = screen.getByPlaceholderText('Search units');
        await userEvent.type(searchInput, 'pa');

        expect(screen.getByText('Pack')).toBeInTheDocument();
        expect(screen.queryByText('Box')).not.toBeInTheDocument();
    });


    test('adds custom unit based when valid input is provided', async () => {
        render(<UnitSelector value="" onChange={mockOnChange} />);
        const trigger = screen.getByText('Unit').parentElement!;

        await userEvent.click(trigger);
        const customInput = screen.getByPlaceholderText('Custom unit');
        const addButton = screen.getByText('Add');

        await userEvent.type(customInput, 'Liter');
        await userEvent.click(addButton);

        expect(mockOnChange).toHaveBeenCalledWith('Liter');
        expect(screen.queryByPlaceholderText('Search units')).not.toBeInTheDocument();
    });

    test('displays error message and style when error exists', () => {
        render(<UnitSelector value="" onChange={mockOnChange} error="Please select a unit" />);

        const trigger = screen.getByText('Unit').parentElement!;
        expect(trigger).toHaveClass('border-red-500');
        expect(screen.getByText('Please select a unit')).toBeInTheDocument();
    });


    test('closes dropdown when clicking outside', async () => {
        render(
            <div>
                <UnitSelector value="" onChange={mockOnChange} />
                <div data-testid="outside-element">Outside</div>
            </div>
        );

        await userEvent.click(screen.getByText('Unit').parentElement!);
        expect(screen.getByPlaceholderText('Search units')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Custom unit')).toBeInTheDocument();
        presetUnits.forEach(unit => {
            expect(screen.getByText(unit)).toBeInTheDocument();
        });

        await userEvent.click(screen.getByTestId('outside-element'));
        expect(screen.queryByPlaceholderText('Search units')).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText('Custom unit')).not.toBeInTheDocument();
        presetUnits.forEach(unit => {
            expect(screen.queryByText(unit)).not.toBeInTheDocument();
        });
    });

    test('does not add custom unit when input is empty', async () => {
        render(<UnitSelector value="" onChange={mockOnChange} />);
        const trigger = screen.getByText('Unit').parentElement!;

        await userEvent.click(trigger);
        const addButton = screen.getByText('Add');

        await userEvent.click(addButton);

        expect(mockOnChange).not.toHaveBeenCalled();
        expect(screen.getByPlaceholderText('Search units')).toBeInTheDocument();
    });


    test('disables interaction when disabled prop is true', async () => {
        render(<UnitSelector value="" onChange={mockOnChange} disabled={true} />);
        const trigger = screen.getByText('Unit').parentElement!;

        await userEvent.click(trigger);
        expect(screen.queryByPlaceholderText('Search units')).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText('Custom unit')).not.toBeInTheDocument();
        presetUnits.forEach(unit => {
            expect(screen.queryByText(unit)).not.toBeInTheDocument();
        });
    });
});
