import ModifyModal from "@/components/ModifyModal";
import React, { useState } from "react";

const Orders: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmChanges = (quantity: number, fleet: string, boat: string) => {
    console.log('Changes confirmed:', { quantity, fleet, boat });
    // Implementation for handling the confirmation
  };

  const handleRemoveItem = () => {
    console.log('Item removed');
    setIsModalOpen(false);
    // Implementation for removing the item
  };

  return (
    <div className="p-4 bg-[#F4F4F4] h-full">
      <h1 className="text-2xl font-bold">Orders</h1>
      <button 
          onClick={handleOpenModal}
          className="bg-teal-700 hover:bg-teal-800 text-white text-sm px-4 py-2 rounded flex items-center gap-1.5"
        >
          Modify
        </button>
        <ModifyModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmChanges}
          onRemove={handleRemoveItem}
        />
    </div>
  );
};

export default Orders;
