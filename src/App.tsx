/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { BookSettings, WordSearchPuzzle } from './types/wordSearch';
import { generateBookPuzzles } from './services/wordSearchGenerator';
import { fetchSeedSubtopics, GenerationStatus } from './services/aiGenerator';
import { TopBar, ActiveTab } from './components/TopBar';
import { BookConfigPanel } from './components/BookConfigPanel';
import { BookPageViewer } from './components/BookPageViewer';
import { InteractiveSolver } from './components/InteractiveSolver';
import { PuzzleInspector } from './components/PuzzleInspector';
import { TopicLibraryDrawer } from './components/TopicLibraryDrawer';
import { PdfExportModal } from './components/PdfExportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('preview');
  const [selectedPuzzleIdx, setSelectedPuzzleIdx] = useState<number>(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiStatus, setAiStatus] = useState<GenerationStatus | null>(null);

  // Default book settings featuring American History seed
  const [settings, setSettings] = useState<BookSettings>({
    title: 'American History Word Search Chronicles',
    subtitle: 'From the Revolutionary War & Presidents to the Space Race & Civil Rights',
    authorName: 'WordCraft Studio Press',
    puzzleCount: 12,
    wordsPerPuzzle: 14,
    gridSize: 14,
    difficulty: 'medium',
    pageFormat: 'letter',
    includeIntro: true,
    includeTableOfContents: true,
    solutionsPerPage: 4,
    titleStyle: 'classic',
    showCheckboxes: true,
    customTopicsText: 'American History',
    footerText: 'American History Word Search Chronicles'
  });

  // Generated puzzles state
  const [puzzles, setPuzzles] = useState<WordSearchPuzzle[]>([]);

  // Function to generate puzzles with Gemini AI
  const handleGeneratePuzzles = useCallback(async () => {
    setIsGenerating(true);
    try {
      const subtopics = await fetchSeedSubtopics(
        settings.customTopicsText,
        settings.puzzleCount,
        settings.wordsPerPuzzle,
        (status) => setAiStatus(status)
      );

      const generated = generateBookPuzzles(settings, subtopics);
      setPuzzles(generated);
      setSelectedPuzzleIdx(0);
    } catch (err) {
      console.error('Error in handleGeneratePuzzles:', err);
      const fallbackPuzzles = generateBookPuzzles(settings);
      setPuzzles(fallbackPuzzles);
    } finally {
      setIsGenerating(false);
    }
  }, [settings]);

  // Automatically generate / update puzzles when seeds or book parameters change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleGeneratePuzzles();
    }, 300);
    return () => clearTimeout(timer);
  }, [
    settings.customTopicsText,
    settings.puzzleCount,
    settings.wordsPerPuzzle,
    settings.gridSize,
    settings.difficulty
  ]);

  const handleSelectForSolve = (idx: number) => {
    setSelectedPuzzleIdx(idx);
    setActiveTab('solver');
  };

  const handlePreviewPuzzle = (idx: number) => {
    setSelectedPuzzleIdx(idx);
    setActiveTab('preview');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 font-sans-ui text-slate-800 overflow-hidden">
      {/* Universal Top Bar */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isGenerating={isGenerating}
        puzzleCount={puzzles.length}
      />

      {/* Main Workspace Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Config Panel Drawer */}
        <BookConfigPanel
          settings={settings}
          setSettings={setSettings}
          onGenerate={handleGeneratePuzzles}
          isGenerating={isGenerating}
          totalPuzzles={puzzles.length}
          aiStatus={aiStatus}
        />

        {/* Center Main Stage according to active tab */}
        <main className="flex-1 flex overflow-hidden">
          {activeTab === 'preview' && (
            <BookPageViewer
              puzzles={puzzles}
              settings={settings}
              onSelectForSolve={handleSelectForSolve}
            />
          )}

          {activeTab === 'solver' && (
            <InteractiveSolver
              puzzles={puzzles}
              initialPuzzleIndex={selectedPuzzleIdx}
              onSelectPuzzle={setSelectedPuzzleIdx}
            />
          )}

          {activeTab === 'inspector' && (
            <PuzzleInspector
              puzzles={puzzles}
              setPuzzles={setPuzzles}
              settings={settings}
              onPreviewPuzzle={handlePreviewPuzzle}
              onSolvePuzzle={handleSelectForSolve}
            />
          )}

          {activeTab === 'topics' && (
            <TopicLibraryDrawer
              settings={settings}
              setSettings={setSettings}
              onApplyTopic={() => {
                handleGeneratePuzzles();
                setActiveTab('preview');
              }}
            />
          )}
        </main>
      </div>

      {/* PDF Export Dialog Modal */}
      <PdfExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        puzzles={puzzles}
        settings={settings}
      />
    </div>
  );
}
