import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  LayoutDashboard,
  Search,
  Users,
  ListFilter,
  Globe,
  GraduationCap,
  FileText,
  BookOpen,
  DollarSign,
  Wallet,
  LogOut,
  Plane,
  Bell
} from 'lucide-react';

const AGENT_MENU_ITEMS = [
  { path: '/agent', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/agent/explore', icon: Search, label: 'Explore Products' },
  { path: '/agent/students', icon: Users, label: 'My Students' },
  { path: '/agent/leads', icon: ListFilter, label: 'Shortlisting Leads' },
  { path: '/agent/vas', icon: Globe, label: 'VAS Services' },
  { path: '/agent/admissions', icon: GraduationCap, label: 'Admissions' },
  { path: '/agent/applications', icon: FileText, label: 'Applications' },
  { path: '/agent/courses', icon: BookOpen, label: 'Course Finder' },
  { path: '/agent/commission', icon: DollarSign, label: 'Commission' },
  { path: '/agent/earnings', icon: Wallet, label: 'Earnings' }
];

export default function AgentLayout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]" data-testid="agent-layout">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm" data-testid="agent-sidebar">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-outfit font-bold text-gray-900">Fly8</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">WORKSPACE</p>
            </div>
          </div>
        </div>

        {/* Menu Label */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">MENU</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto" data-testid="agent-menu">
          {AGENT_MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path) && location.pathname !== '/agent';
            
            const isExactDashboard = item.exact && location.pathname === item.path;
            const finalActive = item.exact ? isExactDashboard : isActive;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-all group ${
                  finalActive 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                data-testid={`agent-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center gap-3">
                  {finalActive && (
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  )}
                  <Icon className={`w-5 h-5 ${finalActive ? 'text-emerald-600' : ''}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] text-center">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-emerald-600 font-medium">Agent</p>
            </div>
          </div>
          <Button 
            onClick={logout} 
            variant="ghost" 
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100" 
            size="sm"
            data-testid="agent-logout-button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 shadow-sm" data-testid="agent-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-outfit font-bold text-gray-900">Agent Dashboard</h2>
              <p className="text-gray-500 text-sm">Track your referrals and earnings</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  data-testid="agent-search"
                />
              </div>
              <Button variant="outline" size="icon" className="relative" data-testid="agent-notifications-icon">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
                  2
                </span>
              </Button>
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto bg-[#F8FAFC]">
          {children}
        </main>
      </div>
    </div>
  );
}
