import { jsPDF } from 'jspdf';
import { WordSearchPuzzle, BookSettings, PageFormat } from '../types/wordSearch';

interface PageDimensions {
  width: number;
  height: number;
  margin: number;
  contentWidth: number;
}

function getDimensions(format: PageFormat): PageDimensions {
  switch (format) {
    case 'a4':
      // 210 x 297 mm
      return { width: 210, height: 297, margin: 18, contentWidth: 210 - 36 };
    case 'kdp6x9':
      // 6 x 9 inches in mm: 152.4 x 228.6 mm
      return { width: 152.4, height: 228.6, margin: 14, contentWidth: 152.4 - 28 };
    case 'letter':
    default:
      // 8.5 x 11 inches in mm: 215.9 x 279.4 mm
      return { width: 215.9, height: 279.4, margin: 18, contentWidth: 215.9 - 36 };
  }
}

/**
 * Generate full PDF document containing cover, puzzles, and solutions asynchronously
 * with cooperative event-loop yielding for smooth progress updates on large books (up to 100 puzzles).
 */
export async function generateBookPDFAsync(
  puzzles: WordSearchPuzzle[],
  settings: BookSettings,
  onProgress?: (percent: number, status: string) => void
): Promise<jsPDF> {
  const dims = getDimensions(settings.pageFormat);
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [dims.width, dims.height]
  });

  let currentPage = 1;
  const puzzlePageMap = new Map<number, number>();

  // 1. COVER / TITLE PAGE
  onProgress?.(3, 'Rendering Title Page...');
  renderTitlePage(doc, dims, settings, puzzles.length);
  await new Promise(r => setTimeout(r, 0));

  // 2. OPTIONAL INTRODUCTION / HOW TO PLAY
  if (settings.includeIntro) {
    doc.addPage([dims.width, dims.height]);
    currentPage++;
    onProgress?.(6, 'Rendering Introduction & Guide...');
    renderIntroPage(doc, dims, settings);
    await new Promise(r => setTimeout(r, 0));
  }

  // 3. PUZZLE PAGES
  for (let index = 0; index < puzzles.length; index++) {
    const puzzle = puzzles[index];
    doc.addPage([dims.width, dims.height]);
    currentPage++;
    puzzlePageMap.set(puzzle.puzzleNumber, currentPage);

    renderPuzzlePage(doc, dims, puzzle, settings, currentPage);

    // Yield every 5 puzzles so browser doesn't freeze and progress updates cleanly
    if (index % 5 === 0 || index === puzzles.length - 1) {
      const percent = 10 + Math.round(((index + 1) / puzzles.length) * 65);
      onProgress?.(percent, `Rendering Puzzle ${index + 1} of ${puzzles.length}...`);
      await new Promise(r => setTimeout(r, 0));
    }
  }

  // 4. SOLUTIONS SECTION
  onProgress?.(78, 'Preparing Solutions Key...');
  doc.addPage([dims.width, dims.height]);
  currentPage++;
  renderSolutionsCoverPage(doc, dims, settings, currentPage);
  await new Promise(r => setTimeout(r, 0));

  // Solution grids
  const perPage = settings.solutionsPerPage || 4;
  const totalSolutionPages = Math.ceil(puzzles.length / perPage);

  for (let sPage = 0; sPage < totalSolutionPages; sPage++) {
    doc.addPage([dims.width, dims.height]);
    currentPage++;

    const chunkPuzzles = puzzles.slice(sPage * perPage, (sPage + 1) * perPage);
    renderSolutionsPage(doc, dims, chunkPuzzles, settings, currentPage, perPage);

    if (sPage % 2 === 0 || sPage === totalSolutionPages - 1) {
      const progress = 78 + Math.round(((sPage + 1) / totalSolutionPages) * 21);
      onProgress?.(progress, `Rendering Solutions page ${sPage + 1} of ${totalSolutionPages}...`);
      await new Promise(r => setTimeout(r, 0));
    }
  }

  onProgress?.(100, 'Complete!');
  return doc;
}

/**
 * Synchronous backward-compatible wrapper
 */
export function generateBookPDF(
  puzzles: WordSearchPuzzle[],
  settings: BookSettings,
  onProgress?: (percent: number, status: string) => void
): jsPDF {
  const dims = getDimensions(settings.pageFormat);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [dims.width, dims.height]
  });

  let currentPage = 1;
  const puzzlePageMap = new Map<number, number>();

  onProgress?.(5, 'Rendering Title Page...');
  renderTitlePage(doc, dims, settings, puzzles.length);

  if (settings.includeIntro) {
    doc.addPage([dims.width, dims.height]);
    currentPage++;
    onProgress?.(10, 'Rendering Introduction...');
    renderIntroPage(doc, dims, settings);
  }

  puzzles.forEach((puzzle, index) => {
    doc.addPage([dims.width, dims.height]);
    currentPage++;
    puzzlePageMap.set(puzzle.puzzleNumber, currentPage);

    const percent = 15 + Math.round(((index + 1) / puzzles.length) * 55);
    onProgress?.(percent, `Rendering Puzzle ${index + 1} of ${puzzles.length}...`);

    renderPuzzlePage(doc, dims, puzzle, settings, currentPage);
  });

  onProgress?.(75, 'Rendering Solutions Section...');
  doc.addPage([dims.width, dims.height]);
  currentPage++;
  renderSolutionsCoverPage(doc, dims, settings, currentPage);

  const perPage = settings.solutionsPerPage || 4;
  const totalSolutionPages = Math.ceil(puzzles.length / perPage);

  for (let sPage = 0; sPage < totalSolutionPages; sPage++) {
    doc.addPage([dims.width, dims.height]);
    currentPage++;

    const chunkPuzzles = puzzles.slice(sPage * perPage, (sPage + 1) * perPage);
    const progress = 75 + Math.round(((sPage + 1) / totalSolutionPages) * 23);
    onProgress?.(progress, `Rendering Solutions page ${sPage + 1} of ${totalSolutionPages}...`);

    renderSolutionsPage(doc, dims, chunkPuzzles, settings, currentPage, perPage);
  }

  onProgress?.(100, 'Complete!');
  return doc;
}

/**
 * Render Cover Page with decorative border and typography
 */
function renderTitlePage(
  doc: jsPDF,
  dims: PageDimensions,
  settings: BookSettings,
  totalPuzzles: number
) {
  const { width, height, margin } = dims;

  // Background tint
  doc.setFillColor(254, 254, 252);
  doc.rect(0, 0, width, height, 'F');

  // Outer border
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.8);
  doc.rect(margin - 4, margin - 4, width - (margin - 4) * 2, height - (margin - 4) * 2);

  // Inner thin border
  doc.setLineWidth(0.25);
  doc.rect(margin - 1.5, margin - 1.5, width - (margin - 1.5) * 2, height - (margin - 1.5) * 2);

  // Corner decorative marks
  const cSize = 6;
  const corners = [
    { x: margin - 4, y: margin - 4 },
    { x: width - margin + 4, y: margin - 4 },
    { x: margin - 4, y: height - margin + 4 },
    { x: width - margin + 4, y: height - margin + 4 }
  ];
  doc.setLineWidth(0.6);
  corners.forEach(c => {
    doc.circle(c.x, c.y, 1.2, 'FD');
  });

  const centerX = width / 2;

  // Top Kicker / Category tag
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text('THE CURATED COLLECTION', centerX, margin + 24, { align: 'center' });

  // Subtle separator line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(centerX - 24, margin + 28, centerX + 24, margin + 28);

  // Main Title
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(15, 23, 42);
  
  const titleLines = doc.splitTextToSize(settings.title || 'Word Search Puzzle Book', dims.contentWidth - 10);
  doc.text(titleLines, centerX, margin + 42, { align: 'center', lineHeightFactor: 1.2 });

  // Subtitle
  const titleHeight = (titleLines.length) * 10;
  if (settings.subtitle) {
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.setTextColor(71, 85, 105);
    const subLines = doc.splitTextToSize(settings.subtitle, dims.contentWidth - 15);
    doc.text(subLines, centerX, margin + 46 + titleHeight, { align: 'center', lineHeightFactor: 1.2 });
  }

  // Center Emblem / Word Search Illustration
  const emblemY = height / 2 - 2;
  renderCenterBookEmblem(doc, centerX, emblemY);

  // Book Specifications Box
  const specY = height - margin - 45;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(centerX - 48, specY, 96, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`${totalPuzzles} THEMATIC PUZZLES · COMPLETE SOLUTIONS`, centerX, specY + 7.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const diffLabel = settings.difficulty.toUpperCase();
  const formatLabel = settings.pageFormat.toUpperCase();
  doc.text(`DIFFICULTY: ${diffLabel}  ·  FORMAT: ${formatLabel}  ·  LARGE PRINT`, centerX, specY + 14.5, { align: 'center' });

  // Author / Imprint
  const authorY = height - margin - 12;
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(settings.authorName ? `Compiled by ${settings.authorName}` : 'Curated Word Search Edition', centerX, authorY, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Suitable for All Ages · Perfect for Printing & Offline Solving', centerX, authorY + 5, { align: 'center' });
}

/**
 * Center vector graphic decorative emblem
 */
function renderCenterBookEmblem(doc: jsPDF, cx: number, cy: number) {
  doc.saveGraphicsState();
  
  // Outer decorative diamond
  const dSize = 22;
  doc.setDrawColor(180, 190, 205);
  doc.setLineWidth(0.4);
  doc.line(cx, cy - dSize, cx + dSize, cy);
  doc.line(cx + dSize, cy, cx, cy + dSize);
  doc.line(cx, cy + dSize, cx - dSize, cy);
  doc.line(cx - dSize, cy, cx, cy - dSize);

  // Inner mini sample letter grid
  const letters = [
    ['W', 'O', 'R', 'D'],
    ['S', 'E', 'A', 'R'],
    ['F', 'I', 'N', 'D'],
    ['P', 'A', 'T', 'H']
  ];
  const cellSize = 6;
  const startX = cx - (letters[0].length * cellSize) / 2;
  const startY = cy - (letters.length * cellSize) / 2;

  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  letters.forEach((row, r) => {
    row.forEach((char, c) => {
      const x = startX + c * cellSize + cellSize / 2;
      const y = startY + r * cellSize + cellSize / 2 + 1.2;
      doc.text(char, x, y, { align: 'center' });
    });
  });

  doc.restoreGraphicsState();
}

/**
 * Render Introduction & How to play page
 */
function renderIntroPage(doc: jsPDF, dims: PageDimensions, settings: BookSettings) {
  const { width, height, margin } = dims;
  const centerX = width / 2;

  // Running header
  doc.setFont('times', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(settings.title || 'Word Search Puzzle Book', centerX, margin + 4, { align: 'center' });
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, margin + 7, width - margin, margin + 7);

  // Main Section Title
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text('How to Solve & Book Guide', centerX, margin + 22, { align: 'center' });

  // Instructions Paragraph
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const introText = 
    'Welcome to your themed word search collection! Each puzzle in this book is centered on a unique topic ' +
    'designed to challenge your pattern recognition, expand your vocabulary, and provide a calming screen-free activity. ' +
    'All puzzles feature large, high-contrast typography optimized for physical print and pencil solving.';
  
  const introLines = doc.splitTextToSize(introText, dims.contentWidth);
  doc.text(introLines, margin, margin + 32, { lineHeightFactor: 1.4 });

  // Rules Box
  const boxY = margin + 50;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, boxY, dims.contentWidth, 54, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Search Rules & Directions', margin + 6, boxY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  const rules = [
    '• Words can run horizontally (left-to-right), vertically (top-to-bottom), and diagonally.',
    '• Depending on chosen difficulty, words may also read backwards or upwards.',
    '• Letters may overlap where two or more hidden words intersect.',
    '• Use the checkboxes beside each word in the word bank to mark off words as you discover them.',
    '• Complete answer keys with letter coordinates are located in the Solutions section at the end of this book.'
  ];

  let rY = boxY + 16;
  rules.forEach(rule => {
    const lines = doc.splitTextToSize(rule, dims.contentWidth - 12);
    doc.text(lines, margin + 6, rY, { lineHeightFactor: 1.3 });
    rY += lines.length * 6.5;
  });

  // Tips section
  const tipsY = boxY + 62;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Solving Tips for Word Hunters', margin, tipsY);

  const tips = [
    '1. Scan for distinct rare letters first (such as Q, Z, X, J, K) which stand out quickly on the grid.',
    '2. Follow letter pairs: search for double letters (like LL, EE, SS) to rapidly isolate target words.',
    '3. Check parallel lines row by row when hunting for elusive terms.',
    '4. Take your time! Word searches are proven to stimulate relaxation and mental agility.'
  ];

  let tY = tipsY + 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  tips.forEach(tip => {
    doc.text(tip, margin, tY);
    tY += 6.5;
  });

  // Page footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Page 2', centerX, height - margin + 4, { align: 'center' });
}

/**
 * Render a single Puzzle Page
 */
function renderPuzzlePage(
  doc: jsPDF,
  dims: PageDimensions,
  puzzle: WordSearchPuzzle,
  settings: BookSettings,
  pageNumber: number
) {
  const { width, height, margin, contentWidth } = dims;
  const centerX = width / 2;

  // Running Header
  doc.setFont('times', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(settings.title || 'Word Search Puzzle Book', margin, margin + 3);
  doc.text(`PUZZLE #${puzzle.puzzleNumber}`, width - margin, margin + 3, { align: 'right' });

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.line(margin, margin + 6, width - margin, margin + 6);

  // Puzzle Title
  doc.setFont('times', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(15, 23, 42);
  doc.text(`Puzzle ${puzzle.puzzleNumber}: ${puzzle.title}`, centerX, margin + 16, { align: 'center' });

  // Category & Difficulty metadata line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`${puzzle.category.toUpperCase()} · ${puzzle.placedWords.length} WORDS · ${puzzle.gridSize}×${puzzle.gridSize} GRID`, centerX, margin + 21, { align: 'center' });

  // Grid sizing calculation
  // Let grid occupy appropriate width, max ~140mm for letter/A4, ~110mm for KDP
  const maxGridWidth = Math.min(contentWidth - 6, dims.width === 152.4 ? 112 : 144);
  const cellSize = Math.min(maxGridWidth / puzzle.gridSize, 8.8);
  const totalGridWidth = cellSize * puzzle.gridSize;
  const totalGridHeight = cellSize * puzzle.gridSize;
  const gridStartX = (width - totalGridWidth) / 2;
  const gridStartY = margin + 25;

  // Render Grid Container & Cells
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);

  // Background white box with subtle shadow
  doc.setFillColor(255, 255, 255);
  doc.rect(gridStartX, gridStartY, totalGridWidth, totalGridHeight, 'F');

  // Cells and Letters
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(cellSize > 7.5 ? 11 : 9.5);
  doc.setTextColor(30, 41, 59);

  for (let r = 0; r < puzzle.gridSize; r++) {
    for (let c = 0; c < puzzle.gridSize; c++) {
      const x = gridStartX + c * cellSize;
      const y = gridStartY + r * cellSize;

      // Cell border
      doc.rect(x, y, cellSize, cellSize, 'S');

      // Centered Letter
      const letter = puzzle.grid[r][c];
      const textX = x + cellSize / 2;
      const textY = y + cellSize / 2 + (cellSize > 7.5 ? 1.4 : 1.1);
      doc.text(letter, textX, textY, { align: 'center' });
    }
  }

  // Outer bold border around grid
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.6);
  doc.rect(gridStartX, gridStartY, totalGridWidth, totalGridHeight, 'S');

  // -------------------------------------------------------------
  // WORD BANK SECTION
  // -------------------------------------------------------------
  const bankStartY = gridStartY + totalGridHeight + 6;

  // Header for Word Bank
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`WORD LIST (${puzzle.placedWords.length} WORDS)`, centerX, bankStartY, { align: 'center' });

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.line(centerX - 35, bankStartY + 2, centerX + 35, bankStartY + 2);

  // Column layout for words
  const words = puzzle.placedWords.map(p => p.word);
  const numColumns = width === 152.4 ? 2 : (words.length > 15 ? 4 : 3);
  const colWidth = (contentWidth - 4) / numColumns;
  const itemsPerCol = Math.ceil(words.length / numColumns);
  const wordListY = bankStartY + 6.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  words.forEach((word, idx) => {
    const col = Math.floor(idx / itemsPerCol);
    const row = idx % itemsPerCol;
    const itemX = margin + 2 + col * colWidth;
    const itemY = wordListY + row * 4.6;

    if (itemY < height - margin - 6) {
      if (settings.showCheckboxes) {
        // Draw small checkbox square for pencil tick
        doc.setDrawColor(148, 163, 184);
        doc.setLineWidth(0.25);
        doc.rect(itemX, itemY - 2.6, 2.8, 2.8, 'S');
        doc.text(word, itemX + 4.2, itemY);
      } else {
        doc.text(word, itemX, itemY);
      }
    }
  });

  // Page Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const footerLabel = settings.footerText ? `${settings.footerText} · Page ${pageNumber}` : `Page ${pageNumber}`;
  doc.text(footerLabel, centerX, height - margin + 4, { align: 'center' });
}

/**
 * Render Solutions Section Cover Page
 */
function renderSolutionsCoverPage(
  doc: jsPDF,
  dims: PageDimensions,
  settings: BookSettings,
  pageNumber: number
) {
  const { width, height, margin } = dims;
  const centerX = width / 2;

  // Running header
  doc.setFont('times', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(settings.title || 'Word Search Puzzle Book', centerX, margin + 4, { align: 'center' });

  // Center Cover Content
  const centerY = height / 2 - 15;

  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.6);
  doc.line(centerX - 35, centerY - 25, centerX + 35, centerY - 25);

  doc.setFont('times', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(15, 23, 42);
  doc.text('SOLUTIONS', centerX, centerY - 10, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(100, 116, 139);
  doc.text('Complete Puzzle Answer Keys & Letter Coordinates', centerX, centerY + 2, { align: 'center' });

  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.6);
  doc.line(centerX - 35, centerY + 14, centerX + 35, centerY + 14);

  // Notes
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const note = 'Each solution mini-grid below highlights the discovered word paths for quick reference. ' +
               'Words are highlighted with shaded markers to reveal their exact orientations.';
  const noteLines = doc.splitTextToSize(note, dims.contentWidth - 20);
  doc.text(noteLines, centerX, centerY + 30, { align: 'center', lineHeightFactor: 1.4 });

  // Page Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Page ${pageNumber}`, centerX, height - margin + 4, { align: 'center' });
}

/**
 * Render a page containing 2 or 4 solution mini-grids
 */
function renderSolutionsPage(
  doc: jsPDF,
  dims: PageDimensions,
  puzzles: WordSearchPuzzle[],
  settings: BookSettings,
  pageNumber: number,
  perPage: number
) {
  const { width, height, margin, contentWidth } = dims;
  const centerX = width / 2;

  // Running Header
  doc.setFont('times', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('ANSWERS & SOLUTIONS', margin, margin + 3);
  doc.text(settings.title || 'Word Search Puzzle Book', width - margin, margin + 3, { align: 'right' });

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.line(margin, margin + 6, width - margin, margin + 6);

  if (perPage === 4) {
    // 2x2 Grid Layout
    const colWidth = (contentWidth - 8) / 2;
    const rowHeight = (height - margin * 2 - 20) / 2;

    puzzles.forEach((puzzle, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const cellX = margin + col * (colWidth + 8);
      const cellY = margin + 12 + row * rowHeight;

      renderMiniSolution(doc, puzzle, cellX, cellY, colWidth, rowHeight);
    });
  } else {
    // 2 Per Page (Stacked top and bottom)
    const blockWidth = contentWidth;
    const blockHeight = (height - margin * 2 - 20) / 2;

    puzzles.forEach((puzzle, idx) => {
      const cellY = margin + 12 + idx * blockHeight;
      renderMiniSolution(doc, puzzle, margin, cellY, blockWidth, blockHeight);
    });
  }

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Page ${pageNumber}`, centerX, height - margin + 4, { align: 'center' });
}

/**
 * Render an individual mini solution puzzle grid with highlighted words
 */
function renderMiniSolution(
  doc: jsPDF,
  puzzle: WordSearchPuzzle,
  x: number,
  y: number,
  width: number,
  height: number
) {
  // Mini Header
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Puzzle #${puzzle.puzzleNumber}: ${puzzle.title}`, x + 2, y + 4);

  // Subtitle / category
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`${puzzle.placedWords.length} words hidden`, x + 2, y + 8);

  // Solution Grid placement
  // Build a lookup set of coordinates that are part of solution words
  const solutionCellSet = new Set<string>();
  puzzle.placedWords.forEach(pw => {
    pw.cells.forEach(c => solutionCellSet.add(`${c.r},${c.c}`));
  });

  const availableHeight = height - 16;
  const maxGridDim = Math.min(width * 0.62, availableHeight);
  const cellSize = maxGridDim / puzzle.gridSize;
  const gridStartX = x + 2;
  const gridStartY = y + 11;

  for (let r = 0; r < puzzle.gridSize; r++) {
    for (let c = 0; c < puzzle.gridSize; c++) {
      const cx = gridStartX + c * cellSize;
      const cy = gridStartY + r * cellSize;
      const isSolution = solutionCellSet.has(`${r},${c}`);

      if (isSolution) {
        // Highlighting background for solution letters
        doc.setFillColor(220, 232, 248);
        doc.setDrawColor(147, 197, 253);
        doc.setLineWidth(0.15);
        doc.rect(cx, cy, cellSize, cellSize, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(cellSize > 4.5 ? 7 : 5.5);
        doc.setTextColor(15, 23, 42);
        doc.text(puzzle.grid[r][c], cx + cellSize / 2, cy + cellSize / 2 + (cellSize > 4.5 ? 1 : 0.8), { align: 'center' });
      } else {
        // Unselected letters rendered faint or as muted dots
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(cellSize > 4.5 ? 5.5 : 4.5);
        doc.setTextColor(203, 213, 225);
        doc.text('·', cx + cellSize / 2, cy + cellSize / 2 + 0.6, { align: 'center' });
      }
    }
  }

  // Word coordinates index beside the mini grid
  const wordsX = gridStartX + puzzle.gridSize * cellSize + 4;
  const wordsWidth = (x + width) - wordsX;

  if (wordsWidth > 20) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text('WORD KEYS:', wordsX, y + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(100, 116, 139);

    let wY = y + 18;
    const maxEntries = Math.floor((height - 24) / 3.4);
    
    puzzle.placedWords.slice(0, maxEntries).forEach(pw => {
      const dirAbbr = getDirectionAbbreviation(pw.direction);
      const text = `${pw.word} (${pw.start.r + 1},${pw.start.c + 1} ${dirAbbr})`;
      doc.text(text, wordsX, wY);
      wY += 3.2;
    });

    if (puzzle.placedWords.length > maxEntries) {
      doc.text(`+ ${puzzle.placedWords.length - maxEntries} more`, wordsX, wY);
    }
  }
}

function getDirectionAbbreviation(dirName: string): string {
  if (dirName.includes('Left')) return '←';
  if (dirName.includes('Down-Right')) return '↘';
  if (dirName.includes('Down-Left')) return '↙';
  if (dirName.includes('Up-Right')) return '↗';
  if (dirName.includes('Up-Left')) return '↖';
  if (dirName.includes('Down')) return '↓';
  if (dirName.includes('Up')) return '↑';
  return '→';
}

/**
 * Generate a single puzzle PDF (for quick print)
 */
export function generateSinglePuzzlePDF(puzzle: WordSearchPuzzle, settings: BookSettings): jsPDF {
  const dims = getDimensions(settings.pageFormat);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [dims.width, dims.height]
  });

  renderPuzzlePage(doc, dims, puzzle, settings, 1);
  return doc;
}
