import { Dispatch, SetStateAction } from "react";
import AddProductForm from "./AddProductForm";
import { ItemFormData } from "@/types";

interface AddProductModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onAddItem: (product: ItemFormData) => void;
}

const AddProductModal = ({ 
    isOpen, 
    setIsOpen,
    onAddItem, 
}: AddProductModalProps) => {
    if (!isOpen) return null;

    return (
        <section className="flex fixed inset-0 justify-center items-center">  
            <article 
                className="relative z-50 px-6 py-4 w-96 bg-white rounded-[19px] border-[1px] border-[#E0D8D8] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] animate-[fadeIn_0.2s_ease-out] h-[36rem]"
            >
                <header className="flex justify-between items-center">
                    <h1 className="text-[24px] font-bold text-[#1B626E] inter-font">
                        Add Product
                    </h1>
                    <button
                    onClick={() => setIsOpen(false)}
                    className="text-black rounded-full transition-colors hover:bg-black/5 active:bg-black/10"
                    aria-label="Close dialog"
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
                <div className="h-[1px] bg-[#E0D8D8] my-1"/>
                    <AddProductForm
                        onCancel={() => setIsOpen(false)}
                        onSubmit={onAddItem}
                />
            </article>
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />
        </section>
    );
};

export default AddProductModal;