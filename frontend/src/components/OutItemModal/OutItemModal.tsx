
import React, { Dispatch, SetStateAction, useState } from "react";
import ItemDetails from "./ItemDetails";
import SelectField from "./SelectField";
import QuantitySelector from "./QuantitySelector";
import SummarySection from "./SummarySection";
import { MdClose, MdAdd } from "react-icons/md";

interface OutItemModalProps {
  isOpen: boolean, 
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const OutItemModal: React.FC<OutItemModalProps> = ({ 
  isOpen, 
  setIsOpen, 
  }) => {
  const [fleet, setFleet] = useState<string>("");
  const [boat, setBoat] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);

  const itemDetails = {
    name: "Fishing Reel",
    description: "Spinning reel, corrosion-resistant",
    price: 60.0,
    availableStock: 8,
    unit: "Liters",
  };

  const fleetOptions = ["Fleet A", "Fleet B", "Fleet C"];
  const boatOptions = ["Boat 1", "Boat 2", "Boat 3"];

  const handleAssign = () => {
    console.log("Assigned", { fleet, boat, quantity });
  };

  const totalPrice = quantity * itemDetails.price;
  const remainingStock = itemDetails.availableStock - quantity;
  
  if (!isOpen) return null;

  return (
    <section className="flex fixed inset-0 justify-center items-center">
      <article className="relative z-50 px-6 py-4 w-96 bg-white rounded-[19px] border-[1px] border-[#E0D8D8] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] animate-[fadeIn_0.2s_ease-out] h-[36rem]">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-[24px] font-bold text-cyan-800 inter-font">Out Item</h1>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            className="cursor-pointer"
          >
            <MdClose />
          </button>
        </header>

        <ItemDetails
          name={itemDetails.name}
          description={itemDetails.description}
          price={itemDetails.price}
          availableStock={itemDetails.availableStock}
          unit={itemDetails.unit}
        />

        <div className="mb-2">
          <SelectField
            label="Choose an Option"
            placeholder="Select an option"
            value={fleet}
            onChange={setFleet}
            options={fleetOptions}
            required
          />
        </div>

        <div className="mb-2">
          <SelectField
            label="Choose an Option"
            placeholder="Select an option"
            value={boat}
            onChange={setBoat}
            options={boatOptions}
            required
          />
        </div>

        <div className="mb-2">
          <QuantitySelector
            quantity={quantity}
            setQuantity={setQuantity}
            maxQuantity={itemDetails.availableStock}
            unit={itemDetails.unit}
          />
        </div>

        <SummarySection
          totalPrice={totalPrice}
          remainingStock={remainingStock}
          unit={itemDetails.unit}
        />

        <button
          onClick={handleAssign}
          className="flex absolute right-6 bottom-6 gap-2 justify-center items-center h-10 text-white bg-accent rounded-md w-24"
        >
          <MdAdd />
          <span>Assign</span>
        </button>
      </article>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />
    </section>
  );
};

export default OutItemModal;
