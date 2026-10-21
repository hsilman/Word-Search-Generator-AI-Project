import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  Trophy, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Check
} from 'lucide-react';
import { WordSearchPuzzle, PlacedWord } from '../types/wordSearch';
import { soundEffects } from '../services/soundEffects';

interface InteractiveSolverProps {
  puzzles: WordSearchPuzzle[];
  initialPuzzleIndex?: number;
  onSelectPuzzle: (index: number) => void;
}

export const InteractiveSolver: React.FC<InteractiveSolverProps> = ({
  puzzles,
  initialPuzzleIndex = 0,
  onSelectPuzzle
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(initialPuzzleIndex);
  const puzzle = puzzles[currentIdx] || puzzles[0];

  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [dragStart, setDragStart] = useState<{ r: number; c: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ r: number; c: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
  const [showVictory, setShowVictory] = useState<boolean>(false);

  // Reset when puzzle changes
  useEffect(() => {
    setFoundWords(new Set());
    setDragStart(null);
    setDragCurrent(null);
    setIsDragging(false);
    setHintMessage(null);
    setRevealedCells(new Set());
    setShowVictory(false);
  }, [currentIdx, puzzle?.id]);

  if (!puzzle) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-slate-500">
        No puzzles generated yet. Customize settings in the left drawer to create one!
      </div>
    );
  }

  // Calculate selected cells between dragStart and dragCurrent
  const getSelectedCells = (start: { r: number; c: number }, end: { r: number; c: number }) => {
    const dr = end.r - start.r;
    const dc = end.c - start.c;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));

    if (steps === 0) return [start];

    // Check if line is straight (horizontal, vertical, or 45 deg diagonal)
    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

    if (Math.abs(dr) !== 0 && Math.abs(dc) !== 0 && Math.abs(dr) !== Math.abs(dc)) {
      // Invalid diagonal angle
      return [start];
    }

    const cells: { r: number; c: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      cells.push({
        r: start.r + i * stepR,
        c: start.c + i * stepC
      });
    }
    return cells;
  };

  const activeCells = (dragStart && dragCurrent) ? getSelectedCells(dragStart, dragCurrent) : [];
  const activeCellSet = new Set(activeCells.map(c => `${c.r},${c.c}`));

  // All cells belonging to found words
  const foundCellMap = new Map<string, string>(); // 'r,c' -> color class
  const foundColors = [
    'bg-emerald-100 text-emerald-900 border-emerald-300',
    'bg-sky-100 text-sky-900 border-sky-300',
    'bg-amber-100 text-amber-900 border-amber-300',
    'bg-purple-100 text-purple-900 border-purple-300',
    'bg-rose-100 text-rose-900 border-rose-300',
    'bg-teal-100 text-teal-900 border-teal-300'
  ];

  puzzle.placedWords.forEach((pw, idx) => {
    if (foundWords.has(pw.cleanWord)) {
      const color = foundColors[idx % foundColors.length];
      pw.cells.forEach(c => {
        foundCellMap.set(`${c.r},${c.c}`, color);
      });
    }
  });

  const handleCellMouseDown = (r: number, c: number) => {
    setDragStart({ r, c });
    setDragCurrent({ r, c });
    setIsDragging(true);
    soundEffects.playLetterSelect();
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (isDragging) {
      setDragCurrent({ r, c });
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || !dragStart || !dragCurrent) {
      setIsDragging(false);
      return;
    }

    const cells = getSelectedCells(dragStart, dragCurrent);
    const forwardWord = cells.map(c => puzzle.grid[c.r][c.c]).join('');
    const backwardWord = [...forwardWord].reverse().join('');

    // Check against placed words
    const matched = puzzle.placedWords.find(
      pw => (pw.cleanWord === forwardWord || pw.cleanWord === backwardWord) && !foundWords.has(pw.cleanWord)
    );

    if (matched) {
      const nextFound = new Set(foundWords);
      nextFound.add(matched.cleanWord);
      setFoundWords(nextFound);
      soundEffects.playWordFound();

      if (nextFound.size === puzzle.placedWords.length) {
        soundEffects.playPuzzleComplete();
        setShowVictory(true);
      }
    }

    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
  };

  // Touch Support
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (r: number, c: number) => {
    handleCellMouseDown(r, c);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !gridContainerRef.current) return;
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const cellEl = target?.closest('[data-grid-coord]');
    if (cellEl) {
      const coord = cellEl.getAttribute('data-grid-coord');
      if (coord) {
        const [r, c] = coord.split(',').map(Number);
        setDragCurrent({ r, c });
      }
    }
  };

  // Hint Tier System
  const triggerHint = () => {
    const unrevealed = puzzle.placedWords.filter(pw => !foundWords.has(pw.cleanWord));
    if (unrevealed.length === 0) return;

    const target = unrevealed[0];
    
    // Tier 1: Orientation clue
    // Tier 2: Highlight first cell
    const startCoordKey = `${target.start.r},${target.start.c}`;
    if (!revealedCells.has(startCoordKey)) {
      setRevealedCells(prev => new Set(prev).add(startCoordKey));
      setHintMessage(`Clue for "${target.word}": Starts at Row ${target.start.r + 1}, Col ${target.start.c + 1} (${target.direction})`);
    } else {
      // Reveal entire word
      const nextFound = new Set(foundWords);
      nextFound.add(target.cleanWord);
      setFoundWords(nextFound);
      setHintMessage(`Found "${target.word}"!`);
      soundEffects.playWordFound();

      if (nextFound.size === puzzle.placedWords.length) {
        soundEffects.playPuzzleComplete();
        setShowVictory(true);
      }
    }
  };

  const handleResetPuzzle = () => {
    setFoundWords(new Set());
    setRevealedCells(new Set());
    setHintMessage(null);
    setShowVictory(false);
  };

  return (
    <div 
      className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto select-none"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const next = Math.max(0, currentIdx - 1);
                setCurrentIdx(next);
                onSelectPuzzle(next);
              }}
              disabled={currentIdx === 0}
              className="p-1 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-800 px-2 font-mono-grid">
              Puzzle {puzzle.puzzleNumber} of {puzzles.length}
            </span>
            <button
              onClick={() => {
                const next = Math.min(puzzles.length - 1, currentIdx + 1);
                setCurrentIdx(next);
                onSelectPuzzle(next);
              }}
              disabled={currentIdx === puzzles.length - 1}
              className="p-1 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h1 className="text-sm font-bold text-slate-900 font-serif-book">
            {puzzle.title}
          </h1>
          <span className="text-xs text-slate-500 font-mono-grid tabular-nums">
            {foundWords.size}/{puzzle.placedWords.length} words found
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerHint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hint</span>
          </button>

          <button
            onClick={handleResetPuzzle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Hint Alert */}
      {hintMessage && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-xs text-amber-900 flex justify-between items-center">
          <span>{hintMessage}</span>
          <button 
            onClick={() => setHintMessage(null)}
            className="text-amber-700 hover:text-amber-900 font-bold ml-4"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Play Area */}
      <div className="flex-1 p-6 flex flex-col xl:flex-row gap-8 items-center xl:items-start justify-center max-w-6xl mx-auto w-full">
        
        {/* Left: The Word Search Grid */}
        <div className="flex flex-col items-center">
          <div 
            ref={gridContainerRef}
            onTouchMove={handleTouchMove}
            className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-sm inline-block touch-none"
          >
            <div 
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))` }}
            >
              {puzzle.grid.map((row, r) => 
                row.map((cell, c) => {
                  const key = `${r},${c}`;
                  const isFound = foundCellMap.has(key);
                  const isActive = activeCellSet.has(key);
                  const isHintRevealed = revealedCells.has(key);

                  return (
                    <div
                      key={key}
                      data-grid-coord={key}
                      onMouseDown={() => handleCellMouseDown(r, c)}
                      onMouseEnter={() => handleCellMouseEnter(r, c)}
                      onTouchStart={() => handleTouchStart(r, c)}
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-md flex items-center justify-center font-mono-grid font-bold text-sm sm:text-base cursor-pointer transition-all duration-75 select-none
                        ${isActive ? 'bg-amber-400 text-slate-950 scale-105 shadow-md z-10' : ''}
                        ${isFound && !isActive ? `${foundCellMap.get(key)} shadow-xs font-black` : ''}
                        ${isHintRevealed && !isFound && !isActive ? 'ring-2 ring-amber-500 bg-amber-50 text-amber-900 animate-pulse' : ''}
                        ${!isActive && !isFound && !isHintRevealed ? 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200' : ''}
                      `}
                    >
                      {cell}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-3 text-center">
            Click & drag (or touch) across letters in any direction to highlight hidden words.
          </p>
        </div>

        {/* Right: Word Bank Checklist */}
        <div className="w-full xl:w-80 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Word Bank ({foundWords.size}/{puzzle.placedWords.length})
            </h2>
            <div className="text-[11px] font-mono-grid text-slate-500">
              {Math.round((foundWords.size / puzzle.placedWords.length) * 100)}%
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-slate-900 transition-all duration-300"
              style={{ width: `${(foundWords.size / puzzle.placedWords.length) * 100}%` }}
            />
          </div>

          {/* Word List */}
          <div className="grid grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1">
            {puzzle.placedWords.map((pw, i) => {
              const isFound = foundWords.has(pw.cleanWord);
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-all ${
                    isFound 
                      ? 'bg-slate-50 text-slate-400 line-through' 
                      : 'bg-slate-50/80 text-slate-800 border border-slate-100'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    isFound ? 'bg-emerald-500 text-white' : 'border border-slate-300 text-transparent'
                  }`}>
                    {isFound ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : null}
                  </span>
                  <span className="truncate">{pw.word}</span>
                </div>
              );
            })}
          </div>

          {/* Victory Modal Overlay */}
          {showVictory && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center flex flex-col items-center gap-2 mt-2">
              <Trophy className="w-8 h-8 text-amber-500" />
              <h3 className="text-sm font-bold text-emerald-900">
                Puzzle Completed!
              </h3>
              <p className="text-xs text-emerald-700">
                All {puzzle.placedWords.length} words discovered! Ready for offline print or the next puzzle.
              </p>
              {currentIdx < puzzles.length - 1 && (
                <button
                  onClick={() => {
                    const next = currentIdx + 1;
                    setCurrentIdx(next);
                    onSelectPuzzle(next);
                  }}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Solve Next Puzzle
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
