import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/image/logo.svg";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { CiBoxList } from "react-icons/ci";
import { SidebarContents } from "@/types/sidebar-contents";

const Sidebar: React.FC = () => {
  const sidebarLinks: SidebarContents[] = [
    { path: "/", label: "General Stock", icon: <MdOutlineInventory2 /> },
    { path: "/orders", label: "Orders", icon: <BsBoxSeam /> },
    { path: "/summary", label: "Monthly Summary", icon: <CiBoxList /> },
  ];

  return (
    <div className="w-64 bg-[#F4F4F4] text-[#333333] h-screen border-r border-[#bbbbbb] flex flex-col items-center justify-center">
      <nav className=" flex flex-col items-center w-full">
        <img src={logo} alt="Logo" className="w-48 h-48" />
        <ul>
          {sidebarLinks.map((link, index) => (
            <li key={index} className="mb-2 w-64 flex justify-center">
              <Link
                to={link.path}
                className="flex items-center py-2 px-4 w-full hover:bg-[#1B626E] hover:text-[#F4F4F4] rounded inter-font"
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
