import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  FileText,
  Github,
  Globe,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Sparkles,
  FolderPlus,
  ChevronRight,
  BookmarkCheck,
  Quote
} from 'lucide-react';
import { Workspace, SavedSourceItem } from '../types';
import { getWorkspaces, createNewWorkspace, removeFromWorkspace } from '../services/api';

interface WorkspacesViewProps {
  onOpenNewIdea: () => void;
}

export const WorkspacesView: React.FC<WorkspacesViewProps> = ({ onOpenNewIdea }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newWsName, setNewWsName] = useState<string>('');
  const [newWsDesc, setNewWsDesc] = useState<string>('');
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);

  useEffect(() => {
    async function loadWs() {
      setLoading(true);
      try {
        const res = await getWorkspaces();
        setWorkspaces(res);
        if (res.length > 0) {
          setActiveWorkspaceId(res[0].workspaceId);
        }
      } catch (err) {
        console.error('Error loading workspaces:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWs();
  }, []);

  const activeWorkspace = workspaces.find(w => w.workspaceId === activeWorkspaceId);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;

    try {
      const created = await createNewWorkspace(newWsName.trim(), newWsDesc.trim());
      setWorkspaces([created, ...workspaces]);
      setActiveWorkspaceId(created.workspaceId);
      setNewWsName('');
      setNewWsDesc('');
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating workspace:', err);
    }
  };

  const handleRemoveItem = async (workspaceId: string, savedItemId: string) => {
    try {
      await removeFromWorkspace(workspaceId, savedItemId);
      setWorkspaces(prev =>
        prev.map(w => {
          if (w.workspaceId === workspaceId && w.items) {
            const updatedItems = w.items.filter(i => i.id !== savedItemId);
            return {
              ...w,
              items: updatedItems,
              itemCount: updatedItems.length
            };
          }
          return w;
        })
      );
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleCopyBibtex = (item: SavedSourceItem) => {
    const key = (item.title.split(' ')[0] || 'Ref') + (item.citationIndex || '2025');
    const bibtex = `@misc{${key.toLowerCase()},
  title = {${item.title}},
  howpublished = {\\url{${item.url}}},
  note = {Snippet: ${item.snippet}},
  year = {2025}
}`;
    navigator.clipboard.writeText(bibtex);
    setCopiedCitationId(item.id + '-bibtex');
    setTimeout(() => setCopiedCitationId(null), 2000);
  };

  const handleCopyIeee = (item: SavedSourceItem) => {
    const ieee = `[1] "${item.title}," Online. Available: ${item.url}. [Accessed: Jul. 2026].`;
    navigator.clipboard.writeText(ieee);
    setCopiedCitationId(item.id + '-ieee');
    setTimeout(() => setCopiedCitationId(null), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[#EFECE6] dark:bg-[#242422] w-1/4 rounded-xs"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-[#EFECE6] dark:bg-[#242422] rounded-sm"></div>
            <div className="md:col-span-2 h-96 bg-[#EFECE6] dark:bg-[#242422] rounded-sm"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E7E2D8] dark:border-[#2E2E2E]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#706B63] dark:text-[#A09A8E] mb-1">
            <FolderKanban className="w-3.5 h-3.5 text-[#C85A17]" />
            <span>RESEARCH REPOSITORIES</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1A1A] dark:text-[#E6E2D8]">
            Research Workspaces
          </h1>
          <p className="text-sm text-[#524E48] dark:text-[#A09A8E] font-sans mt-0.5">
            Organize saved literature citations, open-source repos, and web specifications into topic workspaces.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#1A1A1A] dark:bg-[#2A2A28] hover:bg-[#C85A17] text-[#FAF9F5] text-xs font-mono rounded-sm transition-colors cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Create Workspace</span>
        </button>
      </div>

      {/* Main Grid: Workspaces Sidebar + Saved Items List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Workspace Folder Sidebar */}
        <div className="md:col-span-4 space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#706B63] dark:text-[#A09A8E] font-bold mb-3">
            Topic Workspaces ({workspaces.length})
          </h2>

          <div className="space-y-2">
            {workspaces.map((ws) => {
              const isActive = ws.workspaceId === activeWorkspaceId;

              return (
                <button
                  key={ws.workspaceId}
                  onClick={() => setActiveWorkspaceId(ws.workspaceId)}
                  className={`w-full text-left p-4 rounded-sm border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FAF9F5] dark:bg-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#333] shadow-[3px_3px_0px_0px_#1A1A1A]'
                      : 'bg-[#F4F1EA] dark:bg-[#242422] border-[#E7E2D8] dark:border-[#2E2E2E] hover:border-[#1A1A1A] dark:hover:border-[#666]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-sm text-[#1A1A1A] dark:text-[#E6E2D8] truncate pr-2">
                      {ws.name}
                    </span>
                    <span className="text-[10px] font-mono bg-[#EFECE6] dark:bg-[#242422] border border-[#E7E2D8] dark:border-[#2E2E2E] text-[#524E48] dark:text-[#A09A8E] px-2 py-0.5 rounded-xs shrink-0 font-bold">
                      {ws.itemCount} items
                    </span>
                  </div>

                  {ws.description && (
                    <p className="text-xs text-[#524E48] dark:text-[#A09A8E] line-clamp-2 mb-2 font-sans">
                      {ws.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#706B63] dark:text-[#A09A8E] pt-2 border-t border-[#E7E2D8] dark:border-[#2E2E2E]/60">
                    <span>Updated {ws.updatedAt}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#C85A17]' : 'opacity-40'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Saved Items in Active Workspace */}
        <div className="md:col-span-8 space-y-6">
          {activeWorkspace ? (
            <div className="bg-[#FAF9F5] dark:bg-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#333] rounded-sm p-6 sm:p-8 shadow-[4px_4px_0px_0px_#1A1A1A]">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-[#E7E2D8] dark:border-[#2E2E2E]">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-[#1A1A1A] dark:text-[#E6E2D8]">
                    {activeWorkspace.name}
                  </h2>
                  <p className="text-xs text-[#524E48] dark:text-[#A09A8E] font-sans mt-0.5">
                    {activeWorkspace.description || 'Saved references and citations.'}
                  </p>
                </div>

                <div className="text-xs font-mono text-[#706B63] dark:text-[#A09A8E]">
                  {activeWorkspace.items?.length || 0} Citations Saved
                </div>
              </div>

              {activeWorkspace.items && activeWorkspace.items.length > 0 ? (
                <div className="space-y-4">
                  {activeWorkspace.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#F4F1EA] dark:bg-[#242422] border border-[#E7E2D8] dark:border-[#2E2E2E] p-4 rounded-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase font-bold ${
                            item.type === 'paper'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : item.type === 'github'
                              ? 'bg-slate-200 text-slate-800 border border-slate-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            {item.type === 'paper' && <FileText className="w-3 h-3" />}
                            {item.type === 'github' && <Github className="w-3 h-3" />}
                            {item.type === 'web' && <Globe className="w-3 h-3" />}
                            <span>{item.type}</span>
                          </span>

                          {item.citationIndex && (
                            <span className="text-[10px] font-mono text-[#706B63] dark:text-[#A09A8E]">
                              Citation [{item.citationIndex}]
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleCopyBibtex(item)}
                            className="px-2 py-1 bg-[#FAF9F5] dark:bg-[#1A1A1A] hover:bg-[#1A1A1A] dark:hover:bg-[#3A3A38] hover:text-[#FAF9F5] text-[#1A1A1A] dark:text-[#E6E2D8] border border-[#E7E2D8] dark:border-[#2E2E2E] text-[10px] font-mono rounded-xs transition-colors cursor-pointer"
                            title="Copy BibTeX Citation"
                          >
                            {copiedCitationId === item.id + '-bibtex' ? 'Copied BibTeX!' : 'BibTeX'}
                          </button>

                          <button
                            onClick={() => handleCopyIeee(item)}
                            className="px-2 py-1 bg-[#FAF9F5] dark:bg-[#1A1A1A] hover:bg-[#1A1A1A] dark:hover:bg-[#3A3A38] hover:text-[#FAF9F5] text-[#1A1A1A] dark:text-[#E6E2D8] border border-[#E7E2D8] dark:border-[#2E2E2E] text-[10px] font-mono rounded-xs transition-colors cursor-pointer"
                            title="Copy IEEE Citation Format"
                          >
                            {copiedCitationId === item.id + '-ieee' ? 'Copied IEEE!' : 'IEEE'}
                          </button>

                          <button
                            onClick={() => handleRemoveItem(activeWorkspace.workspaceId, item.id)}
                            className="p-1 text-[#706B63] dark:text-[#A09A8E] hover:text-rose-700 hover:bg-rose-50 rounded-xs transition-colors cursor-pointer"
                            title="Remove from workspace"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-base text-[#1A1A1A] dark:text-[#E6E2D8] hover:text-[#C85A17] transition-colors mb-1">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 hover:underline"
                        >
                          <span>{item.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                        </a>
                      </h3>

                      <p className="text-xs text-[#524E48] dark:text-[#A09A8E] font-sans leading-relaxed">
                        "{item.snippet}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-[#E7E2D8] dark:border-[#2E2E2E] rounded-sm">
                  <BookmarkCheck className="w-8 h-8 text-[#9C9588] mx-auto mb-3" />
                  <h3 className="font-serif font-semibold text-base text-[#1A1A1A] dark:text-[#E6E2D8] mb-1">
                    No Saved References Yet
                  </h3>
                  <p className="text-xs text-[#706B63] dark:text-[#A09A8E] max-w-sm mx-auto mb-4 font-sans">
                    Browse DeepSearch literature synthesis for your project ideas and click "Save to Workspace" on relevant papers or repositories.
                  </p>

                  <button
                    onClick={onOpenNewIdea}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-[#C85A17] hover:bg-[#A6470F] text-[#FAF9F5] text-xs font-mono rounded-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Start New DeepSearch</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 text-center text-[#706B63] dark:text-[#A09A8E] font-mono text-xs">
              Select or create a workspace on the left.
            </div>
          )}
        </div>

      </div>

      {/* CREATE WORKSPACE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A] dark:bg-[#2A2A28]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] dark:bg-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#333] rounded-sm p-6 sm:p-8 max-w-md w-full shadow-[8px_8px_0px_0px_#1A1A1A] animate-in fade-in zoom-in duration-150">
            <h3 className="font-serif font-bold text-xl text-[#1A1A1A] dark:text-[#E6E2D8] mb-1">
              Create Topic Workspace
            </h3>
            <p className="text-xs text-[#706B63] dark:text-[#A09A8E] font-mono mb-6">
              Group related literature sources, GitHub repos, and dataset references.
            </p>

            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#706B63] dark:text-[#A09A8E] font-bold mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NLP & Regional Language Fact-Checking"
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  className="w-full bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E7E2D8] dark:border-[#2E2E2E] focus:border-[#C85A17] p-2.5 text-sm text-[#1A1A1A] dark:text-[#E6E2D8] rounded-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#706B63] dark:text-[#A09A8E] font-bold mb-1">
                  Description / Topic Focus
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Papers on multilingual transformers, IndicBERT models, and claim verification datasets..."
                  value={newWsDesc}
                  onChange={(e) => setNewWsDesc(e.target.value)}
                  className="w-full bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E7E2D8] dark:border-[#2E2E2E] focus:border-[#C85A17] p-2.5 text-xs text-[#1A1A1A] dark:text-[#E6E2D8] rounded-sm focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E7E2D8] dark:border-[#2E2E2E]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-mono text-[#524E48] dark:text-[#A09A8E] hover:text-[#1A1A1A] dark:hover:text-[#E6E2D8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newWsName.trim()}
                  className="px-5 py-2 bg-[#C85A17] hover:bg-[#A6470F] text-[#FAF9F5] text-xs font-mono rounded-sm transition-colors cursor-pointer"
                >
                  Save Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};