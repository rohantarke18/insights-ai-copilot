import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { IdeaInputScreen } from './components/IdeaInputScreen';
import { DeepSearchView } from './components/DeepSearchView';
import { ProjectHubView } from './components/ProjectHubView';
import { WorkspacesView } from './components/WorkspacesView';
import { SaveToWorkspaceModal } from './components/SaveToWorkspaceModal';
import { LoginModal } from './components/LoginModal';
import { SessionSidebar } from './components/SessionSidebar';
import { Source, User, ResearchSession } from './types';
import { getDashboardData, DEFAULT_USER_ID } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'input' | 'deepsearch' | 'projecthub' | 'workspaces'>('dashboard');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSessionTitle, setActiveSessionTitle] = useState<string | null>(null);
  const [saveModalSource, setSaveModalSource] = useState<Source | null>(null);

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Login & User state
  const [user, setUser] = useState<User | null>({
    id: 'user-aarya',
    name: 'Aarya Deshpande',
    email: 'aarya.deshpande231@vit.edu',
    role: 'Senior AI Researcher'
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Sidebar history state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allSessions, setAllSessions] = useState<ResearchSession[]>([]);

  // Toggle Theme
  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

  // Fetch session history list
  const loadSessions = async () => {
  try {
    const data = await getDashboardData(DEFAULT_USER_ID);
    setAllSessions(data.sessions);
  } catch (e) {
    console.error('Failed to load sessions history', e);
  }
};

  useEffect(() => {
    loadSessions();
  }, [user]);

  const handleNavigate = (view: 'dashboard' | 'input' | 'deepsearch' | 'projecthub' | 'workspaces') => {
    setCurrentView(view);
  };

  const handleSessionCreated = (sessionId: string, ideaText: string) => {
    setActiveSessionId(sessionId);
    setActiveSessionTitle(ideaText);
    setCurrentView('deepsearch');
    loadSessions();
  };

  const handleSelectSession = (sessionId: string, ideaText: string, targetView: 'deepsearch' | 'projecthub') => {
    setActiveSessionId(sessionId);
    setActiveSessionTitle(ideaText);
    setCurrentView(targetView);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#E6E2D8] flex flex-col font-sans selection:bg-[#C85A17]/20 selection:text-[#C85A17] transition-colors">
      
      {/* Top Editorial Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        activeSessionId={activeSessionId}
        activeSessionTitle={activeSessionTitle}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSidebar={() => {
          loadSessions();
          setIsSidebarOpen(true);
        }}
        user={user}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={() => setUser(null)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <DashboardView
            onNewIdea={() => setCurrentView('input')}
            onSelectSession={handleSelectSession}
            onNavigateToWorkspaces={() => setCurrentView('workspaces')}
          />
        )}

        {currentView === 'input' && (
          <IdeaInputScreen
            onSessionCreated={handleSessionCreated}
          />
        )}

        {currentView === 'deepsearch' && activeSessionId && (
          <DeepSearchView
            sessionId={activeSessionId}
            ideaText={activeSessionTitle || undefined}
            onNavigateToPlan={() => setCurrentView('projecthub')}
            onOpenSaveModal={(src) => setSaveModalSource(src)}
          />
        )}

        {currentView === 'projecthub' && activeSessionId && (
          <ProjectHubView
            sessionId={activeSessionId}
            ideaText={activeSessionTitle || undefined}
            onNavigateToSearch={() => setCurrentView('deepsearch')}
          />
        )}

        {currentView === 'workspaces' && (
          <WorkspacesView
            onOpenNewIdea={() => setCurrentView('input')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7E2D8] dark:border-[#2E2E2E] bg-[#F4F1EA] dark:bg-[#1A1A1A] py-6 text-xs text-[#706B63] dark:text-[#A09A8E] font-mono no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-[#1A1A1A] dark:text-[#E6E2D8]">iNSIGHTS</span>
            <span>—</span>
            <span>AI Research & Innovation Copilot</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>arXiv • IEEE • GitHub • PubMed</span>
            <span>•</span>
            <span className="text-[#C85A17]">100% Citation Verifiable</span>
          </div>
        </div>
      </footer>

      {/* Save Source to Workspace Modal */}
      {saveModalSource && (
        <SaveToWorkspaceModal
          source={saveModalSource}
          onClose={() => setSaveModalSource(null)}
          onSaved={() => {
            // Optional callback on save complete
          }}
        />
      )}

      {/* Login / Signup Modal */}
      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setIsLoginOpen(false);
          }}
        />
      )}

      {/* Research Session History Drawer Sidebar */}
      <SessionSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={allSessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewIdea={() => setCurrentView('input')}
      />

    </div>
  );
}

