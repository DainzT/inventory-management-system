import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { UnsavedChangesModal } from "../EditProductModal/UnsavedChangesModal";
import { ModifyOrderItem } from "@/types/modify-order-item";
import { Button } from "../AddProductModal/Button";
import DeleteButton from "../EditProductModal/DeleteButton";
import { ClipLoader } from "react-spinners";
import SummarySection from "../OutItemModal/SummarySection";
import { fixEncoding } from "@/utils/Normalization";
import QuantitySelector from "../OutItemModal/QuantitySelector";
import { pluralize } from "@/utils/Pluralize";
import { roundTo } from "@/utils/RoundTo";

interface ModifyModalProps {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedOrder: ModifyOrderItem | null;
  onModify: (quantity: number, fleet: string, boat: string) => Promise<void>;
  onRemove: (id: number) => void;
  isDeleting: boolean;
  isModifying?: boolean;
}

export const ModifyModal: React.FC<ModifyModalProps> = ({
  isOpen,
  setIsOpen,
  onModify,
  onRemove,
  selectedOrder,
  isModifying,
  isDeleting
}) => {

  const [quantity, setQuantity] = useState<number | "">("");
  const [fleet, setFleet] = useState<string>("");
  const [boat, setBoat] = useState<string>("");
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [quantityError, setQuantityError] = useState("");
  const [expanded, setExpanded] = useState(false);

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
        return ["F/B Lady Rachelle", "F/B Mariella", "F/B My Shield", "F/B Abigail", "F/B DC-9"];
      case "F/B Doña Librada":
        return ["F/B Adomar", "F/B Prince of Peace", "F/B Ruth Gaily", "F/V Vadeo Scout", "F/B Mariene"];
      default:
        return [];
    }
  };
  const boatOptions = getBoatOptions(fleet);
  const fleetOptions = ["F/B DONYA DONYA 2x", "F/B Doña Librada"];

  const currentInventory = selectedOrder?.inventory?.quantity ?? 0;
  const originalOrderQty = selectedOrder?.quantity ?? 0;

  const remainingStock = selectedOrder?.inventory !== undefined
    ? Number(currentInventory) + Number(originalOrderQty) - Number(quantity || 0)
    : null;

  const maxAllowed = selectedOrder?.inventory !== undefined
    ? Number(currentInventory) + Number(originalOrderQty)
    : originalOrderQty;

  const handleFleetChange = (newFleet: string) => {
    setFleet(newFleet);
  };

  const handleBoatChange = (newBoat: string) => {
    setBoat(newBoat);
  };

  const handleConfirm = () => {
    if (Number(quantity) > Number(maxAllowed)) {
      setQuantityError(
        selectedOrder?.inventory !== undefined
          ? `Cannot exceed available stock (${maxAllowed})`
          : `Cannot exceed original order quantity (${maxAllowed})`
      );
      return;
    }

    setQuantityError("");
    onModify(Number(quantity), fleet, boat);
  };

  const handleQuantityChange = (newValue: number | "") => {
    if (newValue === "") {
      setQuantity("");
      setQuantityError("");
      return;
    }
    setQuantity(newValue);
  };

  const handleCloseAttempt = () => {
    if (hasChanges) {
      setIsUnsavedChangesModalOpen(true);
    } else {
      setIsOpen(false);
      setQuantityError("");
    }
  };

  if (!isOpen || !selectedOrder) return null;

  const totalPrice = Number(selectedOrder.unitPrice) * (Number(quantity) / Number(selectedOrder.unitSize));
  const showToggle = selectedOrder.note.length > 42;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="relative z-50 px-6 py-4 w-96 bg-white rounded-[19px] border-[1px] border-[#E0D8D8] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] animate-[fadeIn_0.2s_ease-out] h-[36rem]
        flex flex-col">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-[24px] font-bold text-cyan-800 inter-font">Modify Product</h1>
          <button
            onClick={handleCloseAttempt}
            className="text-black rounded-full transition-colors hover:bg-black/5 active:bg-black/10"
            aria-label="Close dialog"
            disabled={isModifying}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>
          <section className="p-2 mb-2 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-base font-semibold text-black truncate max-w-[60%]">{selectedOrder.name}</h2>
              <p className="text-base font-semibold text-cyan-800 inter-font whitespace-nowrap">
                ₱{Number(selectedOrder.unitPrice).toFixed(2)} / {selectedOrder.unitSize} {pluralize(selectedOrder.selectUnit, Number(selectedOrder.unitSize))}
              </p>
            </div>
            {selectedOrder.note && (
              <div className="mb-2">
                <div
                  className={`text-sm text-gray-500 inter-font break-words  ${expanded ? "" : "line-clamp-1"
                    }`}
                >
                  {selectedOrder.note}
                </div>
                {showToggle && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs mt-1 text-cyan-600 hover:text-cyan-800 transition-colors cursor-pointer"
                  >
                    {expanded ? "Show less..." : "Show more..."}
                  </button>
                )}
              </div>
            )}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 inter-font whitespace-nowrap">Stock Available:</p>
              <p className="text-sm font-semibold text-black whitespace-nowrap">
                {roundTo(Number(selectedOrder.quantity), 2)} {pluralize(selectedOrder.selectUnit, Number(selectedOrder.quantity))}
              </p>
            </div>
          </section>
   
          <div className="flex-grow overflow-y-auto ">
            <div className="flex items-center mb-2">
              <label htmlFor="fleet-select" className="text-base font-bold text-black inter-font">Assign to Fleet</label>
            </div>
            <select
              id="fleet-select"
              value={fleet}
              onChange={(e) => handleFleetChange(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
            >
              {fleetOptions.map((fleetName) => (
                <option key={fleetName} value={fleetName}>{fleetName}</option>
              ))}
            </select>
            <div className="flex items-center mb-2">
              <label htmlFor="boat-select" className="text-base font-bold text-black inter-font">Assign to Boat</label>
            </div>
            <select
              id="boat-select"
              value={boat}
              onChange={(e) => handleBoatChange(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
            >
              {boatOptions.map((boatName) => (
                <option key={boatName} value={boatName}>{boatName}</option>
              ))}
            </select>
            <QuantitySelector
              value={quantity}
              onChange={handleQuantityChange}
              error={quantityError}
              required={false}
              maxQuantity={Number(maxAllowed)}
              unitSize={Number(selectedOrder.unitSize)}
            />
            <div className="mt-2">
            <SummarySection totalPrice={totalPrice} remainingStock={Number(remainingStock)} unit={selectedOrder.selectUnit} />
            </div> 
          </div>
          <div className="pl-1 flex gap-18 mt-2">
            <DeleteButton
              onClick={() => {
                if (selectedOrder) {
                  onRemove(selectedOrder.id);
                }
                setQuantityError("");
                setIsOpen(false);
              }
              }
              disabled={isModifying || isDeleting}
              isDeleting={isDeleting}
              className="text-s"
              title="Remove Item"
              message="Are you sure you want to remove this item from your order? This action cannot be undone."
              confirmButtonText="Remove Item"
            >
              Delete
            </DeleteButton>
            <div className="flex item-center justify-end">
              <Button
                type="button"
                className="text-s h-[3rem] w-[11rem]"
                disabled={isModifying}
                onClick={handleConfirm}
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={!isModifying ? handleCloseAttempt : undefined}
        aria-hidden="true"
      />

      <UnsavedChangesModal
        isOpen={isUnsavedChangesModalOpen}
        onClose={() => {
          setIsUnsavedChangesModalOpen(false);
          setQuantityError("");
        }}
        onConfirm={() => {
          setQuantityError("");
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default ModifyModal;
