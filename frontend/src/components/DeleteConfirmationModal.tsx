import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ClipLoader } from 'react-spinners';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isDeleting?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone. All values associated with this field will be lost.",
  confirmButtonText = "Delete field",
  cancelButtonText = "Cancel",
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="p-6 flex flex-col items-center">
          <div className="bg-red-100 rounded-full p-3 mb-4">
            <AlertTriangle className="text-red-500 h-6 w-6" />
          </div>

          <h2 className="text-xl font-semibold text-center mb-2">{title}</h2>
          <p className="text-gray-500 text-center mb-6">{message}</p>

          <div className="flex flex-col w-full gap-3">
            <button
              type="button"
              data-testid="confirm-removal-button"
              onClick={onConfirm}
              className={`w-full ${isDeleting ? "bg-red-500/60 text-white/60 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white cursor-pointer`"}  font-medium py-2 px-4 rounded transition-colors`}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center justify-center gap-2">
                  <ClipLoader color="#ffffff" size={20} className="mr-2" />
                  Updating...
                </div>
              ) : (
                `${confirmButtonText }`
              )}

            </button>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className={`w-full ${isDeleting ? 'bg-gray-200/30 text-gray-700/60 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer'}  font-medium py-2 px-4 rounded border border-gray-300 transition-colors `}
            >
              {cancelButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;