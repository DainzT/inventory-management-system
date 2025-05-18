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
    : `/summary/${encodeURIComponent(
      fleet
        .toLowerCase()
        .replace(/ /g, "-")
        .normalize("NFD") 
        .replace(/[\u0300-\u036f]/g, "")
      )}`; 
};

  const normalizePath = (path: string) => {
    return decodeURIComponent(
      path
        .toLowerCase()
        .replace(/\/$/, "") 
        .normalize("NFD") 
        .replace(/[\u0300-\u036f]/g, "") 
    );
  };

  return (
    <nav className="relative ml-[20px] md:ml-[55px] border-l-[2px] border-[#CBC6C6]">
      <ul className="flex flex-col gap-[8px] md:gap-[10px] ml-[10px] md:ml-[10px]">
        {fleets.map((fleet, i) => {
          const fleetPath = getFleetPath(fleet);
          const isActive = normalizePath(location.pathname) === normalizePath(fleetPath);
          return (
            <li key={i} className="w-full">
              <Link
                to={fleetPath}
                onClick={onFleetSelect}
                className={`className=" text-sm text-black inter-font block font-medium px-2 py-2
                  ${
                    isActive
                      ? "bg-accent text-white"
                      : "hover:bg-accent hover:text-white"
                  }`}
                draggable="true"
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
