import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogOut, Moon, Sun, LayoutDashboard, Users } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden md:flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-xl font-bold text-brand-600 dark:text-brand-400">GigFlow</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <a href="/" className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-brand-50 dark:bg-slate-700 text-brand-700 dark:text-brand-300">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </a>
        <a href="/" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
          <Users size={20} />
          <span>Leads</span>
        </a>
      </nav>
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
      <div className="flex items-center md:hidden">
        <h1 className="text-xl font-bold text-brand-600 dark:text-brand-400">GigFlow</h1>
      </div>
      <div className="hidden md:block">
        <span className="text-slate-600 dark:text-slate-300 font-medium">Smart Leads Dashboard</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-700 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
            <div className="flex items-center gap-2 justify-end">
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
              {user?.role === 'Sales User' && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  View & Edit Only
                </span>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export const Layout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
