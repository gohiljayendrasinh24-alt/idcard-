import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  ChevronRight,
  Eye,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { CardDesign, InstituteConfig, StudentProfile, ViewSide } from './types/card';
import {
  CARD_THEMES,
  DEFAULT_DESIGN,
  DEFAULT_INSTITUTE,
  SAMPLE_STUDENTS,
} from './utils/cardDefaults';
import { CardRenderer } from './components/CardRenderer';
import { LanyardHolder } from './components/LanyardHolder';
import { TopBar } from './components/TopBar';
import { EditorPanel } from './components/EditorPanel';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { SignaturePadModal } from './components/SignaturePadModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [student, setStudent] = useState<StudentProfile>(SAMPLE_STUDENTS[0]);
  const [institute, setInstitute] = useState<InstituteConfig>(DEFAULT_INSTITUTE);
  const [design, setDesign] = useState<CardDesign>(DEFAULT_DESIGN);
  const [activeTab, setActiveTab] = useState<string>('student');
  const [currentSide, setCurrentSide] = useState<ViewSide>('front');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [appLanguage, setAppLanguage] = useState<'gu' | 'en'>('gu');

  // Modals
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState<boolean>(false);
  const [isSignatureOpen, setIsSignatureOpen] = useState<boolean>(false);

  const isEn = appLanguage === 'en';
  const currentTheme = CARD_THEMES[design.themeId] || CARD_THEMES['royal-navy'];

  // Switch between sample students
  const handleLoadNextPreset = () => {
    const currentIndex = SAMPLE_STUDENTS.findIndex((s) => s.id === student.id);
    const nextIndex = (currentIndex + 1) % SAMPLE_STUDENTS.length;
    setStudent(SAMPLE_STUDENTS[nextIndex]);
  };

  const handleSelectStudentPreset = (selectedStudent: StudentProfile) => {
    setStudent(selectedStudent);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Navigation */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenExport={() => setIsExportOpen(true)}
        onLoadPreset={handleLoadNextPreset}
        language={appLanguage}
        onLanguageChange={setAppLanguage}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor Controls Panel */}
        <div className="lg:col-span-5 h-[calc(100vh-6.5rem)] min-h-[580px] sticky top-20">
          <EditorPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            student={student}
            onStudentChange={setStudent}
            institute={institute}
            onInstituteChange={setInstitute}
            design={design}
            onDesignChange={setDesign}
            onOpenSignaturePad={() => setIsSignatureOpen(true)}
            onOpenWebcam={() => setIsWebcamOpen(true)}
            language={appLanguage}
          />
        </div>

        {/* Right Column: Live Card Stage & Viewport */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Card View Controls Strip */}
          <div className="bg-white p-2.5 px-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Front / Back / Split view selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setCurrentSide('front')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  currentSide === 'front'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isEn ? 'Front View' : 'આગળનો ભાગ (Front)'}
              </button>
              <button
                onClick={() => setCurrentSide('back')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  currentSide === 'back'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isEn ? 'Back View' : 'પાછળનો ભાગ (Back)'}
              </button>
              <button
                onClick={() => setCurrentSide('split')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  currentSide === 'split'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isEn ? 'Both Sides' : 'બંને બાજુ (Side-by-Side)'}
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 text-slate-600">
              <button
                onClick={() => setZoomScale((prev) => Math.max(0.8, prev - 0.1))}
                className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-medium px-1 text-slate-500 tabular-nums">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((prev) => Math.min(1.4, prev + 0.1))}
                className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomScale(1)}
                className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Reset Zoom"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas Stage Frame */}
          <div className="bg-slate-200/60 rounded-3xl border border-slate-300/70 p-6 sm:p-10 min-h-[520px] flex items-center justify-center overflow-hidden relative shadow-inner">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Scaled ID Card Stage */}
            <div
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="flex items-center justify-center"
            >
              {currentSide === 'front' && (
                <LanyardHolder
                  enabled={design.showLanyardSlot && design.layout === 'vertical'}
                  showStrap={design.showLanyardStrap}
                  instituteName={institute.nameEn}
                  themeColor={currentTheme.primaryColor}
                  isVertical={design.layout === 'vertical'}
                >
                  <CardRenderer
                    student={student}
                    institute={institute}
                    design={design}
                    theme={currentTheme}
                    side="front"
                  />
                </LanyardHolder>
              )}

              {currentSide === 'back' && (
                <LanyardHolder
                  enabled={design.showLanyardSlot && design.layout === 'vertical'}
                  showStrap={design.showLanyardStrap}
                  instituteName={institute.nameEn}
                  themeColor={currentTheme.primaryColor}
                  isVertical={design.layout === 'vertical'}
                >
                  <CardRenderer
                    student={student}
                    institute={institute}
                    design={design}
                    theme={currentTheme}
                    side="back"
                  />
                </LanyardHolder>
              )}

              {currentSide === 'split' && (
                <div className="flex flex-wrap gap-6 items-center justify-center max-w-full">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-semibold text-slate-600 mb-2">
                      {isEn ? 'Front' : 'આગળનો ભાગ'}
                    </span>
                    <CardRenderer
                      student={student}
                      institute={institute}
                      design={design}
                      theme={currentTheme}
                      side="front"
                    />
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-semibold text-slate-600 mb-2">
                      {isEn ? 'Back' : 'પાછળનો ભાગ'}
                    </span>
                    <CardRenderer
                      student={student}
                      institute={institute}
                      design={design}
                      theme={currentTheme}
                      side="back"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sample Student Quick Switcher & Card Standards Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick Students Selection */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isEn ? 'Sample Student Profiles' : 'સેમ્પલ વિદ્યાર્થી પ્રોફાઈલ'}</span>
                </span>
                <span className="text-[10px] text-slate-500">ક્લિક કરીને લોડ કરો</span>
              </div>

              <div className="space-y-1.5">
                {SAMPLE_STUDENTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectStudentPreset(s)}
                    className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                      student.id === s.id
                        ? 'bg-indigo-50/80 border border-indigo-200 text-indigo-900 font-semibold'
                        : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-300 shrink-0">
                        <img
                          src={s.photoUrl}
                          alt={s.fullNameEn}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <div className="text-xs truncate">{isEn ? s.fullNameEn : s.fullNameGu}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {s.studentId} · {isEn ? s.gradeEn : s.gradeGu}
                        </div>
                      </div>
                    </div>
                    {student.id === s.id && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Standard & Printing Specifications */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block mb-1.5">
                  {isEn ? 'PVC Card Production Specifications' : 'પ્લાસ્ટિક આઈડી કાર્ડ ઉત્પાદન માપદંડ'}
                </span>
                <div className="space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span>{isEn ? 'Standard Size:' : 'પ્રમાણિત સાઈઝ:'}</span>
                    <strong className="font-mono text-slate-900">CR80 (85.6 × 53.98 mm)</strong>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span>{isEn ? 'Recommended DPI:' : 'પ્રિન્ટ રીઝોલ્યુશન:'}</span>
                    <strong className="font-mono text-slate-900">300 DPI High-Def</strong>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span>{isEn ? 'Barcode Type:' : 'બારકોડ ફોર્મેટ:'}</span>
                    <strong className="font-mono text-slate-900">Code 128 / QR-2D</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isEn ? 'Compatibility:' : 'પ્રિન્ટર સુસંગતતા:'}</span>
                    <span className="text-emerald-700 font-medium">Evolis, Zebra, Fargo PVC</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Open Print & Export Studio' : 'પ્રિન્ટ & ડાઉનલોડ સ્ટુડિયો ખોલો'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Hidden Print Container for native Ctrl+P / window.print() */}
      <div id="print-card-container" className="hidden print-sheet-container print-only">
        <div className="flex items-center justify-center gap-8">
          <CardRenderer
            student={student}
            institute={institute}
            design={design}
            theme={currentTheme}
            side="front"
            isPrintable={true}
          />
          <CardRenderer
            student={student}
            institute={institute}
            design={design}
            theme={currentTheme}
            side="back"
            isPrintable={true}
          />
        </div>
      </div>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isWebcamOpen}
        onClose={() => setIsWebcamOpen(false)}
        onCapture={(dataUrl) => setStudent((prev) => ({ ...prev, photoUrl: dataUrl }))}
        isEn={isEn}
      />

      {/* Signature Pad Modal */}
      <SignaturePadModal
        isOpen={isSignatureOpen}
        onClose={() => setIsSignatureOpen(false)}
        onSave={(dataUrl) => setInstitute((prev) => ({ ...prev, principalSignatureUrl: dataUrl }))}
        isEn={isEn}
      />

      {/* Export & Download Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        student={student}
        institute={institute}
        design={design}
        theme={currentTheme}
        isEn={isEn}
      />
    </div>
  );
}
