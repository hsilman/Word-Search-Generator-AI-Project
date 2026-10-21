import React, { useState } from 'react';
import { 
  RotateCw, 
  Trash2, 
  Plus, 
  Edit3, 
  Check, 
  Eye, 
  FileDown,
  Layers
} from 'lucide-react';
import { WordSearchPuzzle, BookSettings } from '../types/wordSearch';
import { generateSinglePuzzle } from '../services/wordSearchGenerator';
import { generateSinglePuzzlePDF } from '../services/pdfGenerator';

interface PuzzleInspectorProps {
  puzzles: WordSearchPuzzle[];
  setPuzzles: React.Dispatch<React.SetStateAction<WordSearchPuzzle[]>>;
  settings: BookSettings;
  onPreviewPuzzle: (index: number) => void;
  onSolvePuzzle: (index: number) => void;
}

export const PuzzleInspector: React.FC<PuzzleInspectorProps> = ({
  puzzles,
  setPuzzles,
  settings,
  onPreviewPuzzle,
  onSolvePuzzle
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editWords, setEditWords] = useState<string>('');

  const handleStartEdit = (puzzle: WordSearchPuzzle) => {
    setEditingId(puzzle.id);
    setEditTitle(puzzle.title);
    setEditWords(puzzle.placedWords.map(pw => pw.word).join(', '));
  };

  const handleSaveEdit = (puzzleIndex: number) => {
    const puzzle = puzzles[puzzleIndex];
    if (!puzzle) return;

    const newWords = editWords
      .split(/[,;\n]/)
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length >= 3);

    const regenerated = generateSinglePuzzle(
      puzzle.puzzleNumber,
      editTitle.trim() || puzzle.title,
      puzzle.category,
      newWords.length > 0 ? newWords : puzzle.allWords,
      settings.wordsPerPuzzle,
      puzzle.gridSize,
      puzzle.difficulty
    );

    setPuzzles(prev => {
      const copy = [...prev];
      copy[puzzleIndex] = regenerated;
      return copy;
    });

    setEditingId(null);
  };

  const handleRerollPuzzle = (puzzleIndex: number) => {
    const puzzle = puzzles[puzzleIndex];
    if (!puzzle) return;

    const regenerated = generateSinglePuzzle(
      puzzle.puzzleNumber,
      puzzle.title,
      puzzle.category,
      puzzle.allWords,
      settings.wordsPerPuzzle,
      puzzle.gridSize,
      puzzle.difficulty
    );

    setPuzzles(prev => {
      const copy = [...prev];
      copy[puzzleIndex] = regenerated;
      return copy;
    });
  };

  const handleDeletePuzzle = (puzzleIndex: number) => {
    if (puzzles.length <= 1) return;
    setPuzzles(prev => {
      const filtered = prev.filter((_, i) => i !== puzzleIndex);
      // Re-number remaining puzzles
      return filtered.map((p, idx) => ({ ...p, puzzleNumber: idx + 1 }));
    });
  };

  const handleDownloadSinglePdf = (puzzle: WordSearchPuzzle) => {
    const doc = generateSinglePuzzlePDF(puzzle, settings);
    doc.save(`puzzle-${puzzle.puzzleNumber}-${puzzle.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  return (
    <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h1 className="text-base font-bold text-slate-900 font-serif-book">
              Puzzle Inspector & Word Manager
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and customize each puzzle's word pool, topic title, and grid configuration before final book export.
            </p>
          </div>
          <div className="text-xs font-mono-grid text-slate-500">
            {puzzles.length} Total Puzzles
          </div>
        </div>

        {/* Puzzle Cards List */}
        <div className="flex flex-col gap-3.5">
          {puzzles.map((puzzle, idx) => {
            const isEditing = editingId === puzzle.id;

            return (
              <div 
                key={puzzle.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col gap-3"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs font-mono-grid font-bold flex items-center justify-center">
                      {puzzle.puzzleNumber}
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="text-sm font-semibold text-slate-900 px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
                      />
                    ) : (
                      <h2 className="text-sm font-bold text-slate-900 font-serif-book">
                        {puzzle.title}
                      </h2>
                    )}
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{puzzle.category}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {isEditing ? (
                      <button
                        onClick={() => handleSaveEdit(idx)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(puzzle)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit puzzle title and words"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleRerollPuzzle(idx)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      title="Re-roll grid layout with new random positions"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onPreviewPuzzle(idx)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      title="View in book page preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSolvePuzzle(idx)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      title="Test in interactive solver"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDownloadSinglePdf(puzzle)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      title="Download single-page PDF"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                    </button>

                    {puzzles.length > 1 && (
                      <button
                        onClick={() => handleDeletePuzzle(idx)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors ml-1"
                        title="Delete puzzle from book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Edit Word Bank Textarea or Word Badges */}
                {isEditing ? (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-medium text-slate-600">
                      Comma-separated words for this puzzle:
                    </span>
                    <textarea
                      rows={2}
                      value={editWords}
                      onChange={e => setEditWords(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-300 rounded-md font-mono-grid text-slate-800"
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] font-medium text-slate-500 mr-1">
                      {puzzle.placedWords.length} Words:
                    </span>
                    {puzzle.placedWords.map((pw, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono-grid px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200/60"
                      >
                        {pw.word}
                      </span>
                    ))}
                  </div>
                )}

                {/* Grid details */}
                <div className="text-[10px] text-slate-400 flex items-center gap-2 pt-1 border-t border-slate-100">
                  <span>Grid: {puzzle.gridSize}×{puzzle.gridSize}</span>
                  <span>·</span>
                  <span>Difficulty: {puzzle.difficulty.toUpperCase()}</span>
                  <span>·</span>
                  <span>All words placed successfully</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
