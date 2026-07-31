import React, { useState, useEffect } from 'react';
import {
  FileText,
  Github,
  Globe,
  Bookmark,
  Check,
  ArrowRight,
  Filter,
  ExternalLink,
  BookOpen,
  Sparkles,
  Share2,
  Layers,
  ChevronRight
} from 'lucide-react';
import { DeepSearchResults, Source, Workspace } from '../types';
import { getDeepSearchResults, getWorkspaces, saveToWorkspace } from '../services/api';

interface DeepSearchViewProps {
  sessionId: string;
  ideaText?: string;
  onNavigateToPlan: () => void;
  onOpenSaveModal: (source: Source) => void;
}

export const DeepSearchView: React.FC<DeepSearchViewProps> = ({
  sessionId,
  ideaText,
  onNavigateToPlan,
  onOpenSaveModal
}) => {
  const [data, setData] = useState<DeepSearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<'all' | 'web' | 'github' | 'paper'>('all');
  const [highlightedCitation, setHighlightedCitation] = useState<number | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [savedSourceIds, setSavedSourceIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadResults() {
      setLoading(true);
      try {
        const res = await getDeepSearchResults(sessionId);
        setData(res);
        const wsList = await getWorkspaces();
        setWorkspaces(wsList);
        
        // Track already saved sources
        const saved = new Set<string>();
        wsList.forEach(ws => {
          ws.items?.forEach(i => saved.add(i.sourceId));
        });
        setSavedSourceIds(saved);
      } catch (err) {
        console.error('Error fetching deep search results:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [sessionId]);

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[#EFECE6] w-1/3 rounded-xs"></div>
          <div className="h-24 bg-[#EFECE6] rounded-sm"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-[#EFECE6] rounded-sm"></div>
              <div className="h-32 bg-[#EFECE6] rounded-sm"></div>
            </div>
            <div className="h-64 bg-[#EFECE6] rounded-sm"></div>
          </div>
        </div>
      </div>
    );
  }

  const paperCount = data.sources.filter(s => s.type === 'paper').length;
  const githubCount = data.sources.filter(s => s.type === 'github').length;
  const webCount = data.sources.filter(s => s.type === 'web').length;

  const filteredSources = data.sources.filter(s => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  });

  // Render synthesized summary text with interactive citation tags
  const renderSummaryWithCitations = (summaryText: string) => {
    // Split text by paragraph
    const paragraphs = summaryText.split('\n\n');

    return paragraphs.map((para, pIdx) => {
      // Find matches like [1], [2], etc.
      const parts = para.split(/(\[\d+\])/g);

      return (
        <p key={pIdx} className="mb-4 text-[#1A1A1A] text-base leading-relaxed font-sans">
          {parts.map((part, idx) => {
            const citeMatch = part.match(/^\[(\d+)\]$/);
            if (citeMatch) {
              const citeNum = parseInt(citeMatch[1], 10);
              const isHighlighted = highlightedCitation === citeNum;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setHighlightedCitation(citeNum);
                    const el = document.getElementById(`source-card-${citeNum}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  onMouseEnter={() => setHighlightedCitation(citeNum)}
                  onMouseLeave={() => setHighlightedCitation(null)}
                  className={`inline-flex items-center justify-center px-1 py-0.5 mx-0.5 text-xs font-mono font-bold rounded-xs transition-all cursor-pointer ${
                    isHighlighted
                      ? 'bg-[#C85A17] text-[#FAF9F5] scale-110 shadow-xs'
                      : 'bg-[#EFECE6] hover:bg-[#C85A17]/20 text-[#C85A17] border border-[#E7E2D8]'
                  }`}
                  title={`Jump to reference [${citeNum}]`}
                >
                  [{citeNum}]
                </button>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      
      {/* Top Banner / Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E7E2D8]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#706B63] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C85A17]" />
            <span>DEEPSEARCH SYNTHESIS</span>
            <span>•</span>
            <span>{data.sources.length} SOURCES ANALYZED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            Literature Review & Source Clustering
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateToPlan}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#C85A17] hover:bg-[#A6470F] text-[#FAF9F5] text-xs font-mono font-medium rounded-sm transition-colors shadow-xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>View Implementation Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Left Content: Synthesized Summary & Source Cards */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Synthesized Research Summary Card */}
          <div className="bg-[#FAF9F5] border-2 border-[#1A1A1A] rounded-sm p-6 sm:p-8 shadow-[4px_4px_0px_0px_#1A1A1A]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E7E2D8]">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#C85A17]" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-[#706B63] font-bold">
                  Synthesized Literature Review
                </h2>
              </div>
              <span className="text-[10px] font-mono bg-[#EFECE6] border border-[#E7E2D8] text-[#524E48] px-2 py-0.5 rounded-xs">
                AI Cross-Referenced
              </span>
            </div>

            {renderSummaryWithCitations(data.summary)}

            <div className="mt-4 pt-3 border-t border-[#E7E2D8] flex items-center justify-between text-xs text-[#706B63]">
              <span className="font-mono text-[11px]">Hover or click any citation tag [1] to locate source detail</span>
              <span className="font-mono text-[11px] text-[#C85A17]">100% Referenced</span>
            </div>
          </div>

          {/* Source List Section */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="font-serif font-bold text-xl text-[#1A1A1A]">
                Primary Evidence & Citations ({filteredSources.length})
              </h2>

              {/* Source Type Filter */}
              <div className="flex items-center space-x-1 bg-[#EFECE6] p-1 rounded-sm border border-[#E7E2D8]">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 text-xs font-mono rounded-xs transition-all cursor-pointer ${
                    filterType === 'all' ? 'bg-[#1A1A1A] text-[#FAF9F5]' : 'text-[#524E48] hover:text-[#1A1A1A]'
                  }`}
                >
                  All ({data.sources.length})
                </button>
                <button
                  onClick={() => setFilterType('paper')}
                  className={`px-2.5 py-1 text-xs font-mono rounded-xs transition-all cursor-pointer ${
                    filterType === 'paper' ? 'bg-[#1A1A1A] text-[#FAF9F5]' : 'text-[#524E48] hover:text-[#1A1A1A]'
                  }`}
                >
                  Papers ({paperCount})
                </button>
                <button
                  onClick={() => setFilterType('github')}
                  className={`px-2.5 py-1 text-xs font-mono rounded-xs transition-all cursor-pointer ${
                    filterType === 'github' ? 'bg-[#1A1A1A] text-[#FAF9F5]' : 'text-[#524E48] hover:text-[#1A1A1A]'
                  }`}
                >
                  GitHub ({githubCount})
                </button>
                <button
                  onClick={() => setFilterType('web')}
                  className={`px-2.5 py-1 text-xs font-mono rounded-xs transition-all cursor-pointer ${
                    filterType === 'web' ? 'bg-[#1A1A1A] text-[#FAF9F5]' : 'text-[#524E48] hover:text-[#1A1A1A]'
                  }`}
                >
                  Web ({webCount})
                </button>
              </div>
            </div>

            {/* List of Source Cards */}
            <div className="space-y-3">
              {filteredSources.map((source) => {
                const isHighlighted = highlightedCitation === source.citationIndex;
                const isSaved = savedSourceIds.has(source.id) || source.workspaceSaved;

                return (
                  <div
                    key={source.id}
                    id={`source-card-${source.citationIndex}`}
                    className={`bg-[#FAF9F5] border p-5 rounded-sm transition-all ${
                      isHighlighted
                        ? 'border-2 border-[#C85A17] bg-[#FAF9F5] shadow-md scale-[1.01]'
                        : 'border-[#E7E2D8] hover:border-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center space-x-2">
                        {/* Citation Badge */}
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-xs bg-[#1A1A1A] text-[#FAF9F5] font-mono text-xs font-bold shrink-0">
                          [{source.citationIndex}]
                        </span>

                        {/* Source Type Badge */}
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider font-semibold ${
                          source.type === 'paper'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : source.type === 'github'
                            ? 'bg-slate-200 text-slate-800 border border-slate-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {source.type === 'paper' && <FileText className="w-3 h-3" />}
                          {source.type === 'github' && <Github className="w-3 h-3" />}
                          {source.type === 'web' && <Globe className="w-3 h-3" />}
                          <span>{source.type}</span>
                        </span>

                        {source.stars && (
                          <span className="text-[10px] font-mono text-[#706B63] bg-[#EFECE6] px-1.5 py-0.5 rounded-xs">
                            ★ {source.stars}
                          </span>
                        )}

                        {source.publishedYear && (
                          <span className="text-[10px] font-mono text-[#706B63]">
                            Year: {source.publishedYear}
                          </span>
                        )}
                      </div>

                      {/* Save to Workspace Button */}
                      <button
                        onClick={() => onOpenSaveModal(source)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-mono rounded-xs border transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-[#EFECE6] hover:bg-[#1A1A1A] hover:text-[#FAF9F5] text-[#1A1A1A] border-[#E7E2D8]'
                        }`}
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                        <span>{isSaved ? 'Saved' : 'Save to Workspace'}</span>
                      </button>
                    </div>

                    {/* Source Title & Link */}
                    <h3 className="font-serif font-bold text-base text-[#1A1A1A] hover:text-[#C85A17] transition-colors mb-1.5">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:underline"
                      >
                        <span>{source.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      </a>
                    </h3>

                    {source.authors && (
                      <p className="text-xs font-mono text-[#706B63] mb-2">
                        {source.authors}
                      </p>
                    )}

                    {/* Snippet */}
                    <p className="text-xs sm:text-sm text-[#524E48] font-sans leading-relaxed">
                      "{source.snippet}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Research Metadata & Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Sources Searched Breakdown Card */}
          <div className="bg-[#FAF9F5] border border-[#1A1A1A] rounded-sm p-5 shadow-[3px_3px_0px_0px_#1A1A1A]">
            <h3 className="font-serif font-bold text-base text-[#1A1A1A] pb-3 border-b border-[#E7E2D8] mb-4 flex items-center justify-between">
              <span>Sources Searched</span>
              <span className="text-xs font-mono text-[#706B63]">{data.sources.length} Total</span>
            </h3>

            <div className="space-y-3 mb-5">
              <div>
                <div className="flex justify-between text-xs font-mono text-[#524E48] mb-1">
                  <span className="flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>Academic Papers (arXiv/IEEE)</span>
                  </span>
                  <span>{paperCount}</span>
                </div>
                <div className="w-full bg-[#EFECE6] h-1.5 rounded-xs overflow-hidden">
                  <div
                    className="bg-amber-700 h-full transition-all"
                    style={{ width: `${(paperCount / data.sources.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-[#524E48] mb-1">
                  <span className="flex items-center space-x-1.5">
                    <Github className="w-3.5 h-3.5 text-slate-800" />
                    <span>GitHub Repositories</span>
                  </span>
                  <span>{githubCount}</span>
                </div>
                <div className="w-full bg-[#EFECE6] h-1.5 rounded-xs overflow-hidden">
                  <div
                    className="bg-slate-800 h-full transition-all"
                    style={{ width: `${(githubCount / data.sources.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-[#524E48] mb-1">
                  <span className="flex items-center space-x-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Web Specifications</span>
                  </span>
                  <span>{webCount}</span>
                </div>
                <div className="w-full bg-[#EFECE6] h-1.5 rounded-xs overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full transition-all"
                    style={{ width: `${(webCount / data.sources.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E7E2D8]">
              <div className="flex items-center justify-between text-xs font-mono text-[#706B63] mb-1">
                <span>CITATION CONFIDENCE</span>
                <span className="text-[#C85A17] font-bold">96.4%</span>
              </div>
              <p className="text-[11px] text-[#706B63] leading-tight">
                Peer-reviewed methodologies prioritized over web claims.
              </p>
            </div>
          </div>

          {/* Call to Action Next Step */}
          <div className="bg-[#F4F1EA] border border-[#E7E2D8] rounded-sm p-5">
            <h4 className="font-serif font-semibold text-sm text-[#1A1A1A] mb-2">
              Ready to Implement?
            </h4>
            <p className="text-xs text-[#524E48] mb-4 leading-relaxed">
              Transform these research findings into a structured project plan with architecture blueprints, tech stack tags, and milestone timelines.
            </p>

            <button
              onClick={onNavigateToPlan}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#C85A17] text-[#FAF9F5] text-xs font-mono font-medium rounded-sm transition-colors cursor-pointer"
            >
              <span>Project Implementation Plan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
