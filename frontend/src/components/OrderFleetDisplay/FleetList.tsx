import React from "react";

interface FleetListProps {
  activeFleet?: string;
  onFleetSelect?: (fleet: string) => void;
}

export const FleetList: React.FC<FleetListProps> = ({
  activeFleet,
  onFleetSelect,
}) => {
  const fleets = ["All Fleets", "Fleet 1", "Fleet 2"];

  return (
    <nav className="flex relative flex-col gap-4 pl-24 mt-5">
      <div className="absolute w-0.5 bg-stone-300 h-[136px] left-[58px]" />
      {fleets.map((fleet) => (
        <button
          key={fleet}
          className="text-xl text-black hover:text-cyan-800 text-left"
          onClick={() => onFleetSelect && onFleetSelect(fleet)}
          aria-current={activeFleet === fleet ? "page" : undefined}
        >
          {fleet}
        </button>
      ))}
    </nav>
  );
};
