import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import businessLogo from "../assets/image/businessLogo.svg";
import { SidebarContents } from "@/types/sidebar-contents";
import { FleetSelector } from "./SidebarComponents/FleetSelector";
import { CiBoxList } from "react-icons/ci";
import LogoutButton from "./SidebarComponents/Logout";

interface SidebarProps {
  sidebarLinks: SidebarContents[];
  showLogo: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarLinks, showLogo }) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<string | null>(
    window.location.pathname
  );

  const handleLinkClick = (path: string) => {
    if (!path.startsWith("/summary/")) {
      setActiveLink(path);
    } else {
      setActiveLink(null);
    }
  };

  return (
    <div className="w-64 bg-white text-black h-screen border-r border-white-light flex flex-col justify-between py-10 items-center select-none">
      <nav className="flex flex-col items-center w-full px-2">
        {showLogo && businessLogo && (
          <img src={businessLogo} alt="Logo" className="w-48 h-48" />
        )}
        <ul className="w-full">
          {sidebarLinks
            .filter((link) => link.path !== "/summary")
            .map((link, index) => (
              <li key={index} className="gap-2 w-full mb-2">
                <Link
                  to={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`flex items-center py-2 w-full px-2 pl-10 font-semibold rounded inter-font transition-all duration-100
                  ${
                    activeLink === link.path
                      ? "bg-accent text-white"
                      : "hover:bg-accent hover:text-white"
                  }
                `}
                >
                  {link.icon && <span className="mr-2">{link.icon}</span>}
                  {link.label}
                </Link>
              </li>
            ))}
        </ul>
        <div className="w-full px-2 pt-2 border-t border-foreground">
          <div className="flex items-center pl-8 font-semibold">
            <CiBoxList className="mr-2" /> Monthly Summary
          </div>
          <FleetSelector
            onFleetSelect={(fleetPath) => setActiveLink(fleetPath)}
          />
        </div>
      </nav>
      <div className="border-t border-foreground mt-2">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
