import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/image/logo.svg";
import { SidebarContents } from "@/types/sidebar-contents";

interface SidebarProps {
  sidebarLinks: SidebarContents[];
  showLogo: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarLinks, showLogo }) => {
  return (
    <div className="w-64 bg-white text-black h-screen border-r border-white-light flex flex-col items-center justify-center">
      <nav className=" flex flex-col items-center w-full">
        {showLogo && logo && (
          <img src={logo} alt="Logo" className="w-48 h-48" />
        )}
        <ul>
          {sidebarLinks.map((link, index) => (
            <li key={index} className="mb-2 w-64 flex justify-center">
              <Link
                to={link.path}
                className="flex items-center py-2 px-4 w-full pl-14 hover:bg-accent hover:text-white rounded inter-font"
              >
                {link.icon && <span className="mr-2">{link.icon}</span>}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
