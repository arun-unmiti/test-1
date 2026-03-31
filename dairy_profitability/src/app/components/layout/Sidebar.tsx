import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import {
  LayoutDashboard, Users, Database, Settings, LogOut,
  ChevronDown, ChevronRight, Milk, BarChart3, UserCircle, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    children: [
      { label: 'Overview', path: '/dashboard' },
      { label: 'Farmer Profile', path: '/dashboard/farmer-profile' },
    ],
  },
  {
    label: 'Data Management',
    icon: <Database className="h-5 w-5" />,
    path: '/data-management',
  },
  {
    label: 'User Management',
    icon: <Users className="h-5 w-5" />,
    path: '/user-management',
  },
  {
    label: 'Configuration',
    icon: <Settings className="h-5 w-5" />,
    path: '/configuration',
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Dashboard']);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (item: NavItem) =>
    item.children?.some(c => location.pathname === c.path) || false;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'supervisor': return 'bg-blue-100 text-blue-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'supervisor': return 'Supervisor';
      case 'field_officer': return 'Field Officer';
      default: return role;
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-green-700">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Milk className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">DairyPro</p>
              <p className="text-green-200 text-xs">Advisory Platform</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isParentActive(item)
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isParentActive(item) ? 'text-green-600' : 'text-gray-500'}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {expandedItems.includes(item.label)
                      ? <ChevronDown className="h-4 w-4 text-gray-400" />
                      : <ChevronRight className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                  {expandedItems.includes(item.label) && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive(child.path)
                              ? 'bg-green-600 text-white font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {child.label === 'Overview'
                            ? <BarChart3 className="h-4 w-4" />
                            : <UserCircle className="h-4 w-4" />
                          }
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path!}
                  onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                  className={({ isActive: active }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      active
                        ? 'bg-green-600 text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {({ isActive: active }) => (
                    <>
                      <span className={active ? 'text-white' : 'text-gray-500'}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="border-t border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${getRoleColor(user?.role || '')}`}>
                {getRoleLabel(user?.role || '')}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
