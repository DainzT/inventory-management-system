import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone. All values associated with this field will be lost.",
  confirmButtonText = "Delete field",
  cancelButtonText = "Cancel"
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
              onClick={onConfirm}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              {confirmButtonText}
            </button>
            <button 
              onClick={onClose}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded border border-gray-300 transition-colors"
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