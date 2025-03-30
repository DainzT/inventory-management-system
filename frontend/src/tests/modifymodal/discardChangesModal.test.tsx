import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { X } from 'lucide-react';
import '@testing-library/jest-dom';
import UnsavedChangesModal from '@/components/DiscardChangesModal';

jest.mock('lucide-react', () => ({
  X: jest.fn((props) => <svg data-testid="x-icon" {...props} />),
}));

describe('UnsavedChangesModal', () => {
  const mockOnCancel = jest.fn();
  const mockOnDiscard = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when modal is open', () => {
    beforeEach(() => {
      render(
        <UnsavedChangesModal
          isOpen={true}
          onCancel={mockOnCancel}
          onDiscard={mockOnDiscard}
        />
      );
    });

    it('renders the modal with correct content', () => {
      expect(screen.getByText('Discard changes')).toBeInTheDocument();
      expect(
        screen.getByText(/You have made changes that haven't been saved yet/i)
      ).toBeInTheDocument();

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByTestId('discard-changes-button')).toHaveTextContent(
        'Discard Changes'
      );
    });

    it('calls onCancel when cancel button is clicked', () => {
      fireEvent.click(screen.getByText('Cancel'));
      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('calls onDiscard when discard button is clicked', () => {
      fireEvent.click(screen.getByTestId('discard-changes-button'));
      expect(mockOnDiscard).toHaveBeenCalled();
    });

    it('displays the X icon with correct styling', () => {
      expect(X).toHaveBeenCalledWith(
        expect.objectContaining({
          className: 'text-red-500 h-6 w-6',
        }),
        expect.anything()
      );

      const icon = screen.getByTestId('x-icon');
      const iconContainer = icon.parentElement;
      expect(iconContainer).toHaveClass('bg-red-100', 'rounded-full');
    });

    it('has correct button styling', () => {
      const cancelButton = screen.getByText('Cancel');
      const discardButton = screen.getByTestId('discard-changes-button');

      expect(cancelButton).toHaveClass('bg-teal-700');
      expect(cancelButton).toHaveClass('hover:bg-teal-800');
      expect(cancelButton).toHaveClass('py-3');

      expect(discardButton).not.toHaveClass('bg-teal-700');
    });
  });

  describe('when modal is closed', () => {
    it('does not render the modal content', () => {
      render(
        <UnsavedChangesModal
          isOpen={false}
          onCancel={mockOnCancel}
          onDiscard={mockOnDiscard}
        />
      );
      expect(screen.queryByText('Discard changes')).not.toBeInTheDocument();
    });
  });

  describe('accessibility considerations', () => {
    it('has proper button roles', () => {
      render(
        <UnsavedChangesModal
          isOpen={true}
          onCancel={mockOnCancel}
          onDiscard={mockOnDiscard}
        />
      );
      
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Discard Changes' })
      ).toBeInTheDocument();
    });
  });
});