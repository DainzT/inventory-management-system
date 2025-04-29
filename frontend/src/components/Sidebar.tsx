import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Logo } from "./SidebarComponents/Logo";
import { NavigationItem } from "./SidebarComponents/NavigationItem";
import { FleetSelector } from "./SidebarComponents/FleetSelector";
import { CiBoxList } from "react-icons/ci";
import LogoutButton from "./SidebarComponents/LogoutButton";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";
import ChangePinModal from "./AuthComponents/ChangePin";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<string | null>(
    location.pathname
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showChangePin, setShowChangePin] = useState(false);

  const handleLinkClick = (path: string) => {
    if (path === "/summary") {
      return;
    }
    setActiveLink(path);
  };

  const navigationItems = [
    {
      path: "/inventory",
      icon: <MdOutlineInventory2 size={24} />,
      label: "Inventory",
    },
    {
      path: "/orders",
      icon: <BsBoxSeam size={24} />,
      label: "Orders",
    },
    {
      path: "/summary",
      icon: <CiBoxList size={24} />,
      label: "Summary",
      disabled: true,
    },
  ];

  return (
    <>
      <button
        className="fixed top-4 left-4  z-50 p-2 bg-gray-200/90 rounded-lg md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <HiX size={20} /> : <HiMenu size={20} />}
      </button>

      <aside
        className={`fixed z-40 md:relative h-screen w-[256px] flex flex-col justify-between inter-font bg-[rgba(244,244,244,0.8)] border-r-[1px] border-r-[#E5E7EB] transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-full flex flex-col flex-grow overflow-y-auto ">
          <nav className="flex flex-col items-center justify-centers w-full h-full gap-1">
            <Logo width={12} height={12} />
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
        <div>
          <button
            type="button"
            onClick={() => setShowChangePin(true)}
            className="mt-2 text-sm text-accent underline hover:text-accent-light cursor-pointer active:scale-95 flex justify-self-center"
          >
            Change PIN?
          </button>
          {showChangePin && (
            <ChangePinModal onClose={() => setShowChangePin(false)} />
          )}
        </div>

        <div className=" flex justify-center p-4 border-t-[1px] border-t-[#E5E7EB] mb-10 pt-6">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
