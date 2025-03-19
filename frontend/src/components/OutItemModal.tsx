import React, { useState } from "react";
import ItemDetails from "./OutItemModal/ItemDetails";
import SelectField from "./OutItemModal/SelectField";
import QuantitySelector from "./OutItemModal/QuantitySelector";
import SummarySection from "./OutItemModal/SummarySection";
import { MdClose, MdAdd } from "react-icons/md";

interface OutItemModalProps {
  onClose: () => void;
}

const OutItemModal: React.FC<OutItemModalProps> = ({ onClose }) => {
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

  return (
    <section className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50">
      <article className="relative px-6 py-4 w-96 bg-white rounded-2xl border-2 shadow-sm border-zinc-300 h-[36rem]">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-cyan-800">Out Item</h1>
          <button
            onClick={onClose}
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
    </section>
  );
};

export default OutItemModal;
