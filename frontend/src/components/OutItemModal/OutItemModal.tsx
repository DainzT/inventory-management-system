
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import SelectField from "./SelectField";
import QuantitySelector from "./QuantitySelector";
import SummarySection from "./SummarySection";
import { InventoryItem, OrderItem } from "@/types";
import { MdAdd } from "react-icons/md";
import ItemDetails from "./ItemDetails";
import { ClipLoader } from "react-spinners";
import { UnsavedChangesModal } from "../EditProductModal/UnsavedChangesModal";
import { roundTo } from "@/utils/RoundTo";

interface OutItemModalProps {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedItem: InventoryItem | null;
  onOutItem: (outItem: OrderItem) => void;
  isAssigning?: boolean;
}

const OutItemModal: React.FC<OutItemModalProps> = ({
  isOpen,
  setIsOpen,
  selectedItem,
  onOutItem,
  isAssigning,
}) => {
  const [fleet, setFleet] = useState<string>("");
  const [boat, setBoat] = useState<string>("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const hasChanges = useMemo(() => {
    return !!fleet || !!boat || !!quantity;
  }, [fleet, boat, quantity]);
  
  const clearError = (field: string) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fleet) newErrors.fleet = "Please select a fleet.";
    if (fleet && !boat) newErrors.boat = "Please select a boat.";

    if (quantity === "" || Number(quantity) <= 0) {
      newErrors.quantity = "Please enter a valid quantity.";
    } else if (selectedItem && Number(quantity) > Number(selectedItem.quantity)) {
      newErrors.quantity = "Quantity cannot exceed available stock.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleFleetChange = (selectedFleet: string) => {
    setFleet(selectedFleet);
    setBoat("");
    clearError("fleet");
    clearError("boat");
  };

  const handleBoatChange = (selectedBoat: string) => {
    setBoat(selectedBoat);
    clearError("boat");
  };

  const handleQuantityChange = (newValue: number | "") => {
    setQuantity(newValue);
    clearError("quantity");
  };

  const handleAssign = async () => {

    if (!validateForm()) return;

    const remainingStock = Number(selectedItem?.quantity) - Number(quantity);

    const updatedTotalPrice =
      roundTo(Number(selectedItem?.unitPrice) * (remainingStock / Number(selectedItem?.unitSize)), 2);

    const outItem: OrderItem = {
      item_id: {
        ...selectedItem!,
        quantity: remainingStock,
        total: updatedTotalPrice,
        lastUpdated: new Date()
      },
      name: String(selectedItem?.name),
      note: String(selectedItem?.note),
      quantity: Number(quantity),
      unitPrice: Number(selectedItem?.unitPrice),
      selectUnit: String(selectedItem?.selectUnit),
      unitSize: Number(selectedItem?.unitSize),
      total: totalPrice,
      fleet_name: fleet,
      boat_name: boat,
      outDate: new Date(),
    };

    await onOutItem(outItem);

    setFleet("");
    setBoat("");
    setQuantity("");
  };

  const totalPrice = Number(selectedItem?.unitPrice) * (Number(quantity) / Number(selectedItem?.unitSize));
  const remainingStock = Number(selectedItem?.quantity) - Number(quantity);

  const handleCloseAttempt = () => {
    if (hasChanges) {
      setShowUnsavedModal(true);
    } else {
      setFleet("");
      setBoat("");
      setQuantity("");
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <section className="flex fixed inset-0 justify-center items-center">
      <article className="relative z-50 px-6 py-4 w-96 bg-white rounded-[19px] border-[1px] border-[#E0D8D8] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] animate-[fadeIn_0.2s_ease-out] h-[36rem]">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-[24px] font-bold text-cyan-800 inter-font">Out Product</h1>
          <button
            onClick={handleCloseAttempt}
            className="text-black rounded-full transition-colors hover:bg-black/5 active:bg-black/10"
            aria-label="Close dialog"
            disabled={isAssigning}
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

        {selectedItem && <ItemDetails item={selectedItem} />}
        <div className="mb-3">
          <SelectField
            label="Choose a fleet"
            placeholder="Select a fleet"
            value={fleet}
            onChange={handleFleetChange}
            options={fleetOptions}
            error={errors.fleet}
            disabled={isAssigning}
            required
          />
        </div>

        {fleet && (
          <div className="mb-3">
            <SelectField
              label="Choose a boat"
              placeholder="Select a boat"
              value={boat}
              onChange={handleBoatChange}
              options={boatOptions}
              error={errors.boat}
              disabled={!fleet || isAssigning}
            />
          </div>
        )}

        <div className="mb-3">
          <QuantitySelector
            value={quantity}
            onChange={handleQuantityChange}
            maxQuantity={Number(selectedItem?.quantity)}
            unitSize={Number(selectedItem?.unitSize)}
            error={errors.quantity}
            disabled={isAssigning}
          />
        </div>

        <SummarySection
          totalPrice={totalPrice}
          remainingStock={remainingStock}
          unit={selectedItem!.selectUnit}
        />

        <button
          onClick={handleAssign}
          className="
            flex absolute right-6 bottom-6 gap-2 justify-center items-center h-10 text-white
            bg-[#1B626E] rounded-md w-28 transition-colors hover:bg-[#297885] active:bg-[#145965] cursor-pointer
          "
          disabled={isAssigning}
        >
          {isAssigning ? (
            <div className="flex items-center justify-center">
              <ClipLoader color="#ffffff" size={20} className="mr-2" />
              Assigning...
            </div>
          ) : (
            <>
              <MdAdd />
              <span>Assign</span>
            </>
          )}
        </button>
      </article>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={!isAssigning ? handleCloseAttempt : undefined}
        aria-hidden="true"
      />
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onConfirm={() => {
          setShowUnsavedModal(false);
          setFleet("");
          setBoat("");
          setQuantity("");
          setIsOpen(false);
        }}
      />
    </section>
  );
};

export default OutItemModal;
