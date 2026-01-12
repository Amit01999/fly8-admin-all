import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { 
  LayoutDashboard, 
  Grid3x3, 
  CheckCircle2, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut,
  Bell,
  Plane
} from 'lucide-react';

const MENU_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboard/services', icon: Grid3x3, label: 'Explore Services' },
  { path: '/dashboard/track', icon: CheckCircle2, label: 'Track Services' },
  { path: '/dashboard/profile', icon: User, label: 'My Profile' },
  { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  { path: '/dashboard/help', icon: HelpCircle, label: 'Help & Support' }
];

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]" data-testid="dashboard-layout">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col" data-testid="dashboard-sidebar">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-journey-visa rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-outfit font-bold">Fly8</h1>
              <p className="text-xs text-gray-500">Student Portal</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1" data-testid="dashboard-menu">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                data-testid={`menu-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-journey-profile to-journey-preapp rounded-full flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button 
            onClick={logout} 
            variant="outline" 
            className="w-full justify-start" 
            size="sm"
            data-testid="logout-button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4" data-testid="dashboard-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-outfit font-bold text-gray-900">Welcome back, {user?.firstName}!</h2>
              <p className="text-gray-600">Track your study abroad journey</p>
            </div>
            <Button variant="outline" size="icon" className="relative" data-testid="notifications-button">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>
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