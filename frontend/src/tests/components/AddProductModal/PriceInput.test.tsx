import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";
import { PriceInput } from '@/components/AddProductModal/PriceInput';

describe('PriceInput', () => {
    const mockOnChange = jest.fn();
    const mockUnitChange = jest.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
        mockUnitChange.mockClear();
    });

    test('renders with default props', () => {
        render(<PriceInput label="Price per Unit" value="" onChange={mockOnChange} />);

        expect(screen.getByText('Price per Unit')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
        expect(screen.getByText('₱')).toBeInTheDocument();
        expect(screen.queryByText('per')).not.toBeInTheDocument();
        expect(screen.queryByText('Unit')).not.toBeInTheDocument();
    });

    test('shows required fields when required', () => {
        render(
            <PriceInput
                label="Price per Unit"
                value={10}
                unitSize={1}
                onChange={mockOnChange}
                unitChange={mockUnitChange}
                required
            />
        );

        expect(screen.getByText('*')).toBeInTheDocument();
        expect(screen.getByText('per')).toBeInTheDocument();
        expect(screen.getByText('Unit')).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText('0.00')).toHaveLength(2);
    });

    test('handles price input changes', async () => {
        render(<PriceInput label="Price per Unit" value={10} onChange={mockOnChange} />);

        const priceInput = screen.getByPlaceholderText('0.00');
        fireEvent.change(priceInput, { target: { value: '15.99' } });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith(15.99);
    });

    test('handles unit size input changes', async () => {
        render(
            <PriceInput
                label="Price per Unit"
                value={10}
                unitSize={1}
                onChange={mockOnChange}
                unitChange={mockUnitChange}
                required
            />
        );

        const unitInputs = screen.getAllByPlaceholderText('0.00');
        await userEvent.clear(unitInputs[1]);
        fireEvent.change(unitInputs[1], { target: { value: '15.99' } });

        expect(mockUnitChange).toHaveBeenLastCalledWith(15.99);
    });

    test('displays error message and style when error exists', () => {
        render(
            <PriceInput
                label="Price per Unit"
                value={10}
                unitSize={1}
                onChange={mockOnChange}
                unitChange={mockUnitChange}
                error={{ unitPrice: 'Invalid price', unitSize: 'Invalid size' }}
                required
            />
        );

        const inputs = screen.getAllByPlaceholderText('0.00');
        expect(inputs[0]).toHaveClass('border-red-500');
        expect(inputs[1]).toHaveClass('border-red-500');
        expect(screen.getByText('Invalid price')).toBeInTheDocument();
        expect(screen.getByText('Invalid size')).toBeInTheDocument();
    });

    test('disables interaction when disabled prop is true', () => {
        render(
            <PriceInput
                label="Price per Unit"
                value={10}
                onChange={mockOnChange}
                disabled
            />
        );

        const input = screen.getByPlaceholderText('0.00') as HTMLInputElement;
        userEvent.type(input, "1")
    
        expect(input).toBeDisabled();
        expect(input).toHaveValue(10);
        expect(mockOnChange).not.toHaveBeenCalled();
    });

    test('renders readonly state correctly', () => {
        render(
            <PriceInput
                label="Price per Unit"
                value={10}
                onChange={mockOnChange}
                readonly
            />
        );

        const input = screen.getByPlaceholderText('0.00');
        expect(input).toHaveClass('cursor-default');
        expect(input).toHaveClass('pointer-events-none');
        expect(input).toHaveAttribute('readOnly');
    });

    test('shows unit label when provided', () => {
        render(
            <PriceInput
                label="Price per Unit"
                value={10}
                unitSize={1}
                onChange={mockOnChange}
                unitChange={mockUnitChange}
                unit="kg"
                required
            />
        );

        expect(screen.getByText('kg')).toBeInTheDocument();
    });

    test('rounds displayed values to 2 decimal places', () => {
        render(
            <PriceInput
                label="Price per Unit"
                value={10.456}
                unitSize={1.789}
                onChange={mockOnChange}
                unitChange={mockUnitChange}
                required
            />
        );

        const inputs = screen.getAllByPlaceholderText('0.00') as HTMLInputElement[];
        expect(inputs[0].value).toBe('10.46');
        expect(inputs[1].value).toBe('1.79');
    });

    test('handles empty values correctly', async () => {
        render(
            <PriceInput
                label="Price per Unit"
                value={10}
                unitSize={1}
                onChange={mockOnChange}
                unitChange={mockUnitChange}
                required
            />
        );

        const priceInput = screen.getAllByPlaceholderText('0.00')[0];
        await userEvent.clear(priceInput);

        expect(mockOnChange).toHaveBeenCalledWith("");
    });
});