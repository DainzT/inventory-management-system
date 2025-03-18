import React, { useState } from "react";
import {MainContent}  from "@/components/OrderFleetDisplay/MainContent";

const Orders: React.FC = () => {
  const [activeFleet, setActiveFleet] = useState("All Fleets");

  return (
    <div className="p-4 bg-[#F4F4F4] h-full">
      <MainContent activeFleet={activeFleet} onFleetSelect={setActiveFleet} />
    </div>
  );
};

export default Orders;
