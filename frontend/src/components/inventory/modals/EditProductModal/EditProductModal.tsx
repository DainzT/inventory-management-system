import { Dispatch, SetStateAction, useState } from "react";
import { InventoryItem } from "@/types";
import EditProductForm from "./EditProductForm";
import { UnsavedChangesModal } from "../../../shared/modals/UnsavedChangesModal";

interface EditProductModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    selectedItem: InventoryItem | null;
    onDeleteItem: (id: number) => void;
    onEditItem: (editItem: InventoryItem) => void;
    isEditing: boolean;
    isDeleting: boolean;
}

const EditProductModal = ({
    isOpen,
    setIsOpen,
    selectedItem,
    onEditItem,
    onDeleteItem,
    isEditing,
    isDeleting,
}: EditProductModalProps) => {
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const handleCloseAttempt = () => {
        if (hasChanges) {
            setShowUnsavedModal(true);
        } else {
            setIsOpen(false);
        }
    };

    if (!isOpen || !selectedItem) return null;

    return (
        <section className="flex z-50 fixed inset-0 justify-center items-center ">
            <article
                className="relative z-50 px-6 py-4 w-96 bg-white rounded-[19px] border-[1px] border-[#E0D8D8] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] animate-[fadeIn_0.2s_ease-out] h-[36rem]"
            >
                <header className="flex justify-between items-center">
                    <h1 className="text-[24px] font-bold text-[#1B626E] inter-font">
                        Edit Product
                    </h1>
                    <button
                        onClick={handleCloseAttempt}
                        className={`${isEditing ? "text-black/60 cursor-not-allowed": "text-black active:bg-black/10 cursor-pointer"} hover:bg-black/5 rounded-full transition-colors `}
                        aria-label="Close dialog"
                        disabled={isEditing}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke={`${isEditing ? "gray":"black"}`}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </header>
                <div className="h-[1px] bg-[#E0D8D8] my-1" />
                <EditProductForm
                    onSubmit={onEditItem}
                    onDelete={(deleteItem) => {
                        onDeleteItem(deleteItem.id);
                    }}
                    initialData={selectedItem}
                    onFormChange={setHasChanges}
                    isEditing={isEditing}
                    isDeleting={isDeleting}
                />
            </article>
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity "
                onClick={!isEditing ? handleCloseAttempt : undefined}
                aria-hidden="true"
            />
            <UnsavedChangesModal
                isOpen={showUnsavedModal}
                onClose={() => setShowUnsavedModal(false)}
                onConfirm={() => {
                    setShowUnsavedModal(false);
                    setIsOpen(false);
                }}
            />
        </section>
    );
};

export default EditProductModal;