import React from 'react';
import { Printer, Globe, Sparkles } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenExport: () => void;
  onLoadPreset: () => void;
  language: 'gu' | 'en';
  onLanguageChange: (lang: 'gu' | 'en') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  onOpenExport,
  onLoadPreset,
  language,
  onLanguageChange,
}) => {
  const isEn = language === 'en';

  const navLinks = [
    { id: 'student', label: isEn ? 'Student Info' : 'વિદ્યાર્થી વિગત' },
    { id: 'school', label: isEn ? 'School & Logo' : 'શાળા અને લોગો' },
    { id: 'design', label: isEn ? 'Themes & Style' : 'થીમ અને શૈલી' },
    { id: 'security', label: isEn ? 'Security & Sign' : 'સુરક્ષા અને સહી' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element brand wordmark */}
        <a
          href="/"
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
          <span>{isEn ? 'Student ID Studio' : 'વિદ્યાર્થી આઈડી સ્ટુડિયો'}</span>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={`whitespace-nowrap transition-colors relative py-1 hover:text-slate-900 cursor-pointer ${
                activeTab === link.id
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-600'
              }`}
            >
              {link.label}
              {activeTab === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
          <button
            onClick={onLoadPreset}
            className="text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{isEn ? 'Switch Sample' : 'સેમ્પલ બદલો'}</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Switch */}
          <button
            onClick={() => onLanguageChange(isEn ? 'gu' : 'en')}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            title={isEn ? 'ગુજરાતીમાં બદલો' : 'Switch to English'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold">{isEn ? 'ગુજરાતી' : 'English'}</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenExport}
            className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isEn ? 'Print & Export' : 'પ્રિન્ટ અને ડાઉનલોડ'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
