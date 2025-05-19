import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FilterDropdown } from '../../components/OrderFleetDisplay/FilterDropdown';

describe('FilterDropdown', () => {
  const mockOnSelect = jest.fn();
  const label = 'Select option';
  const options = ['Option 1', 'Option 2', 'Option 3'];

  it('renders the component with the label', () => {
    const { getByText } = render(
      <FilterDropdown label={label} options={options} onSelect={mockOnSelect} />
    );
    expect(getByText(label)).toBeInTheDocument();
  });

  it('opens the dropdown when clicked', () => {
    const { getByText, getByRole } = render(
      <FilterDropdown label={label} options={options} onSelect={mockOnSelect} />
    );
    fireEvent.click(getByText(label));
    expect(getByRole('listbox')).toBeInTheDocument();
  });

});