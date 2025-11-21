/**
 * Modal component for displaying dialogs
 * Used to show "Not implemented" messages for edit/delete actions
 */

import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ isOpen, onClose, title, message, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-opacity-70"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none"
          aria-label="Close modal"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-blue-500 dark:text-blue-400 text-2xl"
              aria-hidden="true"
            />
          </div>
          <div className="flex-1">
            {title && (
              <h3 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
            )}
            {message && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{message}</p>
            )}
            {children}
            <button
              onClick={onClose}
              className="mt-4 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;



