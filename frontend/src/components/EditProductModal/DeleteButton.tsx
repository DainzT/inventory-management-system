import { useState } from "react";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

interface DeleteButtonProps {
    children?: React.ReactNode; 
    onClick?: () => void; 
    className?: string;
    disabled?: boolean;
    isDeleting: boolean;
  }

export const DeleteButton = ({
    children,
    className,
    onClick,
    disabled = false,
    isDeleting = false,
}: DeleteButtonProps) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const handleConfirm = () => {
      onClick?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className={`
            flex items-center gap-[2px] px-[10px]   
            text-red-500 rounded-[4px] font-medium transition-transform
            hover:translate-y-[-1px] text-sm
            hover:outline-1 cursor-pointer
            hover:outline-[#CE303F] 
            ${className}
        `}
        disabled={disabled}
      >
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M2.15381 3.96552H13.1538M12.0427 3.96552V11.8448C12.0427 12.8362 11.4871 13.8276 10.9316 13.8276H5.376C4.82048 13.8276 4.26492 12.8362 4.26492 11.8448V3.96552M5.4316 3.96552V2.98276C5.4316 1.99138 5.98716 1 6.54272 1H9.76494C10.3205 1 10.876 1.99138 10.876 2.98276V3.96552M6.54272 6.9224V10.8707M9.76494 6.9224V10.8707"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
        {children}
      </button>

      <DeleteConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        isDeleting={isDeleting}
        disabled={isDeleting}
      />
    </>
  );
};

export default DeleteButton;