import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Check,
  Eye,
  FileCheck
} from 'lucide-react';
import { WordSearchPuzzle, BookSettings } from '../types/wordSearch';
import { generateSinglePuzzlePDF } from '../services/pdfGenerator';

interface BookPageViewerProps {
  puzzles: WordSearchPuzzle[];
  settings: BookSettings;
  onSelectForSolve: (puzzleIndex: number) => void;
}

export const BookPageViewer: React.FC<BookPageViewerProps> = ({
  puzzles,
  settings,
  onSelectForSolve
}) => {
  // Page index calculation:
  // Page 0: Cover
  // Page 1: Intro (if included)
  // Page 2..N: Puzzles
  // Page N+1: Solutions Cover
  // Page N+2..: Solutions pages
  const hasIntro = settings.includeIntro;
  const solutionsPerPage = settings.solutionsPerPage || 4;
  const totalSolutionPages = Math.ceil(puzzles.length / solutionsPerPage);
  
  // Total pages
  const totalPages = 1 + (hasIntro ? 1 : 0) + puzzles.length + 1 + totalSolutionPages;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Determine current page type
  let pageType: 'cover' | 'intro' | 'puzzle' | 'solutions_cover' | 'solutions' = 'cover';
  let puzzleIndex = -1;
  let solutionPageIndex = -1;

  if (currentPage === 0) {
    pageType = 'cover';
  } else if (hasIntro && currentPage === 1) {
    pageType = 'intro';
  } else {
    const puzzleStartPage = hasIntro ? 2 : 1;
    const puzzleEndPage = puzzleStartPage + puzzles.length - 1;

    if (currentPage >= puzzleStartPage && currentPage <= puzzleEndPage) {
      pageType = 'puzzle';
      puzzleIndex = currentPage - puzzleStartPage;
    } else if (currentPage === puzzleEndPage + 1) {
      pageType = 'solutions_cover';
    } else {
      pageType = 'solutions';
      solutionPageIndex = currentPage - (puzzleEndPage + 2);
    }
  }

  const handlePrev = () => setCurrentPage(p => Math.max(0, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));

  const handleDownloadSinglePuzzle = () => {
    if (puzzleIndex >= 0 && puzzleIndex < puzzles.length) {
      const doc = generateSinglePuzzlePDF(puzzles[puzzleIndex], settings);
      doc.save(`puzzle-${puzzleIndex + 1}-${puzzles[puzzleIndex].title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    }
  };

  const currentPuzzle = puzzleIndex >= 0 ? puzzles[puzzleIndex] : null;

  // Aspect ratio styling based on format
  const getAspectRatioClass = () => {
    if (settings.pageFormat === 'kdp6x9') return 'aspect-[6/9] max-w-[500px]';
    if (settings.pageFormat === 'a4') return 'aspect-[210/297] max-w-[580px]';
    return 'aspect-[8.5/11] max-w-[580px]'; // letter
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100/70 overflow-hidden">
      {/* Top Page Control Bar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-slate-200 text-xs">
        {/* Navigation & Jump */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="p-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono-grid text-slate-700 font-medium px-2">
            Page <span className="font-bold text-slate-900">{currentPage + 1}</span> of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className="p-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Quick jump menu */}
          <select
            value={currentPage}
            onChange={e => setCurrentPage(Number(e.target.value))}
            className="ml-2 text-xs py-1 px-2 border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:border-slate-800"
          >
            <option value={0}>Page 1: Title & Cover</option>
            {hasIntro && <option value={1}>Page 2: Instructions</option>}
            {puzzles.map((p, i) => (
              <option key={p.id} value={(hasIntro ? 2 : 1) + i}>
                Page {(hasIntro ? 2 : 1) + i + 1}: Puzzle #{p.puzzleNumber} - {p.title}
              </option>
            ))}
            <option value={(hasIntro ? 2 : 1) + puzzles.length}>
              Solutions Divider
            </option>
            {Array.from({ length: totalSolutionPages }).map((_, idx) => (
              <option key={idx} value={(hasIntro ? 2 : 1) + puzzles.length + 1 + idx}>
                Solutions Page {idx + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-3">
          {pageType === 'puzzle' && currentPuzzle && (
            <>
              <button
                onClick={() => onSelectForSolve(puzzleIndex)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition-colors font-medium text-[11px]"
              >
                <Eye className="w-3.5 h-3.5 text-amber-700" />
                <span>Test in Interactive Solver</span>
              </button>

              <button
                onClick={handleDownloadSinglePuzzle}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors font-medium text-[11px]"
                title="Download this single puzzle page as PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download This Page</span>
              </button>
            </>
          )}

          <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 pl-3">
            <button
              onClick={() => setZoomLevel(z => Math.max(70, z - 10))}
              className="p-1 rounded-md text-slate-600 hover:bg-slate-100"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono-grid text-[11px] text-slate-500 w-10 text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(z => Math.min(130, z + 10))}
              className="p-1 rounded-md text-slate-600 hover:bg-slate-100"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 rounded-md text-slate-600 hover:bg-slate-100"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Document Viewer Canvas */}
      <div className="flex-1 overflow-auto p-6 flex justify-center items-start">
        <div 
          className="transition-transform duration-150 origin-top"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {/* Paper Container */}
          <div className={`w-[560px] ${getAspectRatioClass()} bg-white shadow-md border border-slate-200/90 rounded-xs flex flex-col p-10 select-none text-slate-900 relative`}>
            
            {/* 1. COVER PAGE PREVIEW */}
            {pageType === 'cover' && (
              <div className="flex-1 border-2 border-slate-800 p-8 flex flex-col items-center justify-between text-center relative">
                {/* Decorative inner hairline border */}
                <div className="absolute inset-2 border border-slate-300 pointer-events-none" />

                <div className="w-full pt-4">
                  <div className="text-[10px] tracking-widest text-slate-500 uppercase font-serif-book">
                    THE CURATED COLLECTION
                  </div>
                  <div className="w-12 h-px bg-slate-400 mx-auto my-3" />
                  <h1 className="text-3xl font-bold font-serif-book text-slate-900 tracking-tight leading-tight px-4">
                    {settings.title || 'Word Search Puzzle Book'}
                  </h1>
                  {settings.subtitle && (
                    <p className="text-xs text-slate-600 italic font-serif-book mt-3 px-6">
                      {settings.subtitle}
                    </p>
                  )}
                </div>

                {/* Central Motif */}
                <div className="my-auto py-6 flex flex-col items-center">
                  <div className="w-32 h-32 border border-slate-300 rotate-45 flex items-center justify-center p-3 relative">
                    <div className="-rotate-45 grid grid-cols-4 gap-1 text-[11px] font-mono-grid font-bold text-slate-700">
                      <span>W</span><span>O</span><span>R</span><span>D</span>
                      <span>S</span><span>E</span><span>A</span><span>R</span>
                      <span>F</span><span>I</span><span>N</span><span>D</span>
                      <span>P</span><span>A</span><span>T</span><span>H</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Specifications */}
                <div className="w-full flex flex-col items-center gap-3 pb-2">
                  <div className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-md w-full max-w-xs text-center">
                    <div className="text-[11px] font-bold text-slate-900 tracking-wider">
                      {puzzles.length} THEMATIC PUZZLES · COMPLETE SOLUTIONS
                    </div>
                    <div className="text-[9px] text-slate-500 mt-1 uppercase font-mono-grid">
                      {settings.difficulty} MODE · {settings.gridSize}×{settings.gridSize} GRIDS · {settings.pageFormat.toUpperCase()}
                    </div>
                  </div>

                  <div className="text-xs font-serif-book text-slate-700">
                    {settings.authorName ? `Compiled by ${settings.authorName}` : 'Curated Word Search Edition'}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Suitable for All Ages · Perfect for Printing & Offline Solving
                  </div>
                </div>
              </div>
            )}

            {/* 2. INTRODUCTION PAGE PREVIEW */}
            {pageType === 'intro' && (
              <div className="flex-1 flex flex-col justify-between text-slate-800">
                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 italic border-b border-slate-200 pb-2 mb-6">
                    <span>{settings.title || 'Word Search Book'}</span>
                    <span>GUIDE</span>
                  </div>

                  <h2 className="text-xl font-bold font-serif-book text-center text-slate-900 mb-4">
                    How to Solve & Book Guide
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    Welcome to your themed word search collection! Each puzzle is centered on a unique topic 
                    designed to stimulate your cognitive pattern recognition, expand your vocabulary, and provide a 
                    refreshing screen-free activity.
                  </p>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-md mb-6">
                    <h3 className="text-xs font-bold text-slate-900 mb-2">Search Rules & Directions</h3>
                    <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc list-inside">
                      <li>Words can run horizontally, vertically, and diagonally.</li>
                      <li>Depending on difficulty, words may also read backwards or upwards.</li>
                      <li>Letters may overlap where two or more hidden words intersect.</li>
                      <li>Use the checkboxes in the word bank to mark off words as you locate them.</li>
                      <li>Complete answer keys are located in the Solutions section at the end of the book.</li>
                    </ul>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 mb-2">Word Hunting Tips</h3>
                  <div className="text-[11px] text-slate-600 space-y-1.5">
                    <p>1. Scan for rare letters (Q, Z, X, J, K) which quickly stand out on the grid.</p>
                    <p>2. Follow letter pairs: search for double letters (like LL, EE, SS) to isolate target words.</p>
                    <p>3. Check row by row when hunting for elusive terms.</p>
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-100">
                  Page 2
                </div>
              </div>
            )}

            {/* 3. PUZZLE PAGE PREVIEW */}
            {pageType === 'puzzle' && currentPuzzle && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Running Header */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-200 pb-1.5 mb-3">
                    <span className="italic">{settings.title || 'Word Search Puzzle Book'}</span>
                    <span className="font-mono-grid uppercase">PUZZLE #{currentPuzzle.puzzleNumber}</span>
                  </div>

                  {/* Title & Category */}
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-bold font-serif-book text-slate-900">
                      Puzzle {currentPuzzle.puzzleNumber}: {currentPuzzle.title}
                    </h2>
                    <div className="text-[10px] uppercase font-mono-grid text-slate-500 tracking-wider mt-0.5">
                      {currentPuzzle.category} · {currentPuzzle.placedWords.length} Words · {currentPuzzle.gridSize}×{currentPuzzle.gridSize}
                    </div>
                  </div>

                  {/* Puzzle Grid */}
                  <div className="flex justify-center mb-5">
                    <div className="inline-block border-2 border-slate-800 bg-white shadow-xs p-1">
                      <div 
                        className="grid gap-0" 
                        style={{ gridTemplateColumns: `repeat(${currentPuzzle.gridSize}, minmax(0, 1fr))` }}
                      >
                        {currentPuzzle.grid.map((row, r) => 
                          row.map((cell, c) => (
                            <div 
                              key={`${r}-${c}`}
                              className="w-5 h-5 sm:w-6 sm:h-6 border border-slate-200 flex items-center justify-center font-mono-grid font-bold text-xs sm:text-sm text-slate-800"
                            >
                              {cell}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Word Bank */}
                  <div className="w-full">
                    <div className="text-center text-[10px] font-bold text-slate-600 tracking-wider uppercase mb-2">
                      Word List ({currentPuzzle.placedWords.length} Words)
                    </div>
                    <div className="w-16 h-px bg-slate-300 mx-auto mb-2.5" />

                    <div className={`grid ${currentPuzzle.placedWords.length > 15 ? 'grid-cols-4' : 'grid-cols-3'} gap-x-2 gap-y-1.5 text-[10px] text-slate-800`}>
                      {currentPuzzle.placedWords.map((pw, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 truncate">
                          {settings.showCheckboxes && (
                            <span className="w-2.5 h-2.5 border border-slate-400 rounded-2xs shrink-0" />
                          )}
                          <span className="truncate font-medium">{pw.word}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-[10px] text-slate-400 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span>{settings.footerText || 'WordCraft Puzzle Collection'}</span>
                  <span>Page {currentPage + 1}</span>
                </div>
              </div>
            )}

            {/* 4. SOLUTIONS SECTION COVER */}
            {pageType === 'solutions_cover' && (
              <div className="flex-1 flex flex-col justify-between items-center text-center p-8 border-2 border-slate-800 relative">
                <div className="w-full text-right text-[10px] text-slate-400 italic">
                  {settings.title || 'Word Search Puzzle Book'}
                </div>

                <div className="my-auto">
                  <div className="w-16 h-0.5 bg-slate-800 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold font-serif-book text-slate-900 tracking-wider">
                    SOLUTIONS
                  </h2>
                  <p className="text-xs text-slate-500 italic mt-2">
                    Complete Answer Keys & Grid Coordinates
                  </p>
                  <div className="w-16 h-0.5 bg-slate-800 mx-auto mt-4" />

                  <p className="text-xs text-slate-600 max-w-xs mx-auto mt-8 leading-relaxed">
                    Check your discoveries or get help finding stubborn words. Solutions highlight exact paths for every word.
                  </p>
                </div>

                <div className="text-[10px] text-slate-400">
                  Page {currentPage + 1}
                </div>
              </div>
            )}

            {/* 5. SOLUTIONS MINI-GRIDS PAGE */}
            {pageType === 'solutions' && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-200 pb-1.5 mb-3">
                    <span className="font-serif-book font-bold text-slate-700">ANSWERS & SOLUTIONS</span>
                    <span>{settings.title || 'Word Search Puzzle Book'}</span>
                  </div>

                  {/* Render mini solutions */}
                  <div className="grid grid-cols-2 gap-4">
                    {puzzles
                      .slice(solutionPageIndex * solutionsPerPage, (solutionPageIndex + 1) * solutionsPerPage)
                      .map(p => {
                        // Set of solution coordinates
                        const solSet = new Set<string>();
                        p.placedWords.forEach(pw => {
                          pw.cells.forEach(c => solSet.add(`${c.r},${c.c}`));
                        });

                        return (
                          <div key={p.id} className="border border-slate-200 p-2.5 rounded-sm bg-slate-50/50">
                            <div className="text-[11px] font-bold text-slate-900 truncate">
                              Puzzle #{p.puzzleNumber}: {p.title}
                            </div>
                            <div className="text-[9px] text-slate-500 mb-2">
                              {p.placedWords.length} words hidden
                            </div>

                            {/* Mini Grid */}
                            <div className="flex gap-2">
                              <div 
                                className="grid gap-0 border border-slate-300 bg-white shrink-0"
                                style={{ gridTemplateColumns: `repeat(${p.gridSize}, minmax(0, 1fr))` }}
                              >
                                {p.grid.map((row, r) => 
                                  row.map((cell, c) => {
                                    const isSol = solSet.has(`${r},${c}`);
                                    return (
                                      <div
                                        key={`${r}-${c}`}
                                        className={`w-2.5 h-2.5 text-[6.5px] font-mono-grid flex items-center justify-center ${
                                          isSol 
                                            ? 'bg-blue-100 font-bold text-blue-900' 
                                            : 'text-slate-300'
                                        }`}
                                      >
                                        {isSol ? cell : '·'}
                                      </div>
                                    );
                                  })
                                )}
                              </div>

                              {/* Word list coordinates */}
                              <div className="flex-1 overflow-hidden text-[8px] text-slate-600 leading-tight">
                                <div className="font-bold text-slate-700 mb-0.5">WORDS:</div>
                                <div className="space-y-0.5 max-h-24 overflow-y-auto">
                                  {p.placedWords.slice(0, 8).map((pw, i) => (
                                    <div key={i} className="truncate">
                                      {pw.word}
                                    </div>
                                  ))}
                                  {p.placedWords.length > 8 && (
                                    <div className="text-slate-400">+{p.placedWords.length - 8} more</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400 pt-3 border-t border-slate-100">
                  Page {currentPage + 1}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
