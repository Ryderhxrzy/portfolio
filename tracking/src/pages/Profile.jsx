/**
 * Profile page component
 * Simple profile panel showing user information
 * 
 * TODO: Replace with real API calls for fetching and updating profile
 * TODO: Add profile picture upload functionality
 * TODO: Add password change functionality
 * TODO: Add account settings
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { useState } from 'react';

const Profile = () => {
  const { user } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = () => {
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Profile" />
      
      <main className="p-4 sm:p-6 pb-16 sm:pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div
                className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold"
                aria-label={`User avatar for ${user.name}`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {user.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                aria-label="Edit profile"
              >
                <FontAwesomeIcon icon={faEdit} />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-green-600 dark:text-green-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email Address</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is a demo profile. In a real application, you would be able to update your
                profile information, change your password, and manage account settings.
              </p>
            </div>
          </div>
        </div>

        {/* Modal for edit action */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Edit Profile"
          message="Edit functionality not implemented — dummy UI only. In a real application, this would allow you to update your profile information."
        />
      </main>
    </div>
  );
};

export default Profile;

