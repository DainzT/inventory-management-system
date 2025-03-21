import { Dispatch, SetStateAction } from "react";
import AddProductForm from "./AddProductForm";
import { ProductFormData } from "@/types";

interface AddProductModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const AddProductModal = ({ 
    isOpen, 
    setIsOpen 
}: AddProductModalProps) => {
    if (!isOpen) return null;

    const handleSubmit = (data: ProductFormData) => {
        console.log("Form submitted:", data);
        setIsOpen(false);
    };

    return (
        <>
            <section className="fixed inset-0 z-50  scale-80 flex items-center justify-center inter-font">  
                <div 
                    className="relative z-50 w-[450px] bg-white rounded-[19px] border-[1px] border-[#E0D8D8] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] animate-[fadeIn_0.2s_ease-out]"
                >
                    <div className="p-[32px]">
                        <header className="flex justify-between items-center">
                            <h2 className="text-[24px] font-bold text-[#1B626E] inter-font">
                                Add Product
                            </h2>
                            <button
                            onClick={() => setIsOpen(false)}
                            className="text-black p-1 rounded-full transition-colors hover:bg-black/5 active:bg-black/10"
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
                        <div className="h-[1px] bg-[#E0D8D8] my-4"/>
                            <AddProductForm
                                onCancel={() => setIsOpen(false)}
                                onSubmit={handleSubmit}
                            />
                        </div>
                    </div>
            </section>
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />
        </>
    );
};

export default AddProductModal;