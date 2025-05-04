export interface FleetCardProps {
    title: string;
    backgroundColor: string;
    isActive?: boolean;
    onClick?: () => void;
    orderCount?: number;
  }

  export interface FleetListProps {
    activeFleet?: string;
    onFleetSelect?: (fleet: string) => void;
  }

