import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { UnsavedChangesModal } from "../EditProductModal/UnsavedChangesModal";
import { ModifyOrderItem } from "@/types/modify-order-item";
import { Button } from "../AddProductModal/Button";
import DeleteButton from "../EditProductModal/DeleteButton";
import { ClipLoader } from "react-spinners";
import { pluralize } from "@/utils/Pluralize";
import SummarySection from "../OutItemModal/SummarySection";
import { fixEncoding } from "@/utils/Normalization";
import QuantitySelector from "../OutItemModal/QuantitySelector";
import { useDeleteOrder } from "@/hooks/useDeleteOrder";
import { toast } from "react-toastify";

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
  isDeleting,
  isModifying = false 
}) => {
  const [quantity, setQuantity] = useState<number | "">("");
  const [fleet, setFleet] = useState<string>("");
  const [boat, setBoat] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [quantityError, setQuantityError] = useState("");
  const { deleteOrderItem, isDeleting: hookIsDeleting, error: deleteError } = useDeleteOrder();

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
        return ["F/B DONYA DONYA 2x", "F/B Lady Rachelle", "F/B Mariella", "F/B My Shield", "F/B Abigail", "F/B DC-9"];
      case "F/B Doña Librada":
        return ["F/B Doña Librada", "F/B Adomar", "F/B Prince of Peace", "F/B Ruth Gaily", "F/V Vadeo Scout", "F/B Mariene"];
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
      setHasChanges(true);
    };
    
    const handleBoatChange = (newBoat: string) => {
      setBoat(newBoat);
      setHasChanges(true);
    };
    

    const handleConfirm = async () => {
      if (quantity === "" || Number(quantity) < 0) {
        setQuantityError("Please enter a valid quantity");
        return;
      }
    
      if (selectedOrder?.inventory !== undefined && Number(quantity) > Number(maxAllowed)) {
        setQuantityError(`Cannot exceed available stock (${maxAllowed})`);
        return;
      }
    
      if (!fleet || !boat) {
        toast.error("Please select both fleet and boat");
        return;
      }
    
      setQuantityError("");
    
      try {
        await onModify(Number(quantity), fleet, boat);

        setIsOpen(false);
      } catch (error) {
        console.error("Error confirming changes:", error);
        toast.error("Failed to update item. Please try again.");
      }
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

  const handleRemove = async (id: number) => {
    const result = await deleteOrderItem(id);
    if (result.success) {
      toast.success("Item removed successfully.");
      onRemove(id);
      setIsOpen(false);
    } else {
      toast.error(result.error || "Failed to remove item.");
    }
  };

  if (!isOpen || !selectedOrder) return null;

  const totalPrice = Number(selectedOrder.unitPrice) * (Number(quantity) / Number(selectedOrder.unitSize));

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="relative z-50 px-6 py-4 w-96 bg-white rounded-[19px] border-[1px] border-[#E0D8D8] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] animate-[fadeIn_0.2s_ease-out] h-[36rem]">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-[24px] font-bold text-cyan-800 inter-font">Edit Order</h1>
          <button
            onClick={handleCloseAttempt}
            className="text-black rounded-full transition-colors hover:bg-black/5 active:bg-black/10"
            aria-label="Close dialog"
            disabled={isModifying}
            data-testid="close-button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>
        <div className="flex flex-col flex-grow gap-4 overflow-y-auto">
          <section className="p-2 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-base font-semibold text-black">{selectedOrder.name}</h2>
              <p className="text-base font-semibold text-cyan-800 inter-font" data-testid="price-display">
                ₱{Number(selectedOrder.unitPrice).toFixed(2)} / {selectedOrder.unitSize} {pluralize(selectedOrder.selectUnit, Number(selectedOrder.unitSize))}
              </p>
            </div>
            <p className="mb-2 text-sm text-gray-500 inter-font">{selectedOrder.note}</p>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 inter-font">Stock Available:</p>
              <p className="text-sm font-semibold text-black">
                {currentInventory === 0 ? (
                  <span className="text-xs font-semibold text-red-500">This item no longer exists in inventory</span>
                ) : (
                  <span className="text-sm font-semibold text-black">
                    {currentInventory} {pluralize(selectedOrder.selectUnit, Number(currentInventory))}
                  </span>
                )}
              </p>
            </div>
          </section>
          <div>
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
          </div>
          <QuantitySelector
            value={quantity}
            onChange={handleQuantityChange}
            error={quantityError}
            required={false}
            maxQuantity={Number(maxAllowed)}
            unitSize={Number(selectedOrder.unitSize)}
          />
          <SummarySection totalPrice={totalPrice} remainingStock={Number(remainingStock)} unit={selectedOrder.selectUnit} />
          <div className="pl-1 flex gap-18">
            <DeleteButton
              onClick={() => {
                if (selectedOrder) {
                  handleRemove(selectedOrder.id);
                }
                setIsDeleteModalOpen(false);
                setQuantityError("");
              }}
              className="text-s"
              isDeleting={hookIsDeleting}
              title="Remove Item"
              message="Are you sure you want to remove this item from your order? This action cannot be undone."
              confirmButtonText="Remove Item"
              data-testid="delete-button"
            >
              Delete
            </DeleteButton>
            <div className="flex item-center justify-end">
            <Button
              type="button"
              className="text-s h-[3rem] w-[11rem]"
              disabled={isModifying}
              onClick={async () => {
                try {
                  await handleConfirm();
                } catch (error) {
                  console.error("Error confirming changes:", error);
                }
              }}
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
          setIsUnsavedChangesModalOpen(false);
          setQuantityError("");
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default ModifyModal;
