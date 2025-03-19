import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Inventory from "./pages/InventoryPage";
import Orders from "./pages/OrderPage";
import Summary from "./pages/SummaryPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <Header />
        <Sidebar />
        <main className="flex-1 p-4 bg-[#F4F4F4] h-full">
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
