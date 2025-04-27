import React, { useState, useEffect } from "react";
import { Trash2, Minus, Plus, CheckSquare, X } from "lucide-react";
import { OrderItem } from "@/types";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { UnsavedChangesModal } from "../EditProductModal/UnsavedChangesModal";
import { OrderItem } from "@/types";

interface ModifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    quantity: number,
    fleet: string,
    boat: string,
  ) => void;
  onRemove: () => void;
  order: OrderItem;
}

const fleets = {
  "F/B DONYA DONYA 2X": [
    "F/B Lady Rachelle",
    "F/B Mariella",
    "F/B My Shield",
    "F/B Abigail",
    "F/B DC-9",
  ],
  "F/B Doña Librada": [
    "F/B Adomar",
    "F/B Prince of Peace",
    "F/B Ruth Gaily",
    "F/V Vadeo Scout",
    "F/B Mariene",
  ],
};

export const ModifyModal: React.FC<ModifyModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onRemove,
  order,
}) => {
  const [quantity, setQuantity] = useState<number>(
    typeof order.quantity === "number" ? order.quantity : 0
  );
  const [fleet, setFleet] = useState<string>(order.fleet.fleet_name);
  const [boat, setBoat] = useState<string>(order.boat.boat_name);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] =
    useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const currentStock = 8;
  useEffect(() => {
    const hasChanged =
      quantity !== order.quantity ||
      fleet !== order.fleet.fleet_name ||
      boat !== order.boat.boat_name;
  
    setHasChanges(hasChanged);
  }, [quantity, fleet, boat, order]);

  const handleIncrement = () => {
    if (quantity < currentStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleFleetChange = (newFleet: string) => {
    setFleet(newFleet);
    const fleetBoats = fleets[newFleet as keyof typeof fleets];
    if (fleetBoats && fleetBoats.length > 0) {
      setBoat(fleetBoats[0]);
    }
  };

  const handleConfirm = () => {
    onConfirm(quantity, fleet, boat);
    onClose();
  };

  const handleRemoveClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseClick = () => {
    if (hasChanges) {
      setIsUnsavedChangesModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleDiscardChanges = () => {
    setIsUnsavedChangesModalOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  const totalPrice = Number(order.unitPrice) * quantity;
  const remainingStock = currentStock - quantity;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
          <div className="p-6 flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-medium text-teal-700">
                Modify Item
              </h2>
              <button
                data-testid="remove-item-button"
                onClick={handleRemoveClick}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded flex items-center gap-1.5"
              >
                <Trash2 size={16} />
                <span>Remove Item</span>
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {order.name}
              </h3>
              <p className="text-gray-600">{order.note}</p>
              <p className="text-gray-800">₱{Number(order.unitPrice).toFixed(2)}</p>
            </div>

            <div>
              <label className="block font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-2">
                <div className="flex">
                  <button
                    onClick={handleDecrement}
                    aria-label="Decrement quantity"
                    className="bg-gray-200 hover:bg-gray-300 rounded-l-md w-10 h-10 flex items-center justify-center"
                  >
                    <Minus size={20} />
                  </button>
                  <div
                    data-testid="quantity-display"
                    className="bg-gray-100 w-12 h-10 flex items-center justify-center"
                  >
                    {quantity}
                  </div>
                  <button
                    onClick={handleIncrement}
                    aria-label="Increment quantity"
                    className="bg-gray-200 hover:bg-gray-300 rounded-r-md w-10 h-10 flex items-center justify-center"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="fleet-select" className="block font-medium mb-2">Fleet Assignment</label>
              <select
                id="fleet-select"
                value={fleet}
                onChange={(e) => handleFleetChange(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-teal-500"
              >
                {Object.keys(fleets).map((fleetName) => (
                  <option key={fleetName} value={fleetName}>
                    {fleetName}
                  </option>
                ))}
              </select>

              <label htmlFor="boat-select" className="block font-medium mb-2">Boat Assignment</label>
              <select
                id="boat-select"
                value={boat}
                onChange={(e) => setBoat(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-teal-500"
              >
                {fleets[fleet as keyof typeof fleets]?.map((boatName) => (
                  <option key={boatName} value={boatName}>
                    {boatName}
                  </option>
                ))}
              </select>

            </div>
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Total</h3>
                <span className="text-teal-600 font-medium">
                  ₱{totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Remaining Stock</span>
                <span data-testid="remaining-stock" className="font-medium">
                  {remainingStock}
                </span>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleCloseClick}
                className="flex-1 bg-sky-200 hover:bg-sky-300 text-sky-700 font-medium py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
              <button
                data-testid="confirm-changes-button"
                onClick={handleConfirm}
                className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-medium py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                <CheckSquare size={18} />
                <span>Confirm Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          onRemove();
          onClose();
        }}
        title="Remove Item"
        message="Are you sure you want to remove this item from your order? This action cannot be undone."
        confirmButtonText="Remove Item"
      />

      <UnsavedChangesModal
        isOpen={isUnsavedChangesModalOpen}
        onClose={() => setIsUnsavedChangesModalOpen(false)}
        onConfirm={handleDiscardChanges}
      />
    </>
  );
};

export default ModifyModal;
