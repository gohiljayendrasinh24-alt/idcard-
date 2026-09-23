import React from 'react';

interface LanyardHolderProps {
  children: React.ReactNode;
  enabled: boolean;
  showStrap?: boolean;
  instituteName?: string;
  themeColor?: string;
  isVertical?: boolean;
}

export const LanyardHolder: React.FC<LanyardHolderProps> = ({
  children,
  enabled,
  showStrap = true,
  instituteName = 'SARASWATI VIDYAMANDIR',
  themeColor = '#0f2744',
  isVertical = true,
}) => {
  if (!enabled) {
    return <div className="inline-block relative">{children}</div>;
  }

  return (
    <div className="flex flex-col items-center select-none">
      {/* Lanyard Fabric Strap (Top hanging) */}
      {showStrap && (
        <div className="flex flex-col items-center -mb-2 z-10">
          {/* Hanging strap loop */}
          <div
            style={{ backgroundColor: themeColor }}
            className="w-10 h-16 rounded-t-sm shadow-md flex items-center justify-center overflow-hidden border-x border-black/20 relative"
          >
            {/* Lanyard fabric texture lines */}
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#fff,#fff_2px,transparent_2px,transparent_6px)]" />
            <div className="rotate-90 whitespace-nowrap text-[8px] font-bold tracking-widest text-white/90 uppercase font-mono">
              {instituteName.slice(0, 16)}
            </div>
          </div>

          {/* Metal swivel clip & hook */}
          <div className="flex flex-col items-center">
            {/* Metal Ring */}
            <div className="w-5 h-2.5 rounded-full border-2 border-slate-400 bg-linear-to-b from-slate-200 to-slate-400 shadow-xs -mt-0.5" />
            {/* Lobster Claw clasp hook */}
            <div className="w-3 h-4 bg-linear-to-r from-slate-300 via-slate-100 to-slate-400 rounded-b-xs border border-slate-500 shadow-sm flex items-end justify-center pb-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            </div>
          </div>
        </div>
      )}

      {/* Clear Acrylic Pouch Holder */}
      <div
        className={`relative p-3 pt-5 rounded-2xl bg-white/40 backdrop-blur-xs border border-slate-300/80 shadow-2xl transition-all duration-300 ${
          isVertical ? 'max-w-[340px]' : 'max-w-[500px]'
        }`}
        style={{
          boxShadow: '0 20px 35px -10px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.6) inset',
        }}
      >
        {/* Top Punch Slot for Clip */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-2 bg-slate-200/90 rounded-full border border-slate-400/70 shadow-inner flex items-center justify-center">
          <div className="w-6 h-1 rounded-full bg-slate-400/40" />
        </div>

        {/* Card itself inside holder */}
        <div className="relative z-0 overflow-hidden rounded-xl">
          {children}
        </div>

        {/* Glossy Plastic Reflection Sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-tr from-white/0 via-white/10 to-white/30 opacity-70" />
      </div>
    </div>
  );
};
