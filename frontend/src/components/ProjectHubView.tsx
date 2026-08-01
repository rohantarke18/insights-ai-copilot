import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';
import {
  BookOpen,
  Layers,
  Cpu,
  Calendar,
  Database,
  Printer,
  Copy,
  Check,
  Download,
  Share2,
  Code2,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  Tag
} from 'lucide-react';
import { ProjectPlan } from '../types';
import { getProjectPlan } from '../services/api';

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'base',
  themeVariables: {
    primaryColor: '#F4F1EA',
    primaryTextColor: '#1A1A1A',
    primaryBorderColor: '#1A1A1A',
    lineColor: '#C85A17',
    fontFamily: 'monospace',
  },
});

interface ProjectHubViewProps {
  sessionId: string;
  ideaText?: string;
  onNavigateToSearch: () => void;
}

export const ProjectHubView: React.FC<ProjectHubViewProps> = ({
  sessionId,
  ideaText,
  onNavigateToSearch
}) => {
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedMd, setCopiedMd] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [diagramSvg, setDiagramSvg] = useState<string>('');
  const [diagramError, setDiagramError] = useState<boolean>(false);

  useEffect(() => {
    async function loadPlan() {
      setLoading(true);
      try {
        const res = await getProjectPlan(sessionId);
        setPlan(res);
      } catch (err) {
        console.error('Error loading project plan:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, [sessionId]);

  // Render the Mermaid architecture diagram whenever the plan changes.
useEffect(() => {
  if (!plan?.architecture?.diagramMermaid) return;
  let cancelled = false;

  // Unique ID per render call (not just per session) so Mermaid never
  // sees a duplicate ID when the same session's Plan is opened more
  // than once in one page lifetime (e.g. History -> Plan nav button).
  const renderId = `arch-diagram-${plan.sessionId}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  mermaid
    .render(renderId, plan.architecture.diagramMermaid)
    .then(({ svg }) => {
      if (!cancelled) {
        setDiagramSvg(svg);
        setDiagramError(false);
      }
    })
    .catch((err) => {
      console.error('Mermaid render failed:', err);
      if (!cancelled) setDiagramError(true);
    });

  return () => {
    cancelled = true;
  };
}, [plan]);

  const handleCopyMarkdown = () => {
    if (!plan) return;
    let md = `# Project Implementation Plan\nSession: ${plan.sessionId}\n\n`;

    md += `## 1. Architecture Overview\n\n`;
    md += `${plan.architecture.overview}\n\n`;
    md += `### Components\n`;
    plan.architecture.components.forEach(comp => {
      md += `- **${comp.name}** (${comp.techChoice})\n  - Role: ${comp.role}\n  - Why: ${comp.reasoning}\n`;
    });
    md += `\n### Data Flow\n${plan.architecture.dataFlow}\n\n`;

    md += `## 2. Tech Stack\n`;
    plan.techStack.forEach(cat => {
      md += `### ${cat.category}\n- ${cat.items.join(', ')}\n`;
    });
    md += `\n`;

    md += `## 3. Milestones Timeline\n`;
    plan.milestones.forEach((m, idx) => {
      md += `### ${idx + 1}. ${m.title} (${m.estimatedDate})\n${m.description}\n`;
      if (m.deliverables) {
        md += `Deliverables: ${m.deliverables.join(' | ')}\n`;
      }
      md += `\n`;
    });

    md += `## 4. APIs & Datasets Needed\n`;
    plan.apisAndDatasets.forEach(item => {
      md += `- **${item.name}** [${item.type.toUpperCase()}]: ${item.description} (${item.link})\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleCopyJson = () => {
    if (!plan) return;
    navigator.clipboard.writeText(JSON.stringify(plan, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !plan) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-[#EFECE6] dark:bg-[#242422] w-1/2 rounded-xs"></div>
          <div className="h-48 bg-[#EFECE6] dark:bg-[#242422] rounded-sm"></div>
          <div className="h-48 bg-[#EFECE6] dark:bg-[#242422] rounded-sm"></div>
          <div className="h-48 bg-[#EFECE6] dark:bg-[#242422] rounded-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      {/* Top Document Header & Export Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E7E2D8] dark:border-[#2E2E2E] no-print">
        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateToSearch}
            className="p-2 bg-[#EFECE6] dark:bg-[#242422] hover:bg-[#1A1A1A] dark:hover:bg-[#3A3A38] hover:text-[#FAF9F5] rounded-xs transition-colors text-[#524E48] dark:text-[#A09A8E] cursor-pointer"
            title="Back to DeepSearch Synthesis"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#706B63] dark:text-[#A09A8E]">
              <Sparkles className="w-3.5 h-3.5 text-[#C85A17]" />
              <span>PROJECT BLUEPRINT</span>
              <span>•</span>
              <span>IMPLEMENTATION-READY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] dark:text-[#E6E2D8]">
              Project Specification & Plan
            </h1>
          </div>
        </div>

        {/* Document Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF9F5] dark:bg-[#1A1A1A] hover:bg-[#EFECE6] dark:hover:bg-[#2E2E2C] text-[#1A1A1A] dark:text-[#E6E2D8] border border-[#E7E2D8] dark:border-[#2E2E2E] text-xs font-mono rounded-xs transition-colors cursor-pointer"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMd ? 'Copied MD!' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleCopyJson}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF9F5] dark:bg-[#1A1A1A] hover:bg-[#EFECE6] dark:hover:bg-[#2E2E2C] text-[#1A1A1A] dark:text-[#E6E2D8] border border-[#E7E2D8] dark:border-[#2E2E2E] text-xs font-mono rounded-xs transition-colors cursor-pointer"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Code2 className="w-3.5 h-3.5" />}
            <span>{copiedJson ? 'Copied JSON!' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#1A1A1A] dark:bg-[#2A2A28] hover:bg-[#C85A17] text-[#FAF9F5] text-xs font-mono rounded-xs transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Document Content Container (Editorial / Scientific Paper Style) */}
      <div className="bg-[#FAF9F5] dark:bg-[#1A1A1A] border-2 border-[#1A1A1A] dark:border-[#333] rounded-sm p-6 sm:p-10 shadow-[6px_6px_0px_0px_#1A1A1A] space-y-10">

        {/* Document Header Metadata */}
        <div className="border-b border-[#1A1A1A] dark:border-[#333] pb-6">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#706B63] dark:text-[#A09A8E] font-bold">
              iNSIGHTS RESEARCH SPECIFICATION v1.0
            </span>
            <span className="font-mono text-xs text-[#706B63] dark:text-[#A09A8E]">
              ID: {plan.sessionId}
            </span>
          </div>

          {ideaText && (
            <div className="bg-[#F4F1EA] dark:bg-[#242422] border border-[#E7E2D8] dark:border-[#2E2E2E] p-4 rounded-sm mt-3">
              <span className="text-[10px] font-mono uppercase text-[#706B63] dark:text-[#A09A8E] block mb-1">
                Project Statement
              </span>
              <p className="font-serif italic text-base text-[#1A1A1A] dark:text-[#E6E2D8] leading-relaxed">
                "{ideaText}"
              </p>
            </div>
          )}
        </div>

        {/* SECTION 1: ARCHITECTURE OVERVIEW */}
        <section>
          <div className="flex items-center space-x-2.5 pb-2 border-b border-[#1A1A1A] dark:border-[#333] mb-4">
            <div className="w-6 h-6 rounded-xs bg-[#1A1A1A] dark:bg-[#2A2A28] text-[#FAF9F5] flex items-center justify-center font-mono text-xs font-bold">
              1
            </div>
            <h2 className="font-serif font-bold text-xl text-[#1A1A1A] dark:text-[#E6E2D8]">
              Architecture Overview
            </h2>
          </div>

          <p className="text-sm text-[#524E48] dark:text-[#A09A8E] mb-5 font-sans leading-relaxed">
            {plan.architecture.overview}
          </p>

          {/* Mermaid-rendered architecture diagram */}
          {plan.architecture.diagramMermaid && !diagramError && (
            <div
              className="bg-[#F4F1EA] dark:bg-[#242422] border border-[#E7E2D8] dark:border-[#2E2E2E] rounded-sm p-4 sm:p-6 mb-5 overflow-x-auto flex justify-center"
              dangerouslySetInnerHTML={{ __html: diagramSvg }}
            />
          )}
          {diagramError && (
            <div className="text-xs text-[#706B63] dark:text-[#A09A8E] italic mb-5">
              Diagram could not be rendered — see component breakdown below.
            </div>
          )}

          {/* Component cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {plan.architecture.components.map((comp, idx) => (
              <div key={idx} className="bg-[#F4F1EA] dark:bg-[#242422] border border-[#E7E2D8] dark:border-[#2E2E2E] p-4 rounded-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Layers className="w-3.5 h-3.5 text-[#C85A17]" />
                  <span className="font-serif font-bold text-sm text-[#1A1A1A] dark:text-[#E6E2D8]">{comp.name}</span>
                </div>
                <p className="text-xs text-[#524E48] dark:text-[#A09A8E] leading-relaxed mb-2">{comp.role}</p>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E7E2D8] dark:border-[#2E2E2E] text-[11px] font-mono text-[#1A1A1A] dark:text-[#E6E2D8] rounded-xs mb-2">
                  <Tag className="w-3 h-3 text-[#C85A17]" />
                  <span>{comp.techChoice}</span>
                </span>
                <p className="text-[11px] text-[#706B63] dark:text-[#A09A8E] italic leading-relaxed">{comp.reasoning}</p>
              </div>
            ))}
          </div>

          {/* Data flow */}
          <div className="bg-[#1A1A1A] dark:bg-[#2A2A28] text-[#EFECE6] p-4 sm:p-6 rounded-sm font-mono text-xs leading-relaxed border border-[#1A1A1A] dark:border-[#333] shadow-inner">
            <span className="text-[10px] uppercase tracking-wider text-[#C85A17] block mb-2">Data Flow</span>
            {plan.architecture.dataFlow}
          </div>
        </section>

        {/* SECTION 2: TECH STACK CATEGORIZED CHIPS */}
        <section>
          <div className="flex items-center space-x-2.5 pb-2 border-b border-[#1A1A1A] dark:border-[#333] mb-4">
            <div className="w-6 h-6 rounded-xs bg-[#1A1A1A] dark:bg-[#2A2A28] text-[#FAF9F5] flex items-center justify-center font-mono text-xs font-bold">
              2
            </div>
            <h2 className="font-serif font-bold text-xl text-[#1A1A1A] dark:text-[#E6E2D8]">
              Recommended Tech Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.techStack.map((cat, idx) => (
              <div key={idx} className="bg-[#F4F1EA] dark:bg-[#242422] border border-[#E7E2D8] dark:border-[#2E2E2E] p-4 rounded-sm">
                <span className="text-xs font-mono uppercase tracking-wider text-[#706B63] dark:text-[#A09A8E] font-bold block mb-2.5">
                  {cat.category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item, iIdx) => (
                    <span
                      key={iIdx}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E7E2D8] dark:border-[#2E2E2E] text-xs font-mono text-[#1A1A1A] dark:text-[#E6E2D8] rounded-xs shadow-2xs"
                    >
                      <Tag className="w-3 h-3 text-[#C85A17]" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: MILESTONES TIMELINE */}
        <section>
          <div className="flex items-center space-x-2.5 pb-2 border-b border-[#1A1A1A] dark:border-[#333] mb-4">
            <div className="w-6 h-6 rounded-xs bg-[#1A1A1A] dark:bg-[#2A2A28] text-[#FAF9F5] flex items-center justify-center font-mono text-xs font-bold">
              3
            </div>
            <h2 className="font-serif font-bold text-xl text-[#1A1A1A] dark:text-[#E6E2D8]">
              Implementation Milestones & Timeline
            </h2>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1A1A1A]">
            {plan.milestones.map((m, idx) => (
              <div key={idx} className="relative bg-[#F4F1EA] dark:bg-[#242422] border border-[#E7E2D8] dark:border-[#2E2E2E] p-5 rounded-sm">

                {/* Timeline Node Dot */}
                <div className="absolute -left-[27px] top-5 w-3.5 h-3.5 rounded-full bg-[#C85A17] border-2 border-[#FAF9F5]" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A] dark:text-[#E6E2D8]">
                    {m.title}
                  </h3>

                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E7E2D8] dark:border-[#2E2E2E] text-xs font-mono text-[#524E48] dark:text-[#A09A8E] rounded-xs">
                      <Calendar className="w-3 h-3 text-[#C85A17]" />
                      <span>{m.estimatedDate}</span>
                    </span>

                    {m.complexity && (
                      <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-xs font-semibold ${
                        m.complexity === 'High'
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : m.complexity === 'Medium'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {m.complexity} Complexity
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#524E48] dark:text-[#A09A8E] font-sans leading-relaxed mb-3">
                  {m.description}
                </p>

                {m.deliverables && m.deliverables.length > 0 && (
                  <div className="pt-2 border-t border-[#E7E2D8] dark:border-[#2E2E2E]">
                    <span className="text-[10px] font-mono uppercase text-[#706B63] dark:text-[#A09A8E] block mb-1">
                      Key Deliverables:
                    </span>
                    <ul className="list-disc list-inside text-xs font-mono text-[#1A1A1A] dark:text-[#E6E2D8] space-y-0.5">
                      {m.deliverables.map((del, dIdx) => (
                        <li key={dIdx}>{del}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: APIS AND DATASETS TABLE */}
        <section>
          <div className="flex items-center space-x-2.5 pb-2 border-b border-[#1A1A1A] dark:border-[#333] mb-4">
            <div className="w-6 h-6 rounded-xs bg-[#1A1A1A] dark:bg-[#2A2A28] text-[#FAF9F5] flex items-center justify-center font-mono text-xs font-bold">
              4
            </div>
            <h2 className="font-serif font-bold text-xl text-[#1A1A1A] dark:text-[#E6E2D8]">
              Required APIs & Benchmark Datasets
            </h2>
          </div>

          <div className="overflow-x-auto border border-[#1A1A1A] dark:border-[#333] rounded-sm">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] dark:bg-[#2A2A28] text-[#FAF9F5] font-mono text-[11px] uppercase tracking-wider">
                  <th className="p-3 border-r border-[#333]">Resource Name</th>
                  <th className="p-3 border-r border-[#333]">Type</th>
                  <th className="p-3 border-r border-[#333]">Description</th>
                  <th className="p-3 border-r border-[#333]">License</th>
                  <th className="p-3">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D8] bg-[#FAF9F5] dark:bg-[#1A1A1A]">
                {plan.apisAndDatasets.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#F4F1EA] dark:hover:bg-[#2E2E2C] transition-colors">
                    <td className="p-3 font-serif font-bold text-[#1A1A1A] dark:text-[#E6E2D8] border-r border-[#E7E2D8] dark:border-[#2E2E2E]">
                      {item.name}
                    </td>
                    <td className="p-3 font-mono border-r border-[#E7E2D8] dark:border-[#2E2E2E]">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-xs ${
                        item.type === 'dataset'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-sky-100 text-sky-900 border border-sky-300'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3 text-[#524E48] dark:text-[#A09A8E] leading-relaxed border-r border-[#E7E2D8] dark:border-[#2E2E2E]">
                      {item.description}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#706B63] dark:text-[#A09A8E] border-r border-[#E7E2D8] dark:border-[#2E2E2E]">
                      {item.license || 'Open'}
                    </td>
                    <td className="p-3 font-mono">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-[#C85A17] hover:underline"
                      >
                        <span>Access</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

    </div>
  );
};