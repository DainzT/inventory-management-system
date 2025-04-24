export interface FilterDropdownProps {
    label: string;
    options: string[]; 
    onSelect: (selectedOption: string) => void;
  }