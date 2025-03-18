
export interface NavigationItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
  }
  
  export interface FleetCardProps {
    title: string;
    backgroundColor: string;
    onClick?: () => void;
  }
  
  export interface OrderItemProps {
    id: number;
    productName: string;
    description: string;
    quantity: number;
    unitPrice: number;
    fleet: string;
    dateOut: string;
    onModify?: (id: number) => void;
  }
  