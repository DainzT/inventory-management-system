import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "@/components/Sidebar";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { SidebarContents } from "@/types/sidebar-contents";
import Inventory from "./pages/InventoryPage";
import Orders from "./pages/OrderPage";

const sidebarLinks: SidebarContents[] = [
  { path: "/", label: "Main Inventory", icon: <MdOutlineInventory2 /> },
  { path: "/orders", label: "Orders", icon: <BsBoxSeam /> },
];

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <Header />
        <Sidebar sidebarLinks={sidebarLinks} showLogo={true} />
        <main className="flex-1 p-4 bg-[#F4F4F4] h-full">
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
