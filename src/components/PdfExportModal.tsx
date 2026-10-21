import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  FileCheck, 
  Printer, 
  Check, 
  Loader2, 
  BookOpen, 
  ExternalLink 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { WordSearchPuzzle, BookSettings } from '../types/wordSearch';
import { generateBookPDFAsync } from '../services/pdfGenerator';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  puzzles: WordSearchPuzzle[];
  settings: BookSettings;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  puzzles,
  settings
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Initializing document...');
  const [pdfDoc, setPdfDoc] = useState<jsPDF | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
      setPdfDoc(null);
      setProgress(0);
      return;
    }

    // Start compiling PDF in browser using jsPDF
    setIsCompiling(true);
    setProgress(5);
    setStatusText('Preparing vector layout...');

    // Allow UI to mount before intensive rendering
    let isCancelled = false;

    const timer = setTimeout(async () => {
      try {
        const doc = await generateBookPDFAsync(puzzles, settings, (pct, status) => {
          if (!isCancelled) {
            setProgress(pct);
            setStatusText(status);
          }
        });

        if (!isCancelled) {
          const blob = doc.output('blob');
          const url = URL.createObjectURL(blob);
          setPdfDoc(doc);
          setPdfBlobUrl(url);
          setIsCompiling(false);
        }
      } catch (err) {
        console.error('Error generating PDF:', err);
        if (!isCancelled) {
          setStatusText('Generation failed. Please try again.');
          setIsCompiling(false);
        }
      }
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [isOpen, puzzles, settings]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!pdfDoc) return;
    const cleanFileName = (settings.title || 'word-search-book')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    pdfDoc.save(`${cleanFileName}.pdf`);
  };

  const handlePrint = () => {
    if (pdfBlobUrl) {
      const printWindow = window.open(pdfBlobUrl, '_blank');
      if (printWindow) {
        printWindow.focus();
      }
    }
  };

  const hasIntro = settings.includeIntro;
  const solPages = Math.ceil(puzzles.length / (settings.solutionsPerPage || 4));
  const totalPages = 1 + (hasIntro ? 1 : 0) + puzzles.length + 1 + solPages;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-serif-book">
                Export Word Search PDF Book
              </h2>
              <p className="text-[11px] text-slate-500">
                100% Client-Side jsPDF Rendering · Print-Ready Vector Typography
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          {/* Progress / Status */}
          {isCompiling ? (
            <div className="flex flex-col gap-3 py-6 items-center text-center">
              <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-800">{statusText}</p>
                <p className="text-[11px] text-slate-400 font-mono-grid tabular-nums">{progress}% completed</p>
              </div>
              <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-slate-900 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Document Summary Card */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <div className="text-xs font-bold text-slate-900 font-serif-book mb-2">
                  {settings.title || 'Word Search Puzzle Book'}
                </div>
                {settings.subtitle && (
                  <p className="text-[11px] text-slate-600 italic mb-3">
                    {settings.subtitle}
                  </p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-600 font-mono-grid pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-400 block text-[9px]">TOTAL PAGES</span>
                    <span className="font-bold text-slate-900">{totalPages} pages</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">PUZZLE COUNT</span>
                    <span className="font-bold text-slate-900">{puzzles.length} puzzles</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">PAGE TRIM</span>
                    <span className="font-bold text-slate-900 uppercase">{settings.pageFormat}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">SOLUTIONS</span>
                    <span className="font-bold text-slate-900">{settings.solutionsPerPage} per page</span>
                  </div>
                </div>
              </div>

              {/* Ready notice */}
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Your PDF book is completely rendered and ready for download or direct printing!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {pdfBlobUrl && (
              <a
                href={pdfBlobUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </a>
            )}

            <button
              onClick={handleDownload}
              disabled={isCompiling || !pdfDoc}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Download PDF Book</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
