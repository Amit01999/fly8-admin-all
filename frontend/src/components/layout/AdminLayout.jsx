import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  LayoutDashboard, 
  Bell, 
  Users, 
  UserPlus, 
  UserCheck,
  FileText, 
  Settings as SettingsIcon, 
  LogOut,
  Plane
} from 'lucide-react';

const ADMIN_MENU_ITEMS = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/notifications', icon: Bell, label: 'Notifications', badge: 5 },
  { path: '/admin/students', icon: Users, label: 'Manage Students' },
  { path: '/admin/counselors', icon: UserCheck, label: 'Manage Counselors' },
  { path: '/admin/agents', icon: UserPlus, label: 'Manage Agents' },
  { path: '/admin/assignments', icon: FileText, label: 'Assignments' },
  { path: '/admin/settings', icon: SettingsIcon, label: 'Settings' }
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-50" data-testid="admin-layout">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col" data-testid="admin-sidebar">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-outfit font-bold">Fly8</h1>
              <p className="text-xs text-slate-400">Education Platform</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1" data-testid="admin-menu">
          {ADMIN_MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                data-testid={`admin-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge className="bg-red-500 text-white text-xs px-2">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3 p-3 bg-slate-700/50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-white">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-red-400 font-semibold">Super Admin</p>
            </div>
          </div>
          <Button 
            onClick={logout} 
            variant="outline" 
            className="w-full justify-start bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white" 
            size="sm"
            data-testid="admin-logout-button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm" data-testid="admin-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-outfit font-bold text-gray-900">Admin Dashboard</h2>
              <p className="text-gray-600 text-sm">Manage your platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="relative" data-testid="admin-notifications-icon">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  5
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}