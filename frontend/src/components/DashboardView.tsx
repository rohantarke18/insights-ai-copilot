// import React, { useState, useEffect } from 'react';
// import {
//   Sparkles,
//   Search,
//   BookOpen,
//   Plus,
//   Clock,
//   CheckCircle2,
//   TrendingUp,
//   FileText,
//   Layers,
//   ArrowRight,
//   Bookmark,
//   FolderKanban
// } from 'lucide-react';
// import { DashboardData, ResearchSession } from '../types';
// import { getDashboardData } from '../services/api';

// interface DashboardViewProps {
//   onNewIdea: () => void;
//   onSelectSession: (sessionId: string, ideaText: string, targetView: 'deepsearch' | 'projecthub') => void;
//   onNavigateToWorkspaces: () => void;
// }

// export const DashboardView: React.FC<DashboardViewProps> = ({
//   onNewIdea,
//   onSelectSession,
//   onNavigateToWorkspaces
// }) => {
//   const [data, setData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function loadDashboard() {
//       setLoading(true);
//       try {
//         const res = await getDashboardData();
//         setData(res);
//       } catch (err) {
//         console.error('Error loading dashboard data:', err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadDashboard();
//   }, []);

//   if (loading || !data) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
//         <div className="animate-pulse space-y-8">
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div className="h-28 bg-[#EFECE6] rounded-sm"></div>
//             <div className="h-28 bg-[#EFECE6] rounded-sm"></div>
//             <div className="h-28 bg-[#EFECE6] rounded-sm"></div>
//           </div>
//           <div className="h-64 bg-[#EFECE6] rounded-sm"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
//       {/* Top Welcome Banner */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#E7E2D8]">
//         <div>
//           <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-[#EFECE6] border border-[#E7E2D8] rounded-xs text-xs font-mono text-[#524E48] mb-2">
//             <Sparkles className="w-3.5 h-3.5 text-[#C85A17]" />
//             <span>RESEARCH WORKSPACE HUB</span>
//           </div>
//           <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A]">
//             Innovation Sessions & Analytics
//           </h1>
//           <p className="text-sm sm:text-base text-[#524E48] font-sans mt-1">
//             Review your synthesized literature reviews, technical blueprints, and saved citations.
//           </p>
//         </div>

//         <div className="flex items-center space-x-3">
//           <button
//             onClick={onNavigateToWorkspaces}
//             className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#FAF9F5] hover:bg-[#EFECE6] text-[#1A1A1A] border border-[#E7E2D8] text-xs font-mono font-medium rounded-sm transition-colors cursor-pointer"
//           >
//             <FolderKanban className="w-4 h-4 text-[#C85A17]" />
//             <span>Workspaces</span>
//           </button>

//           <button
//             onClick={onNewIdea}
//             className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#C85A17] hover:bg-[#A6470F] text-[#FAF9F5] text-xs font-mono font-medium rounded-sm transition-colors shadow-xs cursor-pointer"
//           >
//             <Plus className="w-4 h-4" />
//             <span>New Research Idea</span>
//           </button>
//         </div>
//       </div>

//       {/* STATS ROW */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
        
//         <div className="bg-[#FAF9F5] border-2 border-[#1A1A1A] p-5 rounded-sm shadow-[4px_4px_0px_0px_#1A1A1A]">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-xs font-mono uppercase tracking-wider text-[#706B63] font-bold">
//               Ideas Explored
//             </span>
//             <div className="p-2 bg-[#EFECE6] rounded-xs text-[#1A1A1A]">
//               <Sparkles className="w-4 h-4 text-[#C85A17]" />
//             </div>
//           </div>
//           <div className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] mb-1">
//             {data.stats.ideasExplored}
//           </div>
//           <p className="text-xs text-[#706B63] font-mono">
//             Active research hypotheses
//           </p>
//         </div>

//         <div className="bg-[#FAF9F5] border-2 border-[#1A1A1A] p-5 rounded-sm shadow-[4px_4px_0px_0px_#1A1A1A]">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-xs font-mono uppercase tracking-wider text-[#706B63] font-bold">
//               Sources Analyzed
//             </span>
//             <div className="p-2 bg-[#EFECE6] rounded-xs text-[#1A1A1A]">
//               <FileText className="w-4 h-4 text-[#C85A17]" />
//             </div>
//           </div>
//           <div className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] mb-1">
//             {data.stats.sourcesAnalyzed}
//           </div>
//           <p className="text-xs text-[#706B63] font-mono">
//             arXiv papers, GitHub & Web sources
//           </p>
//         </div>

//         <div className="bg-[#FAF9F5] border-2 border-[#1A1A1A] p-5 rounded-sm shadow-[4px_4px_0px_0px_#1A1A1A]">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-xs font-mono uppercase tracking-wider text-[#706B63] font-bold">
//               Plans Generated
//             </span>
//             <div className="p-2 bg-[#EFECE6] rounded-xs text-[#1A1A1A]">
//               <BookOpen className="w-4 h-4 text-[#C85A17]" />
//             </div>
//           </div>
//           <div className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] mb-1">
//             {data.stats.plansGenerated}
//           </div>
//           <p className="text-xs text-[#706B63] font-mono">
//             Implementation specs & architecture
//           </p>
//         </div>

//       </div>

//       {/* RECENT IDEA SESSIONS SECTION */}
//       <div>
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="font-serif font-bold text-2xl text-[#1A1A1A]">
//             Recent Idea Sessions
//           </h2>
//           <span className="text-xs font-mono text-[#706B63]">
//             {data.sessions.length} Saved Sessions
//           </span>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {data.sessions.map((session) => (
//             <div
//               key={session.sessionId}
//               className="bg-[#FAF9F5] border border-[#E7E2D8] hover:border-[#1A1A1A] p-6 rounded-sm transition-all flex flex-col justify-between group shadow-2xs hover:shadow-xs"
//             >
//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xs text-[10px] font-mono uppercase font-bold">
//                     <CheckCircle2 className="w-3 h-3 text-emerald-800" />
//                     <span>{session.status}</span>
//                   </span>

//                   <span className="text-[11px] font-mono text-[#706B63]">
//                     {new Date(session.createdAt).toLocaleDateString('en-US', {
//                       month: 'short',
//                       day: 'numeric'
//                     })}
//                   </span>
//                 </div>

//                 <h3 className="font-serif font-bold text-base text-[#1A1A1A] group-hover:text-[#C85A17] transition-colors mb-2 line-clamp-3 leading-snug">
//                   "{session.ideaText}"
//                 </h3>

//                 <p className="text-xs font-mono text-[#706B63] mb-6">
//                   {session.sourcesCount || 12} references analyzed • 4 milestone phases
//                 </p>
//               </div>

//               <div className="pt-4 border-t border-[#E7E2D8] flex items-center gap-2">
//                 <button
//                   onClick={() => onSelectSession(session.sessionId, session.ideaText, 'deepsearch')}
//                   className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 bg-[#EFECE6] hover:bg-[#1A1A1A] hover:text-[#FAF9F5] text-[#1A1A1A] text-xs font-mono rounded-xs transition-colors cursor-pointer"
//                 >
//                   <Search className="w-3.5 h-3.5" />
//                   <span>DeepSearch</span>
//                 </button>

//                 <button
//                   onClick={() => onSelectSession(session.sessionId, session.ideaText, 'projecthub')}
//                   className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 bg-[#C85A17] hover:bg-[#A6470F] text-[#FAF9F5] text-xs font-mono rounded-xs transition-colors cursor-pointer"
//                 >
//                   <BookOpen className="w-3.5 h-3.5" />
//                   <span>Project Plan</span>
//                 </button>
//               </div>

//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  Plus,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileText,
  Layers,
  ArrowRight,
  Bookmark,
  FolderKanban
} from 'lucide-react';
import { DashboardData, ResearchSession } from '../types';
import { getDashboardData } from '../services/api';

interface DashboardViewProps {
  onNewIdea: () => void;
  onSelectSession: (sessionId: string, ideaText: string, targetView: 'deepsearch' | 'projecthub') => void;
  onNavigateToWorkspaces: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNewIdea,
  onSelectSession,
  onNavigateToWorkspaces
}) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const res = await getDashboardData();
        setData(res);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-28 bg-[#EFECE6] dark:bg-[#242422] rounded-sm"></div>
            <div className="h-28 bg-[#EFECE6] dark:bg-[#242422] rounded-sm"></div>
            <div className="h-28 bg-[#EFECE6] dark:bg-[#242422] rounded-sm"></div>
          </div>
          <div className="h-64 bg-[#EFECE6] dark:bg-[#242422] rounded-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#E7E2D8] dark:border-[#2E2E2E]">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-[#EFECE6] dark:bg-[#242422] border border-[#E7E2D8] dark:border-[#333] rounded-xs text-xs font-mono text-[#524E48] dark:text-[#A09A8E] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C85A17]" />
            <span>RESEARCH WORKSPACE HUB</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] dark:text-[#E6E2D8]">
            Innovation Sessions & Analytics
          </h1>
          <p className="text-sm sm:text-base text-[#524E48] dark:text-[#A09A8E] font-sans mt-1">
            Review your synthesized literature reviews, technical blueprints, and saved citations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateToWorkspaces}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#FAF9F5] dark:bg-[#1E1E1E] hover:bg-[#EFECE6] dark:hover:bg-[#242422] text-[#1A1A1A] dark:text-[#E6E2D8] border border-[#E7E2D8] dark:border-[#333] text-xs font-mono font-medium rounded-sm transition-colors cursor-pointer"
          >
            <FolderKanban className="w-4 h-4 text-[#C85A17]" />
            <span>Workspaces</span>
          </button>

          <button
            onClick={onNewIdea}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#C85A17] hover:bg-[#A6470F] text-[#FAF9F5] text-xs font-mono font-medium rounded-sm transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Research Idea</span>
          </button>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
        
        <div className="bg-[#FAF9F5] dark:bg-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#333] p-5 rounded-sm shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#706B63] dark:text-[#A09A8E] font-bold">
              Ideas Explored
            </span>
            <div className="p-2 bg-[#EFECE6] dark:bg-[#242422] rounded-xs text-[#1A1A1A] dark:text-[#E6E2D8]">
              <Sparkles className="w-4 h-4 text-[#C85A17]" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] dark:text-[#E6E2D8] mb-1">
            {data.stats.ideasExplored}
          </div>
          <p className="text-xs text-[#706B63] dark:text-[#A09A8E] font-mono">
            Active research hypotheses
          </p>
        </div>

        <div className="bg-[#FAF9F5] dark:bg-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#333] p-5 rounded-sm shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#706B63] dark:text-[#A09A8E] font-bold">
              Sources Analyzed
            </span>
            <div className="p-2 bg-[#EFECE6] dark:bg-[#242422] rounded-xs text-[#1A1A1A] dark:text-[#E6E2D8]">
              <FileText className="w-4 h-4 text-[#C85A17]" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] dark:text-[#E6E2D8] mb-1">
            {data.stats.sourcesAnalyzed}
          </div>
          <p className="text-xs text-[#706B63] dark:text-[#A09A8E] font-mono">
            arXiv papers, GitHub & Web sources
          </p>
        </div>

        <div className="bg-[#FAF9F5] dark:bg-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#333] p-5 rounded-sm shadow-[4px_4px_0px_0px_#1A1A1A] dark:shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#706B63] dark:text-[#A09A8E] font-bold">
              Plans Generated
            </span>
            <div className="p-2 bg-[#EFECE6] dark:bg-[#242422] rounded-xs text-[#1A1A1A] dark:text-[#E6E2D8]">
              <BookOpen className="w-4 h-4 text-[#C85A17]" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] dark:text-[#E6E2D8] mb-1">
            {data.stats.plansGenerated}
          </div>
          <p className="text-xs text-[#706B63] dark:text-[#A09A8E] font-mono">
            Implementation specs & architecture
          </p>
        </div>

      </div>

      {/* RECENT IDEA SESSIONS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif font-bold text-2xl text-[#1A1A1A] dark:text-[#E6E2D8]">
            Recent Idea Sessions
          </h2>
          <span className="text-xs font-mono text-[#706B63] dark:text-[#A09A8E]">
            {data.sessions.length} Saved Sessions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.sessions.map((session) => (
            <div
              key={session.sessionId}
              className="bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E7E2D8] dark:border-[#333] hover:border-[#1A1A1A] dark:hover:border-[#666] p-6 rounded-sm transition-all flex flex-col justify-between group shadow-2xs hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-xs text-[10px] font-mono uppercase font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-800 dark:text-emerald-400" />
                    <span>{session.status}</span>
                  </span>

                  <span className="text-[11px] font-mono text-[#706B63] dark:text-[#A09A8E]">
                    {new Date(session.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-[#1A1A1A] dark:text-[#E6E2D8] group-hover:text-[#C85A17] transition-colors mb-2 line-clamp-3 leading-snug">
                  "{session.ideaText}"
                </h3>

                <p className="text-xs font-mono text-[#706B63] dark:text-[#A09A8E] mb-6">
                  {session.sourcesCount || 12} references analyzed • 4 milestone phases
                </p>
              </div>

              <div className="pt-4 border-t border-[#E7E2D8] dark:border-[#2E2E2E] flex items-center gap-2">
                <button
                  onClick={() => onSelectSession(session.sessionId, session.ideaText, 'deepsearch')}
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 bg-[#EFECE6] dark:bg-[#242422] hover:bg-[#1A1A1A] dark:hover:bg-[#C85A17] hover:text-[#FAF9F5] text-[#1A1A1A] dark:text-[#E6E2D8] text-xs font-mono rounded-xs transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>DeepSearch</span>
                </button>

                <button
                  onClick={() => onSelectSession(session.sessionId, session.ideaText, 'projecthub')}
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 bg-[#C85A17] hover:bg-[#A6470F] text-[#FAF9F5] text-xs font-mono rounded-xs transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Project Plan</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};