import { useState } from 'react';
import { Outlet, Navigate } from 'react-router';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';

export function Layout() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <span>Last updated:</span>
              <span className="text-gray-800 font-medium">Mar 5, 2026</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
