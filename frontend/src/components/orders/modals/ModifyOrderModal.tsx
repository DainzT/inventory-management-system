import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { UnsavedChangesModal } from "../../shared/modals/UnsavedChangesModal";
import { ModifyOrderItem } from "@/types/modify-order-item";
import { Button } from "../../shared/buttons/Button";
import DeleteButton from "../../shared/buttons/DeleteButton";
import { ClipLoader } from "react-spinners";
import SummarySection from "../../shared/contents/SummarySection";
import { fixEncoding } from "@/utils/Normalization";
import QuantitySelector from "../../shared/fields/QuantitySelector";
import { pluralize } from "@/utils/Pluralize";
import { roundTo } from "@/utils/RoundTo";
import { toast } from "react-toastify";
import { Tooltip } from "../../shared/ToolTip";
import { BsArrowDown } from "react-icons/bs";

interface ModifyOrderModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedOrder: ModifyOrderItem | null;
  onModify: (
    id: number,
    quantity: number,
    fleet: string,
    boat: string
  ) => Promise<void>;
  onRemove: (id: number) => void;
  isDeleting: boolean;
  isModifying?: boolean;
  maxNoteLength?: number;
}

const ModifyOrderModal: React.FC<ModifyOrderModalProps> = ({
  isOpen,
  setIsOpen,
  onModify,
  onRemove,
  selectedOrder,
  isModifying,
  isDeleting,
  maxNoteLength = 35,
}) => {
  const [quantity, setQuantity] = useState<number | "">("");
  const [fleet, setFleet] = useState<string>("");
  const [boat, setBoat] = useState<string>("");
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] =
    useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [quantityError, setQuantityError] = useState("");
  const [fleetDropdownOpen, setFleetDropdownOpen] = useState(false);
  const [boatDropdownOpen, setBoatDropdownOpen] = useState(false);

  useEffect(() => {
    if (selectedOrder) {
      setQuantity(selectedOrder.quantity || 0);
      const fixedFleetName = fixEncoding(selectedOrder.fleet.fleet_name);
      setFleet(fixedFleetName);
      setBoat(selectedOrder.boat.boat_name);
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
          "F/B DONYA DONYA 2x",
          "F/B Lady Rachelle",
          "F/B Mariella",
          "F/B My Shield",
          "F/B Abigail",
          "F/B DC-9",
        ];
      case "F/B Doña Librada":
        return [
          "F/B Doña Librada",
          "F/B Adomar",
          "F/B Prince of Peace",
          "F/B Ruth Gaily",
          "F/V Vadeo Scout",
          "F/B Mariene",
        ];
      default:
        return [];
    }
  };
  const boatOptions = getBoatOptions(fleet);
  const fleetOptions = ["F/B DONYA DONYA 2x", "F/B Doña Librada"];

  const currentInventory = selectedOrder?.inventory?.quantity ?? 0;
  const originalOrderQty = selectedOrder?.quantity ?? 0;

  const remainingStock =
    selectedOrder?.inventory !== undefined
      ? Number(currentInventory) +
        Number(originalOrderQty) -
        Number(quantity || 0)
      : null;

  const maxAllowed =
    selectedOrder?.inventory !== undefined
      ? Number(currentInventory) + Number(originalOrderQty)
      : originalOrderQty;

  const handleFleetChange = (newFleet: string) => {
    setFleet(newFleet);
    const newBoatOptions = getBoatOptions(newFleet);
    if (!newBoatOptions.includes(boat)) {
      setBoat(newBoatOptions[0] || "");
    }
  };

  const handleConfirm = async () => {
    if (!hasChanges) {
        toast.info("No changes were made to the order", {
          position: 'bottom-right',
        });
        return;
    }

    if (quantity === "") {
        setQuantityError("Please enter a valid quantity.");
        return;
    }

    if (Number(quantity) < 0) {
        setQuantityError("Please enter a valid quantity.");
        return;
    }

    if (Number(quantity) > Number(maxAllowed)) {
        setQuantityError(
            selectedOrder?.inventory !== undefined
                ? `Cannot exceed available stock (${maxAllowed})`
                : `Cannot exceed original order quantity (${maxAllowed})`
        );
        return;
    }

    if (selectedOrder) {
        setQuantityError("");
        await onModify(selectedOrder.id, Number(quantity), fleet, boat);
        setIsOpen(false);
    }
  };

  const handleQuantityChange = (newValue: number | "") => {
    const numericValue = typeof newValue === "string" ? newValue.replace(/[^0-9.]/g, "") : newValue;

    if (numericValue === "") {
        setQuantity("");
        return;
    }

    const parsedValue = Number(numericValue);

    const roundedValue = parsedValue < 0 ? 0 : roundTo(parsedValue, 2);

    setQuantity(roundedValue);
};

  const handleCloseAttempt = () => {
    if (isModifying || isDeleting) return;
    setFleetDropdownOpen(false);
    setBoatDropdownOpen(false);
    if (hasChanges) {
      setIsUnsavedChangesModalOpen(true);
    } else {
      setIsOpen(false);
      setQuantityError("");
    }
  };

  if (!isOpen || !selectedOrder) return null;

  const totalPrice =
    Number(selectedOrder.unitPrice) *
    (Number(quantity) / Number(selectedOrder.unitSize));

  if (!selectedOrder) return;
  const getAdjustedMaxLength = (text: string) => {
    if (!text) return maxNoteLength;

    const totalLetters = text.replace(/[^a-zA-Z]/g, "").length;
    if (totalLetters === 0) return maxNoteLength;

    const upperCaseLetters = text.replace(/[^A-Z]/g, "").length;
    const upperCaseRatio = upperCaseLetters / totalLetters;

    if (upperCaseRatio === 0) return 35;
    if (upperCaseRatio >= 0.4 && upperCaseRatio < 0.5) return 32;
    if (upperCaseRatio >= 0.5) return 30;
    return maxNoteLength;
  };
  const adjustedMaxLength = getAdjustedMaxLength(selectedOrder.note);
  const shouldTruncate = selectedOrder.note.length > adjustedMaxLength;
  const truncatedNote = shouldTruncate
    ? `${selectedOrder.note.slice(0, adjustedMaxLength)}...`
    : selectedOrder.note;

  const truncateUnit = (unit: string) => {
    const maxLength = 7;
    return unit.length > maxLength ? `${unit.slice(0, maxLength)}…` : unit;
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 select-none">
      <div
        className="relative z-50 px-6 py-4 w-96 bg-white rounded-[19px] border-[1px] border-[#E0D8D8] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] animate-[fadeIn_0.2s_ease-out] h-[36rem]
        flex flex-col"
      >
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-[24px] font-bold text-cyan-800 inter-font">
            Edit Order
          </h1>
          <button
            onClick={handleCloseAttempt}
            className={`${
              isModifying || isDeleting
                ? "text-black/60 cursor-not-allowed"
                : "text-black active:bg-black/10 cursor-pointer"
            } hover:bg-black/5 rounded-full transition-colors `}
            aria-label="Close dialog"
            disabled={isModifying || isDeleting}
            data-testid="close-button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke={`${isModifying || isDeleting ? "gray" : "black"}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>
        <section className="p-2 mb-2 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-base font-semibold text-black truncate max-w-[60%]">
              {selectedOrder.name}
            </h2>
            <p className="text-base font-semibold text-cyan-800 inter-font whitespace-nowrap">
              ₱{Number(selectedOrder.unitPrice).toFixed(2)} /{" "}
              {selectedOrder.unitSize}{" "}
              {truncateUnit(pluralize(
                selectedOrder.selectUnit,
                Number(selectedOrder.unitSize)
              ))}
            </p>
          </div>
          {selectedOrder.note && (
            <div className="mb-2">
              {shouldTruncate ? (
                <Tooltip
                  content={selectedOrder.note.slice(
                    adjustedMaxLength,
                    selectedOrder.note.length
                  )}
                  position="bottom"
                >
                  <p className="text-sm text-gray-600 break-words cursor-pointer">
                    {truncatedNote}
                    <span className="inline-block ml-1 text-cyan-600">↗</span>
                  </p>
                </Tooltip>
              ) : (
                <p className="text-sm text-gray-600 break-words">
                  {selectedOrder.note}
                </p>
              )}
            </div>
          )}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 inter-font whitespace-nowrap">
              Stock Available:
            </p>
            <p className="text-sm font-semibold text-black whitespace-nowrap">
              {currentInventory == 0 && selectedOrder.inventory == null ? (
                <p className="text-xs font-semibold text-red-500">
                  This item no longer exists in inventory
                </p>
              ) : (
                <p className="text-sm font-semibold text-black">
                  {roundTo(Number(currentInventory), 2)}{" "}
                  {pluralize(
                    selectedOrder.selectUnit,
                    Number(currentInventory)
                  )}
                </p>
              )}
            </p>
          </div>
        </section>

        <div className="flex-grow overflow-y-auto ">
          <div className="flex items-center mb-2">
            <label
              htmlFor="fleet-select"
              className="text-base font-bold text-black inter-font"
            >
              Assign to Fleet
            </label>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setFleetDropdownOpen(!fleetDropdownOpen)}
              className={`
      flex justify-between items-center px-4 w-full h-12 rounded-lg border-[1px] 
      ${
        isModifying || isDeleting
          ? "cursor-not-allowed border-black bg-gray-100"
          : "border-accent-light bg-white"
      }
      transition-all duration-200
    `}
              disabled={isModifying || isDeleting}
              data-testid ="fleet-selector"
            >
              <span className="text-base text-black inter-font">
                {fixEncoding(fleet) || "Select a fleet"}
              </span>
              <BsArrowDown />
            </button>
            {fleetDropdownOpen && (
              <div className="absolute mt-2 w-full rounded-lg border border-red-100 bg-white shadow-lg z-50">
                <ul>
                  {fleetOptions.map((fleetName) => (
                    <li
                      key={fleetName}
                      onClick={() => {
                        handleFleetChange(fleetName);
                        setFleetDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer inter-font"
                      data-testid={`fleet-option-${fleetName}`}
                    >
                      {fleetName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center mb-2 mt-1">
            <label
              htmlFor="boat-select"
              className="text-base font-bold text-black inter-font"
            >
              Assign to Boat
            </label>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setBoatDropdownOpen(!boatDropdownOpen)}
              className={`
      flex justify-between items-center px-4 w-full h-12 rounded-lg border-[1px] 
      ${
        isModifying || isDeleting
          ? "cursor-not-allowed border-black bg-gray-100"
          : "border-accent-light bg-white"
      }
      transition-all duration-200
    `}
              disabled={isModifying || isDeleting}
              data-testid ="boat-selector"
            >
              <span className="text-base text-black inter-font">
                {fixEncoding(boat) || "Select a boat"}
              </span>
              <BsArrowDown />
            </button>
            {boatDropdownOpen && (
              <div className="fixed mt-2 w-84 rounded-lg border  border-red-100 bg-white shadow-lg z-50">
                <ul>
                  {boatOptions.map((boatName) => (
                    <li
                      key={boatName}
                      onClick={() => {
                        setBoat(boatName);
                        setBoatDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer inter-font"
                      data-testid={`boat-option-${boatName}`}
                    >
                      {boatName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <QuantitySelector
            value={quantity}
            onChange={handleQuantityChange}
            error={quantityError}
            required={false}
            maxQuantity={Number(maxAllowed)}
            unitSize={Number(selectedOrder.unitSize)}
            disabled={isModifying || isDeleting}
          />
          <div className={`${quantityError ? "mt-1" : "mt-2"}`}>
            <SummarySection
              totalPrice={totalPrice}
              remainingStock={Number(remainingStock)}
              unit={selectedOrder.selectUnit}
            />
          </div>
        </div>
        <div className="pl-1 flex gap-18 mt-2">
          <DeleteButton
            onClick={async () => {
              if (selectedOrder) {
                await onRemove(selectedOrder.id);
              }
              setQuantityError("");
              setIsOpen(false);
            }}
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
              disabled={isModifying || isDeleting}
              onClick={handleConfirm}
            >
              {isModifying || isDeleting ? (
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
          setIsUnsavedChangesModalOpen(false);
          setQuantityError("");
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default ModifyOrderModal;
