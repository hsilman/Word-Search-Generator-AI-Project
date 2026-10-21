import React from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Sliders, 
  BookText, 
  Layers, 
  CheckSquare, 
  FileText
} from 'lucide-react';
import { BookSettings, DifficultyLevel, PageFormat, SolutionsPerPage } from '../types/wordSearch';
import { PRESET_COLLECTIONS } from '../data/topicLibrary';
import { GenerationStatus } from '../services/aiGenerator';

interface BookConfigPanelProps {
  settings: BookSettings;
  setSettings: React.Dispatch<React.SetStateAction<BookSettings>>;
  onGenerate: () => void;
  isGenerating: boolean;
  totalPuzzles: number;
  aiStatus?: GenerationStatus | null;
}

export const BookConfigPanel: React.FC<BookConfigPanelProps> = ({
  settings,
  setSettings,
  onGenerate,
  isGenerating,
  totalPuzzles,
  aiStatus
}) => {
  const updateSetting = <K extends keyof BookSettings>(key: K, value: BookSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESET_COLLECTIONS.find(p => p.id === presetId);
    if (!preset) return;

    const formattedLines = preset.topics.map(t => `${t.title}: ${t.words.slice(0, 18).join(', ')}`).join('\n');
    setSettings(prev => ({
      ...prev,
      title: preset.name,
      subtitle: preset.description,
      customTopicsText: formattedLines,
      puzzleCount: Math.min(preset.topics.length, prev.puzzleCount)
    }));
  };

  return (
    <div className="w-full lg:w-88 shrink-0 bg-white border-r border-slate-200 h-full overflow-y-auto p-5 flex flex-col gap-5 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-semibold text-slate-900">Book Customizer</h2>
        </div>
        <div className="text-xs text-slate-500 font-mono-grid tabular-nums">
          {totalPuzzles} {totalPuzzles === 1 ? 'puzzle' : 'puzzles'} ready
        </div>
      </div>

      {/* Book Metadata */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Book Titles & Imprint
        </label>
        
        <div>
          <span className="text-[11px] font-medium text-slate-600 mb-1 block">Book Title</span>
          <input
            type="text"
            value={settings.title}
            onChange={e => updateSetting('title', e.target.value)}
            placeholder="e.g. The Grand Word Search Journey"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 transition-colors"
          />
        </div>

        <div>
          <span className="text-[11px] font-medium text-slate-600 mb-1 block">Subtitle</span>
          <input
            type="text"
            value={settings.subtitle}
            onChange={e => updateSetting('subtitle', e.target.value)}
            placeholder="e.g. 50 Relaxing Themed Puzzles for Curious Minds"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 transition-colors"
          />
        </div>

        <div>
          <span className="text-[11px] font-medium text-slate-600 mb-1 block">Author / Collection Imprint</span>
          <input
            type="text"
            value={settings.authorName}
            onChange={e => updateSetting('authorName', e.target.value)}
            placeholder="e.g. WordCraft Studio Publications"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 transition-colors"
          />
        </div>
      </div>

        {/* Topics & Keywords Seeds */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Topic & Keyword Seeds
          </label>
          <span className="text-[11px] text-amber-700 font-medium">Dynamic Sub-Topics</span>
        </div>

        <p className="text-[11px] text-slate-500 leading-normal">
          Seeds branch into diverse sub-topic chapters. For example, seeding <strong className="text-slate-800">"American History"</strong> generates puzzles for Presidents, Vietnam War, Revolutionary War, Manifest Destiny, Space Race, etc.
        </p>

        {/* Quick Seed Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'American History', seed: 'American History', title: 'American History Word Search Chronicles', subtitle: 'Explore the Revolutionary War, Civil War, Presidents, Space Race & More' },
            { label: 'Space & Astronomy', seed: 'Space & Astronomy', title: 'Space & Cosmos Word Search Odyssey', subtitle: 'Explore Solar Planets, Moon Missions, Nebulae, and Black Holes' },
            { label: 'Nature & Wildlife', seed: 'Nature & Wildlife', title: 'Nature & Wildlife Explorer Book', subtitle: 'Explore Coral Reefs, Savannah Safari, Arctic Tundra, and Dinosaurs' },
            { label: 'Food & Culinary', seed: 'Food & Culinary Arts', title: 'Gourmet Culinary Word Search', subtitle: 'Explore Artisan Breads, Trattorias, Sushi, and Spices' },
            { label: 'World Geography', seed: 'World Geography & Travel', title: 'World Geography & Explorer Book', subtitle: 'Explore European Capitals, Asian Megacities, Rivers, and Mountains' },
            { label: 'Science & Discovery', seed: 'Science & Discovery', title: 'Science & Cosmos Expedition', subtitle: 'Explore Elements, Quantum Physics, DNA Genetics, and Volcanoes' }
          ].map(p => (
            <button
              key={p.label}
              onClick={() => {
                setSettings(prev => ({
                  ...prev,
                  title: p.title,
                  subtitle: p.subtitle,
                  customTopicsText: p.seed
                }));
              }}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors ${
                settings.customTopicsText.toLowerCase().includes(p.seed.toLowerCase())
                  ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <textarea
          rows={3}
          value={settings.customTopicsText}
          onChange={e => updateSetting('customTopicsText', e.target.value)}
          placeholder="Enter seed topics (e.g. American History, Space, Ocean, Ancient Civilizations), or comma-separated subtopics..."
          className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 transition-colors font-mono-grid text-slate-700 leading-relaxed resize-y"
        />

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
          >
            <RotateCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Puzzles with AI...' : 'Apply Seeds & Rebuild'}</span>
          </button>
        </div>

        {aiStatus && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-amber-50 border border-amber-200/80 text-[10.5px] text-amber-900 leading-tight">
            <Sparkles className={`w-3.5 h-3.5 shrink-0 text-amber-600 ${isGenerating ? 'animate-spin' : ''}`} />
            <span className="truncate">{aiStatus.message}</span>
          </div>
        )}

        <div className="bg-slate-50 rounded-lg border border-slate-200/80 p-2.5 text-[10.5px]">
          <span className="font-semibold text-slate-700 block mb-1">
            Seed Rule:
          </span>
          <span className="text-slate-500 leading-normal block">
            The seed guides the theme, but individual puzzles get natural standalone titles (e.g., <em>The Revolutionary War</em>, <em>Presidents of the United States</em>) without prepending the seed word.
          </span>
        </div>
      </div>

      {/* Puzzle Volume & Dimensions */}
      <div className="flex flex-col gap-3.5 pt-2 border-t border-slate-100">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Puzzle Volume & Grid
        </label>

        {/* Number of Puzzles */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-medium text-slate-700">Number of Puzzles (up to 100)</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={1}
                max={100}
                value={settings.puzzleCount}
                onChange={e => {
                  const val = Math.max(1, Math.min(100, Number(e.target.value) || 1));
                  updateSetting('puzzleCount', val);
                }}
                className="w-14 text-right font-mono-grid font-bold text-xs px-2 py-0.5 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:border-slate-900"
              />
              <span className="text-[11px] text-slate-500 font-medium">puzzles</span>
            </div>
          </div>

          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={settings.puzzleCount}
            onChange={e => updateSetting('puzzleCount', Number(e.target.value))}
            className="w-full accent-slate-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>1</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>

          {/* Quick Volume Presets */}
          <div className="flex gap-1.5 mt-2">
            {[10, 25, 50, 75, 100].map(count => (
              <button
                key={count}
                onClick={() => updateSetting('puzzleCount', count)}
                className={`flex-1 py-1 text-[11px] font-mono-grid rounded-md border transition-all ${
                  settings.puzzleCount === count
                    ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Average Words Per Puzzle */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-700">Average Words Per Puzzle</span>
            <span className="font-mono-grid font-bold text-slate-900 tabular-nums">{settings.wordsPerPuzzle}</span>
          </div>
          <input
            type="range"
            min={8}
            max={22}
            value={settings.wordsPerPuzzle}
            onChange={e => updateSetting('wordsPerPuzzle', Number(e.target.value))}
            className="w-full accent-slate-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>8 (Brisk)</span>
            <span>14 (Standard)</span>
            <span>22 (Challenging)</span>
          </div>
        </div>

        {/* Grid Size */}
        <div>
          <span className="text-[11px] font-medium text-slate-600 mb-1.5 block">Grid Dimensions</span>
          <div className="grid grid-cols-4 gap-1.5">
            {[12, 14, 15, 18].map(size => (
              <button
                key={size}
                onClick={() => updateSetting('gridSize', size)}
                className={`py-1.5 text-xs font-mono-grid rounded-md border transition-all ${
                  settings.gridSize === size
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {size}×{size}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <span className="text-[11px] font-medium text-slate-600 mb-1.5 block">Difficulty & Directions</span>
          <div className="grid grid-cols-3 gap-1.5">
            {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map(diff => (
              <button
                key={diff}
                onClick={() => updateSetting('difficulty', diff)}
                className={`py-1.5 text-xs capitalize rounded-md border transition-all ${
                  settings.difficulty === diff
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {settings.difficulty === 'easy' && 'Horizontal and vertical forward only (ideal for beginners & kids).'}
            {settings.difficulty === 'medium' && 'Horizontal, vertical, and forward diagonal down.'}
            {settings.difficulty === 'hard' && 'All 8 directions including backwards and reverse diagonals.'}
          </p>
        </div>
      </div>

      {/* Document Layout & Print Settings */}
      <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Page & Document Layout
        </label>

        <div>
          <span className="text-[11px] font-medium text-slate-600 mb-1.5 block">Page Trim Size</span>
          <div className="grid grid-cols-3 gap-1.5">
            {([
              { id: 'letter', label: 'US Letter', sub: '8.5×11"' },
              { id: 'a4', label: 'A4 Paper', sub: '210×297mm' },
              { id: 'kdp6x9', label: '6×9" Book', sub: 'KDP Standard' }
            ] as { id: PageFormat; label: string; sub: string }[]).map(fmt => (
              <button
                key={fmt.id}
                onClick={() => updateSetting('pageFormat', fmt.id)}
                className={`p-1.5 text-left rounded-md border transition-all ${
                  settings.pageFormat === fmt.id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-semibold">{fmt.label}</div>
                <div className={`text-[9px] ${settings.pageFormat === fmt.id ? 'text-slate-300' : 'text-slate-400'}`}>
                  {fmt.sub}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-medium text-slate-600 mb-1.5 block">Solutions Per Page</span>
          <div className="grid grid-cols-2 gap-1.5">
            {([4, 2] as SolutionsPerPage[]).map(count => (
              <button
                key={count}
                onClick={() => updateSetting('solutionsPerPage', count)}
                className={`py-1.5 text-xs rounded-md border transition-all ${
                  settings.solutionsPerPage === count
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {count === 4 ? '4 per page (Eco)' : '2 per page (Large)'}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-2 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              checked={settings.showCheckboxes}
              onChange={e => updateSetting('showCheckboxes', e.target.checked)}
              className="rounded-xs border-slate-300 text-slate-900 accent-slate-900"
            />
            <span>Print pencil checkboxes [ ] in word bank</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              checked={settings.includeIntro}
              onChange={e => updateSetting('includeIntro', e.target.checked)}
              className="rounded-xs border-slate-300 text-slate-900 accent-slate-900"
            />
            <span>Include How-To-Play guide & solving tips</span>
          </label>
        </div>

        <div>
          <span className="text-[11px] font-medium text-slate-600 mb-1 block">Custom Footer Text</span>
          <input
            type="text"
            value={settings.footerText}
            onChange={e => updateSetting('footerText', e.target.value)}
            placeholder="e.g. WordCraft Collection · Vol. 1"
            className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 transition-colors"
          />
        </div>
      </div>

      {/* Generate / Rebuild Button */}
      <div className="pt-2 mt-auto">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Regenerating Puzzles...' : 'Regenerate All Puzzles'}</span>
        </button>
      </div>
    </div>
  );
};
