
  import React, { useState } from "react";
  import {  useLocation } from "react-router-dom";
  import { Logo } from "./SidebarComponents/Logo";
  import { NavigationItem } from "./SidebarComponents/NavigationItem";
  import { FleetSelector } from "./SidebarComponents/FleetSelector";
  import { CiBoxList } from "react-icons/ci";
  import LogoutButton from "./SidebarComponents/LogoutButton";
  import { MdOutlineInventory2 } from "react-icons/md";
  import { BsBoxSeam } from "react-icons/bs";
  import { HiMenu, HiX } from "react-icons/hi";

  const Sidebar: React.FC = () => {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState<string | null>(location.pathname);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar visibility

    const handleLinkClick = (path: string) => {
      if (path === "/summary") {
        return; 
      }
      setActiveLink(path);
    };
    
    const navigationItems = [
      {
        path: "/",
        icon: <MdOutlineInventory2 size={24}/>,
        label: "Inventory",
      },
      {
        path: "/orders",
        icon: <BsBoxSeam size={24}/>,
        label: "Orders",
      },
      {
        path: "/summary",
        icon: <CiBoxList size={24}/>,
        label: "Summary",
        disabled: true,
      },
    ];


    return (
      <>
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-gray-200 rounded-lg md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        <aside
          className={`fixed md:relative h-screen w-[256px] flex flex-col justify-between inter-font bg-[rgba(244,244,244,0.8)] border-r-[1px] border-r-[#E5E7EB] transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="h-full flex flex-col flex-grow overflow-y-auto">
            <Logo/>
            <nav className="flex flex-col items-center w-full h-full gap-1">
              {navigationItems.map((item) => (
                    <NavigationItem
                      key={item.path}
                      path={item.path}
                      currentPath={activeLink || location.pathname}
                      icon={item.icon}
                      label={item.label}
                      onClick={() => handleLinkClick(item.path)}
                      disabled={item.disabled} 
                    />
                  ))}
                <FleetSelector 
                  onFleetSelect={() => setActiveLink(null)} 
                  fleets={["All Fleets", "F/B DONYA DONYA 2x", "F/B Doña Librada"]}
                />
            </nav>
          </div>

          <div className=" flex justify-center p-4 border-t-[1px] border-t-[#E5E7EB] mb-10 pt-6">
            <LogoutButton />
          </div>
        </aside>
      </>
    );
  };

  export default Sidebar;
