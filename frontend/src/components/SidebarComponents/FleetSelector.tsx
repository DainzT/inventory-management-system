import React from "react";
import { Link } from "react-router-dom";

interface FleetSelectorProps {
  onFleetSelect: (fleetPath: string) => void;
}

export const FleetSelector: React.FC<FleetSelectorProps> = ({
  onFleetSelect,
}) => {
  const fleets = ["All Fleets", "Fleet 1", "Fleet 2"];

  const getFleetPath = (fleet: string) =>
    fleet === "All Fleets"
      ? "/summary/all-fleets"
      : `/summary/${fleet.toLowerCase().replace(" ", "-")}`;

  return (
    <div className="w-4/5 bg-gray-100 rounded mt-2 flex justify-self-end">
      <ul className="flex flex-col w-full gap-2">
        {fleets.map((fleet, i) => {
          const fleetPath = getFleetPath(fleet);
          return (
            <li key={i} className="w-full">
              <Link
                to={fleetPath}
                onClick={() => onFleetSelect(fleetPath)}
                className={`flex items-center py-2 px-14 w-full rounded transition-all duration-100
                  ${
                    window.location.pathname === fleetPath
                      ? "bg-accent text-white"
                      : "hover:bg-accent hover:text-white"
                  }`}
              >
                {fleet}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
