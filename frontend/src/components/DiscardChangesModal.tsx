import React from 'react';
import { X } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onDiscard: () => void;
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onCancel,
  onDiscard,
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="p-6 flex flex-col items-center">
          <div className="bg-red-100 rounded-full p-3 mb-4">
            <X className="text-red-500 h-6 w-6" />
          </div>
          
          <h2 className="text-xl font-semibold text-center mb-2">Discard changes</h2>
          <p className="text-gray-500 text-center mb-6">
            You have made changes that haven't been saved yet. Are you sure to discard changes?
          </p>
          
          <div className="flex w-full gap-4">
            <button 
              onClick={onCancel}
              className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 px-4 rounded transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onDiscard}
              className="flex-1 bg-white hover:bg-gray-50 text-teal-700 font-medium py-3 px-4 rounded border border-teal-700 transition-colors"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal;
