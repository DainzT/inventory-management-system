import React from "react";
import { Link, useLocation } from "react-router-dom";

interface FleetSelectorProps {
  onFleetSelect: () => void;
  fleets: Array<string>
}

export const FleetSelector = ({
  onFleetSelect,
  fleets,
}: FleetSelectorProps) => {
  const location = useLocation();

  const getFleetPath = (fleet: string) => {
    return fleet === "All Fleets"
      ? "/summary/all-fleets"
      : `/summary/${fleet.toLowerCase().replace(" ", "-")}`;
  };

  return (
    <nav className="relative ml-[20px] md:ml-[55px] border-l-[2px] border-[#CBC6C6]">
      <ul className="flex flex-col gap-[8px] md:gap-[10px] ml-[10px] md:ml-[10px]">
        {fleets.map((fleet, i) => {
          const fleetPath = getFleetPath(fleet);
          return (
            <li key={i} className="w-full">
              <Link
                to={fleetPath}
                onClick={onFleetSelect}
                className={`className=" text-s text-black inter-font block font-medium px-3 py-2
                  ${
                    location.pathname === fleetPath
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
    </nav>
  );
};
