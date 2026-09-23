import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { Download, Printer, X, Check, FileImage, LayoutGrid, Loader2 } from 'lucide-react';
import { CardDesign, CardTheme, InstituteConfig, StudentProfile } from '../types/card';
import { CardRenderer } from './CardRenderer';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  institute: InstituteConfig;
  design: CardDesign;
  theme: CardTheme;
  isEn?: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  student,
  institute,
  design,
  theme,
  isEn = false,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const downloadElementAsImage = async (elementId: string, filename: string) => {
    setIsExporting(true);
    setExportSuccess(null);
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found');
      }

      const canvas = await html2canvas(element, {
        scale: 3, // Crisp 3x print resolution (approx 300 DPI)
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });

      setExportSuccess(
        isEn ? `Successfully downloaded ${filename}` : `${filename} સફળતાપૂર્વક ડાઉનલોડ થયું!`
      );
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {isEn ? 'Print & Export Identity Card' : 'આઈડી કાર્ડ પ્રિન્ટ અને ડાઉનલોડ'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEn
                ? 'Standard PVC Card (CR80) & High-Resolution Print Ready'
                : 'સ્ટાન્ડર્ડ પ્લાસ્ટિક PVC કાર્ડ અને A4 પ્રિન્ટેબલ શીટ ફોર્મેટ'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Download Front */}
            <button
              onClick={() =>
                downloadElementAsImage(
                  'export-card-front',
                  `StudentID_${student.rollNo}_Front.png`
                )
              }
              disabled={isExporting}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all text-left flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileImage className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                  {isEn ? 'Download Front (PNG)' : 'આગળનો ભાગ ડાઉનલોડ કરો'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isEn ? 'High-res image with photo & barcode' : 'હાઈ-ક્વોલિટી ફોટો અને બારકોડ સહિત'}
                </p>
              </div>
            </button>

            {/* Download Back */}
            <button
              onClick={() =>
                downloadElementAsImage(
                  'export-card-back',
                  `StudentID_${student.rollNo}_Back.png`
                )
              }
              disabled={isExporting}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all text-left flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileImage className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                  {isEn ? 'Download Back (PNG)' : 'પાછળનો ભાગ ડાઉનલોડ કરો'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isEn ? 'Rules, residential address & signature' : 'નિયમો, સરનામું અને અધિકૃત સહી'}
                </p>
              </div>
            </button>

            {/* Download Both Combined */}
            <button
              onClick={() =>
                downloadElementAsImage(
                  'export-card-combined',
                  `StudentID_${student.rollNo}_Complete.png`
                )
              }
              disabled={isExporting}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all text-left flex items-start gap-3.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                  {isEn ? 'Download Both (Side-by-Side)' : 'બંને બાજુ એક સાથે ડાઉનલોડ'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isEn ? 'Perfect for PVC printer double-sided' : 'પ્લાસ્ટિક કાર્ડ પ્રિન્ટિંગ માટે ઉત્તમ'}
                </p>
              </div>
            </button>

            {/* Print Directly */}
            <button
              onClick={triggerPrint}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all text-left flex items-start gap-3.5 group cursor-pointer bg-slate-50/50"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                  {isEn ? 'Print (Direct / PDF)' : 'ડાયરેક્ટ પ્રિન્ટ / PDF બનાવો'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isEn ? 'Standard card dimensions with cut marks' : 'કટીંગ માર્ક સાથે પ્રિન્ટર પર મોકલો'}
                </p>
              </div>
            </button>
          </div>

          {/* Export status */}
          {isExporting && (
            <div className="flex items-center justify-center gap-2 p-3 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-semibold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isEn ? 'Rendering high-resolution card...' : 'હાઈ-ડેફિનેશન કાર્ડ તૈયાર થઈ રહ્યું છે...'}</span>
            </div>
          )}

          {exportSuccess && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{exportSuccess}</span>
            </div>
          )}

          {/* Hidden/Offscreen Elements for HTML2Canvas & Print Rendering */}
          <div className="overflow-x-auto p-4 bg-slate-100 rounded-xl border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{isEn ? 'Print Sheet Preview (Front & Back):' : 'પ્રિન્ટ પૂર્વાવલોકન (આગળ અને પાછળ):'}</span>
            </div>

            {/* Combined Container Target */}
            <div
              id="export-card-combined"
              className="inline-flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-xs"
            >
              <div id="export-card-front">
                <CardRenderer
                  student={student}
                  institute={institute}
                  design={design}
                  theme={theme}
                  side="front"
                  isPrintable={true}
                />
              </div>

              <div id="export-card-back">
                <CardRenderer
                  student={student}
                  institute={institute}
                  design={design}
                  theme={theme}
                  side="back"
                  isPrintable={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>{isEn ? 'CR80 standard: 85.6mm × 54.0mm' : 'પ્રમાણિત માપ: 85.6mm × 54.0mm (CR80)'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            {isEn ? 'Done' : 'પૂર્ણ થયું'}
          </button>
        </div>
      </div>
    </div>
  );
};
