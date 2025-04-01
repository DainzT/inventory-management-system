import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AlertTriangle } from 'lucide-react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import '@testing-library/jest-dom';

jest.mock('lucide-react', () => ({
  AlertTriangle: jest.fn((props) => <svg data-testid="alert-triangle" {...props} />),
}));

describe('DeleteConfirmationModal', () => {
  const mockOnConfirm = jest.fn();
  const mockOnClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when modal is open', () => {
    beforeEach(() => {
      render(
        <DeleteConfirmationModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
    });

    it('renders the modal with default content', () => {
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      expect(
        screen.getByText(/This action cannot be undone/i)
      ).toBeInTheDocument();
      expect(screen.getByTestId('confirm-removal-button')).toHaveTextContent(
        'Delete field'
      );
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('calls onConfirm when delete button is clicked', () => {
      fireEvent.click(screen.getByTestId('confirm-removal-button'));
      expect(mockOnConfirm).toHaveBeenCalled();
    });

    it('calls onClose when cancel button is clicked', () => {
      fireEvent.click(screen.getByText('Cancel'));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('displays the warning icon with correct styling', () => {
      expect(AlertTriangle).toHaveBeenCalledWith(
        expect.objectContaining({
          className: 'text-red-500 h-6 w-6',
        }),
        expect.anything()
      );

      const icon = screen.getByTestId('alert-triangle');
      const iconContainer = icon.parentElement;
      expect(iconContainer).toHaveClass('bg-red-100');
      expect(iconContainer).toHaveClass('rounded-full');
    });
  });

  describe('when modal is closed', () => {
    it('does not render the modal content', () => {
      render(
        <DeleteConfirmationModal
          isOpen={false}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );
      expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
    });
  });

  describe('with custom props', () => {
    it('displays custom content correctly', () => {
      const customProps = {
        title: 'Custom Title',
        message: 'Custom Warning Message',
        confirmButtonText: 'Confirm Delete',
        cancelButtonText: 'Abort',
      };

      render(
        <DeleteConfirmationModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          {...customProps}
        />
      );

      expect(screen.getByText(customProps.title)).toBeInTheDocument();
      expect(screen.getByText(customProps.message)).toBeInTheDocument();
      expect(screen.getByTestId('confirm-removal-button')).toHaveTextContent(
        customProps.confirmButtonText
      );
      expect(screen.getByText(customProps.cancelButtonText)).toBeInTheDocument();
    });
  });
});