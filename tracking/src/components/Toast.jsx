/**
 * Toast notification component for showing messages
 * Used to display "Not implemented" messages for dummy actions
 */

import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const Toast = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[300px] max-w-md animate-slide-up"
      role="alert"
      aria-live="polite"
    >
      <FontAwesomeIcon
        icon={faInfoCircle}
        className="text-blue-500 dark:text-blue-400 flex-shrink-0"
        aria-hidden="true"
      />
      <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none"
        aria-label="Close notification"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default Toast;



