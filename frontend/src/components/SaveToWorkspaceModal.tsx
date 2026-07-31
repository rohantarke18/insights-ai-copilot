import React, { useState, useEffect } from 'react';
import { Bookmark, FolderPlus, Check, X, BookmarkCheck } from 'lucide-react';
import { Source, Workspace } from '../types';
import { getWorkspaces, saveToWorkspace, createNewWorkspace } from '../services/api';

interface SaveToWorkspaceModalProps {
  source: Source;
  onClose: () => void;
  onSaved: () => void;
}

export const SaveToWorkspaceModal: React.FC<SaveToWorkspaceModalProps> = ({
  source,
  onClose,
  onSaved
}) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWsId, setSelectedWsId] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Quick Inline New Workspace
  const [showInlineNew, setShowInlineNew] = useState<boolean>(false);
  const [inlineName, setInlineName] = useState<string>('');

  useEffect(() => {
    async function fetchWs() {
      setLoading(true);
      try {
        const list = await getWorkspaces();
        setWorkspaces(list);
        if (list.length > 0) {
          setSelectedWsId(list[0].workspaceId);
        }
      } catch (err) {
        console.error('Error fetching workspaces:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchWs();
  }, []);

  const handleSave = async () => {
    if (!selectedWsId || isSaving) return;
    setIsSaving(true);
    try {
      await saveToWorkspace(selectedWsId, source.id);
      setSavedSuccess(true);
      setTimeout(() => {
        onSaved();
        onClose();
      }, 900);
    } catch (err) {
      console.error('Error saving to workspace:', err);
      setIsSaving(false);
    }
  };

  const handleCreateInline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineName.trim()) return;
    try {
      const created = await createNewWorkspace(inlineName.trim(), 'Created during literature review.');
      setWorkspaces([created, ...workspaces]);
      setSelectedWsId(created.workspaceId);
      setShowInlineNew(false);
      setInlineName('');
    } catch (err) {
      console.error('Error creating workspace:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF9F5] border-2 border-[#1A1A1A] rounded-sm p-6 sm:p-8 max-w-md w-full shadow-[8px_8px_0px_0px_#1A1A1A] animate-in fade-in zoom-in duration-150">
        
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7E2D8]">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-4 h-4 text-[#C85A17]" />
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
              Save Reference to Workspace
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#706B63] hover:text-[#1A1A1A] rounded-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Snippet Target */}
        <div className="bg-[#F4F1EA] border border-[#E7E2D8] p-3 rounded-sm mb-5 text-xs">
          <span className="font-mono text-[10px] uppercase text-[#706B63] block mb-1">
            [{source.type.toUpperCase()}] REF [{source.citationIndex}]
          </span>
          <p className="font-serif font-bold text-[#1A1A1A] line-clamp-2">
            {source.title}
          </p>
        </div>

        {savedSuccess ? (
          <div className="py-6 text-center text-emerald-800 font-mono text-xs flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="w-6 h-6 text-emerald-700" />
            </div>
            <span className="font-bold">Saved Reference Successfully!</span>
          </div>
        ) : (
          <div className="space-y-4">
            {!showInlineNew ? (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-mono uppercase text-[#706B63] font-bold">
                    Select Target Workspace
                  </label>

                  <button
                    onClick={() => setShowInlineNew(true)}
                    className="text-[11px] font-mono text-[#C85A17] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <FolderPlus className="w-3 h-3" />
                    <span>+ New Workspace</span>
                  </button>
                </div>

                <select
                  value={selectedWsId}
                  onChange={(e) => setSelectedWsId(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E7E2D8] focus:border-[#C85A17] p-2.5 text-xs font-mono text-[#1A1A1A] rounded-sm focus:outline-none"
                >
                  {workspaces.map((ws) => (
                    <option key={ws.workspaceId} value={ws.workspaceId}>
                      {ws.name} ({ws.itemCount} items)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <form onSubmit={handleCreateInline} className="p-3 bg-[#EFECE6] rounded-sm border border-[#E7E2D8]">
                <label className="block text-xs font-mono uppercase text-[#706B63] font-bold mb-1">
                  New Workspace Title
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. AgriTech IoT"
                    value={inlineName}
                    onChange={(e) => setInlineName(e.target.value)}
                    className="flex-1 bg-[#FAF9F5] border border-[#E7E2D8] p-1.5 text-xs text-[#1A1A1A] rounded-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#1A1A1A] text-[#FAF9F5] text-xs font-mono rounded-xs cursor-pointer"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInlineNew(false)}
                    className="px-2 py-1.5 text-xs font-mono text-[#706B63] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E7E2D8]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono text-[#524E48] hover:text-[#1A1A1A] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!selectedWsId || isSaving}
                className="px-5 py-2 bg-[#C85A17] hover:bg-[#A6470F] text-[#FAF9F5] text-xs font-mono rounded-sm transition-colors cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Confirm Save'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
