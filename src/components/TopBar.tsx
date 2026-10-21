import React from 'react';
import { BookOpen, Download, Volume2, VolumeX } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export type ActiveTab = 'preview' | 'solver' | 'inspector' | 'topics';

interface TopBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenExportModal: () => void;
  isGenerating: boolean;
  puzzleCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenExportModal,
  isGenerating,
  puzzleCount
}) => {
  const [soundEnabled, setSoundEnabled] = React.useState(soundEffects.enabled);

  const toggleSound = () => {
    soundEffects.enabled = !soundEffects.enabled;
    setSoundEnabled(soundEffects.enabled);
  };

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Zone 1: Brand title, single line */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
          <BookOpen className="w-4 h-4 text-amber-300" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-slate-900 font-serif-book whitespace-nowrap">
            WordCraft
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono-grid">
            PDF Book Generator
          </span>
        </div>
      </div>

      {/* Zone 2: 4 clean single-line nav links */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'preview'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Book Preview
        </button>
        <button
          onClick={() => setActiveTab('solver')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'solver'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Interactive Solver
        </button>
        <button
          onClick={() => setActiveTab('inspector')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'inspector'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Puzzle Inspector ({puzzleCount})
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'topics'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Topic Library
        </button>
      </nav>

      {/* Zone 3: Actions (Sound + Primary CTA) */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        <button
          onClick={onOpenExportModal}
          disabled={isGenerating || puzzleCount === 0}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-98 rounded-lg shadow-xs transition-all whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none"
        >
          <Download className="w-3.5 h-3.5 text-amber-300" />
          <span>Export PDF Book</span>
        </button>
      </div>
    </header>
  );
};
