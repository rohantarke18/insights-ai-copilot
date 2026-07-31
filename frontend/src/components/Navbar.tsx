import React from 'react';
import { Sparkles, LayoutDashboard, Search, FolderKanban, BookOpen, Plus, Sun, Moon, History, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentView: 'dashboard' | 'input' | 'deepsearch' | 'projecthub' | 'workspaces';
  onNavigate: (view: 'dashboard' | 'input' | 'deepsearch' | 'projecthub' | 'workspaces') => void;
  activeSessionId?: string | null;
  activeSessionTitle?: string | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenSidebar: () => void;
  user: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeSessionId,
  activeSessionTitle,
  theme,
  onToggleTheme,
  onOpenSidebar,
  user,
  onOpenLogin,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-[#E7E2D8] dark:border-[#2E2E2E] transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 rounded-sm bg-[#1A1A1A] dark:bg-[#C85A17] flex items-center justify-center text-[#FAF9F5] font-serif font-bold text-lg group-hover:bg-[#C85A17] transition-colors">
                i
              </div>
              <div>
                <span className="font-serif font-bold text-xl tracking-tight text-[#1A1A1A] dark:text-[#E6E2D8] block leading-none">
                  iNSIGHTS
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#706B63] dark:text-[#A09A8E] block mt-0.5">
                  Research Copilot
                </span>
              </div>
            </button>

            {/* Breadcrumb if active session */}
            {activeSessionId && activeSessionTitle && (
              <div className="hidden xl:flex items-center space-x-2 border-l border-[#E7E2D8] dark:border-[#2E2E2E] pl-4 text-xs text-[#706B63] dark:text-[#A09A8E]">
                <span className="font-mono text-[10px]">SESSION:</span>
                <span className="font-medium text-[#1A1A1A] dark:text-[#E6E2D8] truncate max-w-[180px]" title={activeSessionTitle}>
                  {activeSessionTitle}
                </span>
              </div>
            )}
          </div>

          {/* Main Navigation Links */}
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm text-xs font-mono font-medium transition-colors cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-[#1A1A1A] dark:bg-[#C85A17] text-[#FAF9F5]'
                  : 'text-[#524E48] dark:text-[#A09A8E] hover:text-[#1A1A1A] dark:hover:text-[#FAF9F5] hover:bg-[#EFECE6] dark:hover:bg-[#242422]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('input')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm text-xs font-mono font-medium transition-colors cursor-pointer ${
                currentView === 'input'
                  ? 'bg-[#1A1A1A] dark:bg-[#C85A17] text-[#FAF9F5]'
                  : 'text-[#524E48] dark:text-[#A09A8E] hover:text-[#1A1A1A] dark:hover:text-[#FAF9F5] hover:bg-[#EFECE6] dark:hover:bg-[#242422]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Idea</span>
            </button>

            {activeSessionId && (
              <>
                <button
                  onClick={() => onNavigate('deepsearch')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm text-xs font-mono font-medium transition-colors cursor-pointer ${
                    currentView === 'deepsearch'
                      ? 'bg-[#1A1A1A] dark:bg-[#C85A17] text-[#FAF9F5]'
                      : 'text-[#524E48] dark:text-[#A09A8E] hover:text-[#1A1A1A] dark:hover:text-[#FAF9F5] hover:bg-[#EFECE6] dark:hover:bg-[#242422]'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">DeepSearch</span>
                </button>

                <button
                  onClick={() => onNavigate('projecthub')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm text-xs font-mono font-medium transition-colors cursor-pointer ${
                    currentView === 'projecthub'
                      ? 'bg-[#1A1A1A] dark:bg-[#C85A17] text-[#FAF9F5]'
                      : 'text-[#524E48] dark:text-[#A09A8E] hover:text-[#1A1A1A] dark:hover:text-[#FAF9F5] hover:bg-[#EFECE6] dark:hover:bg-[#242422]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Plan</span>
                </button>
              </>
            )}

            <button
              onClick={() => onNavigate('workspaces')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-sm text-xs font-mono font-medium transition-colors cursor-pointer ${
                currentView === 'workspaces'
                  ? 'bg-[#1A1A1A] dark:bg-[#C85A17] text-[#FAF9F5]'
                  : 'text-[#524E48] dark:text-[#A09A8E] hover:text-[#1A1A1A] dark:hover:text-[#FAF9F5] hover:bg-[#EFECE6] dark:hover:bg-[#242422]'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Workspaces</span>
            </button>
          </nav>

          {/* Right Action Controls: History Sidebar, Theme Toggle, Login */}
          <div className="flex items-center space-x-2">
            
            {/* History Sidebar Button */}
            <button
              onClick={onOpenSidebar}
              title="Open Research Session History"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-[#EFECE6] dark:bg-[#242422] hover:bg-[#1A1A1A] hover:text-[#FAF9F5] dark:hover:bg-[#C85A17] text-[#1A1A1A] dark:text-[#E6E2D8] text-xs font-mono rounded-sm transition-colors cursor-pointer border border-[#E7E2D8] dark:border-[#333]"
            >
              <History className="w-3.5 h-3.5 text-[#C85A17] dark:text-[#FAF9F5]" />
              <span className="hidden md:inline font-medium">History</span>
            </button>

            {/* Light/Dark Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-1.5 bg-[#EFECE6] dark:bg-[#242422] hover:bg-[#D8D2C6] dark:hover:bg-[#333] text-[#1A1A1A] dark:text-[#E6E2D8] rounded-sm transition-colors cursor-pointer border border-[#E7E2D8] dark:border-[#333]"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-[#1A1A1A]" />
              ) : (
                <Sun className="w-4 h-4 text-[#FFB800]" />
              )}
            </button>

            {/* User Login / Account Button */}
            {user ? (
              <div className="flex items-center space-x-1 bg-[#F4F1EA] dark:bg-[#242422] border border-[#E7E2D8] dark:border-[#333] p-1 rounded-sm">
                <div className="px-2 py-0.5 text-[11px] font-mono">
                  <span className="font-bold text-[#1A1A1A] dark:text-[#E6E2D8] block leading-tight">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-[#C85A17] uppercase block font-bold">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1 text-[#706B63] dark:text-[#A09A8E] hover:text-red-600 dark:hover:text-red-400 rounded-xs cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#C85A17] hover:bg-[#A6470F] text-[#FAF9F5] text-xs font-mono font-medium rounded-sm transition-colors shadow-xs cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

