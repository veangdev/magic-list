import { Modal } from "../common/Modal";

interface ConfirmDeletePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

export function ConfirmDeletePopup({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}: ConfirmDeletePopupProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    // onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={taskTitle} size="md">
      <div>
        <div
          className="bg-white dark:bg-gray-800 rounded-lg 
           p-6 w-full max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete the task?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-white bg-error-600 dark:bg-error-500 rounded-md hover:bg-error-700 dark:hover:bg-error-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
