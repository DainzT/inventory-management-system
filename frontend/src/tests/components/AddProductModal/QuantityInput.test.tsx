import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";
import { QuantityInput } from '@/components/AddProductModal/QuantityInput';

describe('QuantityInput', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    test('renders with default props', () => {
        render(<QuantityInput value="" onChange={mockOnChange} />);

        expect(screen.getByText('Quantity')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
        expect(screen.queryByText('*')).not.toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    test('shows required asterisk when required', () => {
        render(<QuantityInput value="" onChange={mockOnChange} required />);
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    test('displays error message and styling when error exists', () => {
        render(<QuantityInput value="" onChange={mockOnChange} error="Enter a valid quantity" />);

        const errorMessage = screen.getByText('Enter a valid quantity');
        const input = screen.getByPlaceholderText('0.00');
        const buttons = screen.getAllByRole('button');

        expect(errorMessage).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        buttons.forEach(button => {
            expect(button).toHaveClass('border-red-500');
        });
    });

    test('handles increment correctly', async () => {
        render(<QuantityInput value={5} onChange={mockOnChange} />);

        const incrementButton = screen.getAllByRole('button')[1];
        await userEvent.click(incrementButton);

        expect(mockOnChange).toHaveBeenCalledWith(6);
    });

    test('handles decrement correctly when value > 1', async () => {
        render(<QuantityInput value={5} onChange={mockOnChange} />);

        const decrementButton = screen.getAllByRole('button')[0];
        await userEvent.click(decrementButton);

        expect(mockOnChange).toHaveBeenCalledWith(4);
    });

    test('does not decrement below 1', async () => {
        render(<QuantityInput value={1} onChange={mockOnChange} />);

        const decrementButton = screen.getAllByRole('button')[0];
        await userEvent.click(decrementButton);

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    test('handles empty input correctly', async () => {
        render(<QuantityInput value={5} onChange={mockOnChange} />);

        const input = screen.getByPlaceholderText('0.00');
        await userEvent.clear(input);

        expect(mockOnChange).toHaveBeenCalledWith("");
    });

    test('handles valid numeric input correctly', async () => {
        render(<QuantityInput value="" onChange={mockOnChange} />);

        const input = screen.getByPlaceholderText('0.00');
        fireEvent.change(input, { target: { value: '12.34' } });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith(12.34);
    });

    test('rejects invalid numeric input', async () => {
        render(<QuantityInput value="" onChange={mockOnChange} />);

        const input = screen.getByPlaceholderText('0.00');
        await userEvent.type(input, 'abc');

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    test('disables interaction when disabled prop is true', async () => {
        render(<QuantityInput value={5} onChange={mockOnChange} disabled />);

        const input = screen.getByPlaceholderText('0.00');
        const buttons = screen.getAllByRole('button');

        expect(input).toBeDisabled();
        buttons.forEach(button => {
            expect(button).toBeDisabled();
        });

        await userEvent.click(buttons[1]);
        expect(mockOnChange).not.toHaveBeenCalled();
    });

    test('rounds displayed value to 2 decimal places', () => {
        render(<QuantityInput value={5.6789} onChange={mockOnChange} />);

        const input = screen.getByPlaceholderText('0.00') as HTMLInputElement;
        expect(input.value).toBe('5.68');
    });
});