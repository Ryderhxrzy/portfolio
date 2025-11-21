/**
 * App Layout component
 * Wraps app routes with Sidebar and provides main content area
 * Only renders for authenticated routes
 */

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;



