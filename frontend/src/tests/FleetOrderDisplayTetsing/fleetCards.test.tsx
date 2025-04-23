import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FleetCard, FleetList } from '../../components/OrderFleetDisplay/FleetCards'

describe('FleetCard Component', () => {
  const mockProps = {
    title: 'Test Fleet',
    backgroundColor: 'bg-blue-500',
    isActive: false,
    onClick: jest.fn(),
  };

  it('renders correctly with default props', () => {
    render(<FleetCard {...mockProps} />);
    
    const card = screen.getByRole('article');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('bg-blue-500');
    expect(card).toHaveClass('h-[170px]');
    expect(card).toHaveClass('w-[250px]');
    expect(screen.getByText('Test Fleet')).toBeInTheDocument();
  });

  it('renders with active state when isActive is true', () => {
    render(<FleetCard {...mockProps} isActive={true} />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveClass('h-[200px]');
    expect(card).toHaveClass('w-[300px]');
    expect(card).toHaveClass('shadow-2xl');
  });

  it('calls onClick when clicked', () => {
    render(<FleetCard {...mockProps} />);
    
    const card = screen.getByRole('article');
    fireEvent.click(card);
    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('renders the SVG icons', () => {
    render(<FleetCard {...mockProps} />);
    
    expect(screen.getByLabelText('Options')).toBeInTheDocument();
    expect(document.querySelectorAll('svg').length).toBeGreaterThan(0);
  });
});

describe('FleetList Component', () => {
  const mockFleets = ['All Fleets', 'DONYA DONYA', 'Doña Librada'];
  const mockOnFleetSelect = jest.fn();

  it('renders correctly with default props', () => {
    render(<FleetList activeFleet="All Fleets" onFleetSelect={mockOnFleetSelect} />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    mockFleets.forEach(fleet => {
      expect(screen.getByText(fleet)).toBeInTheDocument();
    });
    
    expect(screen.getByText('All Fleets')).toHaveAttribute('aria-current', 'page');
  });

  it('calls onFleetSelect when a fleet is clicked', () => {
    render(<FleetList activeFleet="All Fleets" onFleetSelect={mockOnFleetSelect} />);
    
    const fleetButton = screen.getByText('DONYA DONYA');
    fireEvent.click(fleetButton);
    expect(mockOnFleetSelect).toHaveBeenCalledWith('DONYA DONYA');
  });

  it('renders the vertical line separator', () => {
    render(<FleetList activeFleet="All Fleets" onFleetSelect={mockOnFleetSelect} />);
    const separator = screen.getByTestId('fleet-list-separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('bg-stone-300');
  });

  it('marks the active fleet correctly', () => {
    render(<FleetList activeFleet="Doña Librada" onFleetSelect={mockOnFleetSelect} />);
    expect(screen.getByText('Doña Librada')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('All Fleets')).not.toHaveAttribute('aria-current');
  });
});