import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Loader2, Lightbulb, Compass, FileText, Database, ShieldAlert } from 'lucide-react';
import { createResearchSession } from '../services/api';

interface IdeaInputScreenProps {
  onSessionCreated: (sessionId: string, ideaText: string) => void;
}

const EXAMPLE_PROMPTS = [
  {
    title: "Food Waste Reduction",
    text: "Reduce food waste in college hostels using IoT weight sensors and computer vision food recognition",
    category: "IoT + Vision",
    difficulty: "Intermediate"
  },
  {
    title: "Regional Fake News Detector",
    text: "Detect fake news in regional Indian languages using multi-lingual BERT fine-tuning and WhatsApp claim matching",
    category: "NLP + Social Media",
    difficulty: "Advanced"
  },
  {
    title: "Microgrid Energy Balancer",
    text: "Autonomous microgrid energy balancer using deep reinforcement learning on solar/battery storage nodes",
    category: "Renewables + RL",
    difficulty: "Advanced"
  },
  {
    title: "Beginner Rust Code Reviewer",
    text: "Automated static analysis and Rust compiler diagnostic explainer for first-year computer science students",
    category: "DevTools + EduTech",
    difficulty: "Beginner Friendly"
  }
];

const LOADING_STEPS = [
  { id: 1, label: "Scanning IEEE, arXiv, PubMed & GitHub repositories", detail: "Querying 1.2M academic and open-source sources..." },
  { id: 2, label: "Clustering findings & indexing cross-citations", detail: "Extracting methodologies, benchmark datasets, and vector embeddings..." },
  { id: 3, label: "Drafting synthesized research summary", detail: "Structuring literature reviews with inline citation tags [1] [2]..." },
  { id: 4, label: "Generating technical architecture & implementation roadmap", detail: "Formulating tech stack tags, milestone timelines, and required APIs..." }
];

export const IdeaInputScreen: React.FC<IdeaInputScreenProps> = ({ onSessionCreated }) => {
  const [ideaText, setIdeaText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setCurrentStepIndex(0);

    // Animate progress steps sequentially
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 700);

    try {
      const session = await createResearchSession(ideaText.trim());
      // Wait briefly for step animation to complete smoothly
      setTimeout(() => {
        clearInterval(stepInterval);
        onSessionCreated(session.sessionId, session.ideaText);
      }, 2800);
    } catch (err) {
      clearInterval(stepInterval);
      setIsSubmitting(false);
      setError("Failed to initialize research session. Please try again.");
    }
  };

  const handleSelectExample = (text: string) => {
    setIdeaText(text);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-[#EFECE6] border border-[#E7E2D8] rounded-xs text-xs font-mono text-[#524E48] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#C85A17]" />
          <span>IDEATION ENGINE v2.4</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A1A1A] tracking-tight leading-tight mb-3">
          What do you want to build?
        </h1>
        <p className="text-base sm:text-lg text-[#524E48] max-w-2xl font-normal leading-relaxed">
          Input your raw project idea or engineering hypothesis. iNSIGHTS will analyze published papers, open GitHub repos, and web benchmarks to build an implementation-ready plan.
        </p>
      </div>

      {/* Main Input Form or Multi-step Loading State */}
      {!isSubmitting ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="bg-[#FAF9F5] border-2 border-[#1A1A1A] rounded-sm p-4 sm:p-6 shadow-[4px_4px_0px_0px_#1A1A1A] transition-all">
            <label htmlFor="idea-input" className="block text-xs font-mono uppercase tracking-wider text-[#706B63] mb-2 font-semibold">
              Project Concept / Research Goal
            </label>
            <textarea
              id="idea-input"
              rows={4}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="e.g. Build an autonomous drone system that maps indoor crop health using thermal cameras and lightweight edge models..."
              className="w-full bg-[#FAF9F5] border border-[#E7E2D8] focus:border-[#C85A17] rounded-sm p-3 text-base text-[#1A1A1A] placeholder-[#9C9588] focus:outline-none focus:ring-1 focus:ring-[#C85A17] transition-all font-sans resize-y"
              required
            />

            {error && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-xs flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[#E7E2D8]">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#706B63]">
                <Compass className="w-4 h-4 text-[#C85A17]" />
                <span>DeepSearch scan includes: arXiv, IEEE, GitHub, PubMed, Web</span>
              </div>

              <button
                type="submit"
                disabled={!ideaText.trim()}
                className={`inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-sm font-mono text-sm font-medium transition-all ${
                  ideaText.trim()
                    ? 'bg-[#C85A17] hover:bg-[#A6470F] text-[#FAF9F5] shadow-xs cursor-pointer'
                    : 'bg-[#E7E2D8] text-[#9C9588] cursor-not-allowed'
                }`}
              >
                <span>Synthesize Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Sequential Labeled Step Loader */
        <div className="mb-10 bg-[#F4F1EA] border border-[#1A1A1A] rounded-sm p-6 sm:p-8 shadow-[4px_4px_0px_0px_#1A1A1A]">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#E7E2D8]">
            <div className="w-8 h-8 rounded-full bg-[#C85A17]/10 text-[#C85A17] flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
                Analyzing Project Hypothesis
              </h3>
              <p className="text-xs font-mono text-[#706B63] truncate max-w-md">
                "{ideaText}"
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {LOADING_STEPS.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={`flex items-start space-x-3 p-3 rounded-sm transition-all border ${
                    isCurrent
                      ? 'bg-[#FAF9F5] border-[#C85A17] shadow-xs'
                      : isDone
                      ? 'bg-[#FAF9F5]/60 border-[#E7E2D8]'
                      : 'bg-transparent border-transparent opacity-40'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-[#C85A17] animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-[#9C9588] flex items-center justify-center text-[10px] font-mono text-[#706B63]">
                        {step.id}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${isCurrent ? 'text-[#1A1A1A]' : 'text-[#524E48]'}`}>
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono uppercase bg-[#C85A17]/10 text-[#C85A17] px-2 py-0.5 rounded-xs font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#706B63] mt-0.5 font-sans">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E7E2D8] flex items-center justify-between text-xs font-mono text-[#706B63]">
            <span>ESTIMATED TIME: ~3.2 SEC</span>
            <span className="animate-pulse text-[#C85A17]">Formulating citations [1][2][3]...</span>
          </div>
        </div>
      )}

      {/* Clickable Example Prompts */}
      <div className="border-t border-[#E7E2D8] pt-8">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="w-4 h-4 text-[#C85A17]" />
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#706B63] font-semibold">
            Or start with a curated project prompt
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {EXAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectExample(prompt.text)}
              className="text-left bg-[#F4F1EA] hover:bg-[#FAF9F5] border border-[#E7E2D8] hover:border-[#1A1A1A] p-4 rounded-sm transition-all group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-serif font-semibold text-sm text-[#1A1A1A] group-hover:text-[#C85A17] transition-colors">
                  {prompt.title}
                </span>
                <span className="text-[10px] font-mono bg-[#EFECE6] border border-[#E7E2D8] text-[#524E48] px-1.5 py-0.5 rounded-xs">
                  {prompt.category}
                </span>
              </div>
              <p className="text-xs text-[#524E48] font-sans line-clamp-2 leading-relaxed">
                "{prompt.text}"
              </p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
