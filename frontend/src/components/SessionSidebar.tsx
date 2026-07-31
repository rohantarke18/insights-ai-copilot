import React, { useState } from 'react';
import {
  X,
  Search,
  Plus,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Filter,
  Trash2,
  ExternalLink,
  Layers
} from 'lucide-react';
import { ResearchSession } from '../types';

interface SessionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ResearchSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string, ideaText: string, targetView: 'deepsearch' | 'projecthub') => void;
  onNewIdea: () => void;
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewIdea
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.ideaText.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterMode === 'active') return matchesSearch && s.status === 'processing';
    if (filterMode === 'completed') return matchesSearch && s.status === 'completed';
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#1A1A1A]/50 dark:bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] dark:bg-[#181818] border-l-2 border-[#1A1A1A] dark:border-[#333] shadow-2xl flex flex-col font-sans">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E7E2D8] dark:border-[#2E2E2E] flex items-center justify-between bg-[#F4F1EA] dark:bg-[#1E1E1E]">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#C85A17]" />
              <h2 className="font-serif font-bold text-lg text-[#1A1A1A] dark:text-[#E6E2D8]">
                Research Session History
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-[#706B63] dark:text-[#A09A8E] hover:text-[#1A1A1A] dark:hover:text-[#FAF9F5] rounded-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="p-4 border-b border-[#E7E2D8] dark:border-[#2E2E2E] space-y-3">
            <button
              onClick={() => {
                onNewIdea();
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#C85A17] hover:bg-[#A6470F] text-[#FAF9F5] text-xs font-mono font-medium rounded-sm transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Research Session</span>
            </button>

            {/* Keyword Filter Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#706B63] dark:text-[#A09A8E]" />
              <input
                type="text"
                placeholder="Search session keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF9F5] dark:bg-[#242422] border border-[#E7E2D8] dark:border-[#383834] focus:border-[#C85A17] pl-8 pr-3 py-1.5 text-xs text-[#1A1A1A] dark:text-[#E6E2D8] rounded-xs focus:outline-none font-sans"
              />
            </div>

            {/* Status Filter Toggle (All / Active / Previous-Completed) */}
            <div className="flex items-center space-x-1 bg-[#EFECE6] dark:bg-[#242422] p-1 rounded-xs border border-[#E7E2D8] dark:border-[#333]">
              <button
                onClick={() => setFilterMode('all')}
                className={`flex-1 py-1 text-[11px] font-mono rounded-2xs transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-[#1A1A1A] text-[#FAF9F5] font-bold'
                    : 'text-[#524E48] dark:text-[#A09A8E] hover:text-[#1A1A1A]'
                }`}
              >
                All ({sessions.length})
              </button>
              <button
                onClick={() => setFilterMode('completed')}
                className={`flex-1 py-1 text-[11px] font-mono rounded-2xs transition-all cursor-pointer ${
                  filterMode === 'completed'
                    ? 'bg-[#1A1A1A] text-[#FAF9F5] font-bold'
                    : 'text-[#524E48] dark:text-[#A09A8E] hover:text-[#1A1A1A]'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilterMode('active')}
                className={`flex-1 py-1 text-[11px] font-mono rounded-2xs transition-all cursor-pointer ${
                  filterMode === 'active'
                    ? 'bg-[#1A1A1A] text-[#FAF9F5] font-bold'
                    : 'text-[#524E48] dark:text-[#A09A8E] hover:text-[#1A1A1A]'
                }`}
              >
                Active
              </button>
            </div>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => {
                const isActive = session.sessionId === activeSessionId;

                return (
                  <div
                    key={session.sessionId}
                    className={`p-3.5 rounded-sm border transition-all ${
                      isActive
                        ? 'bg-[#FAF9F5] dark:bg-[#222220] border-2 border-[#C85A17] shadow-xs'
                        : 'bg-[#F4F1EA] dark:bg-[#1E1E1E] border-[#E7E2D8] dark:border-[#333] hover:border-[#1A1A1A] dark:hover:border-[#666]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-2xs text-[10px] font-mono font-bold uppercase">
                        <CheckCircle2 className="w-3 h-3 text-emerald-800 dark:text-emerald-400" />
                        <span>{session.status}</span>
                      </span>

                      <span className="text-[10px] font-mono text-[#706B63] dark:text-[#A09A8E]">
                        {new Date(session.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-[#1A1A1A] dark:text-[#E6E2D8] mb-2 line-clamp-2 leading-snug">
                      "{session.ideaText}"
                    </h4>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-[#E7E2D8] dark:border-[#2E2E2E]">
                      <button
                        onClick={() => {
                          onSelectSession(session.sessionId, session.ideaText, 'deepsearch');
                          onClose();
                        }}
                        className="flex-1 py-1 px-2 bg-[#EFECE6] dark:bg-[#2A2A28] hover:bg-[#1A1A1A] hover:text-[#FAF9F5] text-[#1A1A1A] dark:text-[#E6E2D8] text-[11px] font-mono rounded-2xs transition-colors cursor-pointer flex items-center justify-center space-x-1"
                      >
                        <Search className="w-3 h-3" />
                        <span>DeepSearch</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectSession(session.sessionId, session.ideaText, 'projecthub');
                          onClose();
                        }}
                        className="flex-1 py-1 px-2 bg-[#C85A17] hover:bg-[#A6470F] text-[#FAF9F5] text-[11px] font-mono rounded-2xs transition-colors cursor-pointer flex items-center justify-center space-x-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Plan</span>
                      </button>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-[#706B63] dark:text-[#A09A8E] font-mono text-xs">
                No matching research sessions found.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#E7E2D8] dark:border-[#2E2E2E] bg-[#F4F1EA] dark:bg-[#1E1E1E] text-[11px] font-mono text-[#706B63] dark:text-[#A09A8E] flex justify-between items-center">
            <span>{sessions.length} total sessions logged</span>
            <span className="text-[#C85A17] font-bold">iNSIGHTS v2.4</span>
          </div>

        </div>
      </div>
    </div>
  );
};
