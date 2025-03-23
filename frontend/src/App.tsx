import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "@/components/Sidebar";
import Inventory from "./pages/InventoryPage";
import Orders from "./pages/OrderPage";
import Summary from "./pages/SummaryPage";


const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
            <div className="flex-1 p-4 overflow-y-hidden">
            <Routes>
              <Route path="/" element={<Inventory />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/summary" element={<Summary />} />
            </Routes>
            </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
