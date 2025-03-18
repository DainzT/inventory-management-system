import React, { useState } from 'react';
import { Trash2, Minus, Plus, CheckSquare, X } from 'lucide-react';

interface ModifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number, fleet: string, boat: string) => void;
  onRemove: () => void;
}

const fleets = {
  "F/B DONYA DONYA 2x": [
    "F/B Lady Rachelle",
    "F/B Mariella",
    "F/B My Shield",
    "F/B Abigail",
    "F/B DC-9"
  ],
  "F/B Doña Librada": [
    "F/B Adomar",
    "F/B Prince of Peace",
    "F/B Ruth Gaily",
    "F/V Vadeo Scout",
    "F/B Mariene"
  ]
};

const ModifyModal: React.FC<ModifyModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onRemove,
}) => {
  const [quantity, setQuantity] = useState(7);
  const [fleet, setFleet] = useState("F/B DONYA DONYA 2x");
  const [boat, setBoat] = useState("F/B Lady Rachelle");
  
  const originalPrice = 60.00;
  const currentStock = 8;
  
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
    // Update boat to the first boat in the selected fleet
    setBoat(fleets[newFleet as keyof typeof fleets][0]);
  };
  
  const handleConfirm = () => {
    onConfirm(quantity, fleet, boat);
    onClose();
  };
  
  if (!isOpen) return null;
  
  const totalPrice = originalPrice * quantity;
  const remainingStock = currentStock - quantity;
  
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="p-6 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-medium text-teal-700">Modify Item</h2>
            <button 
              onClick={onRemove}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded flex items-center gap-1.5"
            >
              <Trash2 size={16} />
              <span>Remove Item</span>
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">Fishing Reel</h3>
              <span className="text-teal-600 font-medium">₱60.00</span>
            </div>
            <p className="text-gray-600 mb-4">Spinning reel, corrosion-resistant</p>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Stock Available:</span>
              <span className="font-medium">{currentStock}</span>
            </div>
          </div>
          
          <div>
            <label className="block font-medium mb-2">Quantity</label>
            <div className="flex">
              <button 
                onClick={handleDecrement}
                className="bg-gray-200 hover:bg-gray-300 rounded-l-md w-10 h-10 flex items-center justify-center"
              >
                <Minus size={20} />
              </button>
              <div className="bg-gray-100 w-12 h-10 flex items-center justify-center">
                {quantity}
              </div>
              <button 
                onClick={handleIncrement}
                className="bg-gray-200 hover:bg-gray-300 rounded-r-md w-10 h-10 flex items-center justify-center"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block font-medium mb-2">Fleet Assignment</label>
            <select
              value={fleet}
              onChange={(e) => handleFleetChange(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-teal-500"
            >
              {Object.keys(fleets).map((fleetName) => (
                <option key={fleetName} value={fleetName}>{fleetName}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block font-medium mb-2">Boat Assignment</label>
            <select
              value={boat}
              onChange={(e) => setBoat(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-teal-500"
            >
              {fleets[fleet as keyof typeof fleets]?.map((boatName) => (
                <option key={boatName} value={boatName}>{boatName}</option>
              ))}
            </select>
          </div>
          
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">Total</h3>
              <span className="text-teal-600 font-medium">₱{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Remaining Stock</span>
              <span className="font-medium">{remainingStock}</span>
            </div>
          </div>
          
          <div className="flex gap-3 mt-2">
            <button 
              onClick={onClose}
              className="flex-1 bg-sky-200 hover:bg-sky-300 text-sky-700 font-medium py-2 px-4 rounded flex items-center justify-center gap-2"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
            <button 
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
  );
};

export default ModifyModal;