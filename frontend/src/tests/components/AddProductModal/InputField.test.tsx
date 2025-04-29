import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";
import { InputField } from '@/components/AddProductModal/InputField';

describe('InputField', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    test('renders text input by default', () => {
        render(<InputField label="Product Name" value="" onChange={mockOnChange} />);

        expect(screen.getByText('Product Name')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    test('renders required indicator when required', () => {
        render(<InputField label="Product Name" value="" onChange={mockOnChange} required />);
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    test('renders textarea when type is textarea', () => {
        render(<InputField label="Product Note" value="" onChange={mockOnChange} type="textarea" />);
        expect(screen.getByRole('textbox')).toHaveClass('h-[76px]');
    });

    test('handles text input changes', async () => {
        render(<InputField label="Product Name" value="" onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'Test value');

        expect(mockOnChange).toHaveBeenCalledTimes(10);
        expect(mockOnChange).toHaveBeenLastCalledWith('e');
    });

    test('handles textarea changes', async () => {
        render(<InputField label="Product Note" value="" onChange={mockOnChange} type="textarea" />);

        const textarea = screen.getByRole('textbox');
        await userEvent.type(textarea, 'Multi\nline\ntext');

        expect(mockOnChange).toHaveBeenCalledTimes(15);
    });

    test('displays error message and style when error exists', () => {
        render(<InputField label="Product Name" value="" onChange={mockOnChange} error="Test error" />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-red-500');
        expect(screen.getByText('Product Name')).toBeInTheDocument();
    });

    test('disables interaction when disabled prop is true', async () => {
        render(<InputField label="Product Name" value="" onChange={mockOnChange} disabled />);

        const input = screen.getByRole('textbox') as HTMLInputElement;
        await userEvent.type(input, ' attempt to change');

        expect(input).toBeDisabled();
        expect(input.value).toBe('');
        expect(mockOnChange).not.toHaveBeenCalled();
    });

    test('displays placeholder text', () => {
        render(
            <InputField
                label="Product Name"
                value=""
                onChange={mockOnChange}
                placeholder="Enter Product Name"
            />
        );

        expect(screen.getByPlaceholderText('Enter Product Name')).toBeInTheDocument();
    });

    test('textarea has no resize handle', () => {
        render(<InputField label="Test Label" value="" onChange={mockOnChange} type="textarea" />);

        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveStyle('resize: none');
    });

});