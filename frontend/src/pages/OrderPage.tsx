import ModifyModal from "@/components/ModifyModal";
import React, { useState } from "react";
import { ProductItemProps } from "@/components/ProductItemProps";

const Orders: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const product: ProductItemProps = {
    name: "Fishing Line",
    price: 60.00,
    description: "For catching fish",
    stock: 10,
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmChanges = (quantity: number, fleet: string, boat: string, unit: string) => {
    console.log('Changes confirmed:', { quantity, fleet, boat, unit });
    setIsModalOpen(false); 
  };

  const handleRemoveItem = () => {
    console.log('Item removed');
    setIsModalOpen(false);
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
        product={product} // Pass the product data to the modal
      />
    </div>
  );
};

export default Orders;