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

  it('closes the dropdown when an option is clicked', () => {
    const { getByText, queryByRole } = render(
      <FilterDropdown label={label} options={options} onSelect={mockOnSelect} />
    );
    fireEvent.click(getByText(label));
    fireEvent.click(getByText('Option 1'));
    expect(queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('calls onSelect with the selected option', () => {
    const { getByText } = render(
      <FilterDropdown label={label} options={options} onSelect={mockOnSelect} />
    );
    fireEvent.click(getByText(label));
    fireEvent.click(getByText('Option 1'));
    expect(mockOnSelect).toHaveBeenCalledWith('Option 1');
  });

  it('displays the selected option as the label', () => {
    const { getByText } = render(
      <FilterDropdown label={label} options={options} onSelect={mockOnSelect} />
    );
    fireEvent.click(getByText(label));
    fireEvent.click(getByText('Option 1'));
    expect(getByText('Option 1')).toBeInTheDocument();
  });
});