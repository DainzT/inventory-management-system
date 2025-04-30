import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { UnsavedChangesModal } from "../EditProductModal/UnsavedChangesModal";
import { ModifyOrderItem } from "@/types/modify-order-item";
import { Button } from "../AddProductModal/Button";
import DeleteButton from "../EditProductModal/DeleteButton";
import { ClipLoader } from "react-spinners";
import { pluralize } from "@/utils/Pluralize";
import SummarySection from "../OutItemModal/SummarySection";
import QuantitySelector from "../OutItemModal/QuantitySelector";
import { fixEncoding } from "@/utils/Normalization";


interface ModifyModalProps {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedOrder: ModifyOrderItem | null;
  onModify: (quantity: number, fleet: string, boat: string) => void;
  onRemove: (id: number) => void;
  isModifying?: boolean;
}

export const ModifyModal: React.FC<ModifyModalProps> = ({
  isOpen,
  setIsOpen,
  onModify,
  onRemove,
  selectedOrder,
  isModifying,
}) => {
  console.log(selectedOrder)
  const [quantity, setQuantity] = useState<number | "">("");
  const [fleet, setFleet] = useState<string>("");
  const [boat, setBoat] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] =
    useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (selectedOrder) {
      setQuantity(selectedOrder.quantity || 0);
      const fixedFleetName = fixEncoding(selectedOrder.fleet.fleet_name);
      setFleet(fixedFleetName);
      setBoat(selectedOrder.boat.boat_name)
    }
  }, [selectedOrder]);

  useEffect(() => {
    const hasChanged =
      quantity !== selectedOrder?.quantity ||
      fleet !== fixEncoding(selectedOrder.fleet.fleet_name) ||
      boat !== selectedOrder?.boat?.boat_name;
    setHasChanges(hasChanged);
  }, [quantity, fleet, boat, selectedOrder]);

  const getBoatOptions = (fleet: string) => {
    switch (fleet) {
      case "F/B DONYA DONYA 2x":
        return [
          "F/B Lady Rachelle",
          "F/B Mariella",
          "F/B My Shield",
          "F/B Abigail",
          "F/B DC-9"
        ];
      case "F/B Doña Librada":
        return [
          "F/B Adomar",
          "F/B Prince of Peace",
          "F/B Ruth Gaily",
          "F/V Vadeo Scout",
          "F/B Mariene"
        ];
      default:
        return [];
    }
  };
  const boatOptions = getBoatOptions(fleet);
  const fleetOptions = ["F/B DONYA DONYA 2x", "F/B Doña Librada"]

  const currentStock = selectedOrder?.inventory?.quantity ?? 0;
  const remainingStock = Math.max(0, Number(currentStock) - Number(quantity));

  const handleFleetChange = (newFleet: string) => {
    setFleet(newFleet);
  };

  const handleBoatChange = (newBoat: string) => {
    setBoat(newBoat);
  };

  const handleConfirm = () => {
    if (selectedOrder) {
      onModify(Number(quantity), fleet, boat);
    }
  };

  const handleQuantityChange = (newValue: number | "") => {
    setQuantity(newValue);
  };

  const handleCloseAttempt = () => {
    if (hasChanges) {
      setIsUnsavedChangesModalOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  if (!isOpen || !selectedOrder) return null;

  const totalPrice = Number(selectedOrder.unitPrice) * (Number(quantity) / Number(selectedOrder.unitSize));

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="relative z-50 px-6 py-4 w-96 bg-white rounded-[19px] border-[1px] border-[#E0D8D8] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] animate-[fadeIn_0.2s_ease-out] h-[36rem]">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-[24px] font-bold text-cyan-800 inter-font">Out Product</h1>
          <button
            onClick={handleCloseAttempt}
            className="text-black rounded-full transition-colors hover:bg-black/5 active:bg-black/10"
            aria-label="Close dialog"
            disabled={isModifying}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>
        <section className="p-2 mb-2 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-base font-semibold text-black">{selectedOrder.name}</h2>
            <p className="text-base font-semibold text-cyan-800 inter-font">
              ₱{Number(selectedOrder.unitPrice).toFixed(2)} / {selectedOrder.unitSize} {pluralize(selectedOrder.selectUnit, Number(selectedOrder.unitSize))}
            </p>
          </div>
          <p className="mb-2 text-sm text-gray-500 inter-font">{selectedOrder.note}</p>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 inter-font">Stock Available:</p>
            <p className="text-sm font-semibold text-black">
              {currentStock} {pluralize(selectedOrder.selectUnit, Number(currentStock))}
            </p>
          </div>
        </section>
        <div>
          <label htmlFor="fleet-select" className="block font-medium mb-2">Assign to Fleet</label>
          <select
            id="fleet-select"
            value={fleet}
            onChange={(e) => handleFleetChange(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-teal-500"
          >
            {fleetOptions.map((fleetName) => (
              <option key={fleetName} value={fleetName}>
                {fleetName}
              </option>
            ))}

          </select>
          <label htmlFor="boat-select" className="block font-medium mb-2">Assign to Boat</label>
          <select
            id="boat-select"
            value={boat}
            onChange={(e) => handleBoatChange(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-teal-500"
          >
            {boatOptions.map((boatName) => (
              <option key={boatName} value={boatName}>
                {boatName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <QuantitySelector
            value={quantity}
            onChange={handleQuantityChange}
            maxQuantity={Number(selectedOrder.quantity)}
            unitSize={Number(selectedOrder.unitSize)}
            error=""
            required={false}
          />
        </div>
        <SummarySection
          totalPrice={totalPrice}
          remainingStock={remainingStock}
          unit={selectedOrder.selectUnit}
        />
        <div className="flex gap-20">
          <div className="flex item-center justify-end ">
            <Button
              type="submit"
              className="text-s h-[3rem] w-[11rem]"
              disabled={isModifying}
            >
              {isModifying ? (
                <div className="flex items-center justify-center gap-2">
                  <ClipLoader color="#ffffff" size={20} className="mr-2" />
                  Updating...
                </div>
              ) : (
                "Confirm Changes"
              )}
            </Button>
          </div>
        </div>
      </div>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity "
        onClick={!isModifying ? handleCloseAttempt : undefined}
        aria-hidden="true"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
        }}
        title="Remove Item"
        message="Are you sure you want to remove this item from your order? This action cannot be undone."
        confirmButtonText="Remove Item"
      />

      <UnsavedChangesModal
        isOpen={isUnsavedChangesModalOpen}
        onClose={() => setIsUnsavedChangesModalOpen(false)}
        onConfirm={() => {
          setIsUnsavedChangesModalOpen(false);
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default ModifyModal;
