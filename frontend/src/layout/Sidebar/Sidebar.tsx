import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { NavigationItem } from "./NavigationItem";
import { FleetSelector } from "./FleetSelector";
import { CiBoxList } from "react-icons/ci";
import LogoutButton from "./LogoutButton";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";
import ChangePinModal from "@/components/authentication/ChangePin";
import ChangeEmailModal from "@/components/authentication/ChangeEmail";
import { IoSettingsOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<string | null>(
    location.pathname
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);

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
        className="fixed top-4 left-4 z-50 p-2 bg-gray-200/90 rounded-lg md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <HiX size={20} /> : <HiMenu size={20} />}
      </button>

      <aside
        className={`fixed z-40 md:relative h-screen w-[256px] flex flex-col justify-between inter-font bg-[rgba(244,244,244,0.8)] border-r-[1px] border-r-[#E5E7EB] transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="absolute top-4 left-4 z-10">
          <div className="relative flex">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-all
                bg-cyan-900 border border-gray-300 shadow-sm
                hover:bg-cyan-800 hover:shadow-md
                active:bg-cyan-800 active:scale-95 cursor-pointer
                ${isSettingsOpen ? "bg-cyan-800 shadow-md" : ""}`}
              aria-label="Settings"
            >
              <IoSettingsOutline
                className={`text-white transition-transform ${
                  isSettingsOpen ? "rotate-45" : ""
                }`}
                size={18}
              />
            </button>

            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 ml-10 w-40 bg-white rounded-md shadow-lg border border-gray-300 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setShowChangePinModal(true);
                      setIsSettingsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center rounded-sm gap-2
                      bg-white text-accent
                      hover:bg-accent hover:text-white
                      active:bg-accent-dark active:scale-95 active:text-white
                      focus:outline-none cursor-pointer focus:ring-blue-200`}
                  >
                    <span>Change PIN</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowChangeEmailModal(true);
                      setIsSettingsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center rounded-sm gap-2
                      bg-white text-accent
                      hover:bg-accent hover:text-white
                      active:bg-accent-dark active:scale-95 active:text-white
                      focus:outline-none cursor-pointer focus:ring-blue-200`}
                  >
                    <span>Change Email</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="h-full flex flex-col flex-grow overflow-y-auto">
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
        <div className=" flex justify-center p-4 border-t-[1px] border-t-[#E5E7EB] mb-10 pt-6">
          <LogoutButton />
        </div>
      </aside>
      {showChangePinModal && (
        <ChangePinModal onClose={() => setShowChangePinModal(false)} />
      )}
      {showChangeEmailModal && (
        <ChangeEmailModal onClose={() => setShowChangeEmailModal(false)} />
      )}
    </>
  );
};

export default Sidebar;
