
export interface NavigationItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
  }
  
  export interface FleetCardProps {
    title: string;
    backgroundColor: string;
    isActive?: boolean;
    onClick?: () => void;
  }
  
  export interface OrderItemProps {
    id: number;
    productName: string;
    note: string;
    quantity: number | "";
    unitPrice: number ;
    selectUnit: string;
    unitSize: number | "";
    total?: number | "";
    fleet: string;
    boat: string
    dateOut: string;
    onModify?: (id: number) => void;
  }

  export interface FleetListProps {
    activeFleet?: string;
    onFleetSelect?: (fleet: string) => void;
  }
  