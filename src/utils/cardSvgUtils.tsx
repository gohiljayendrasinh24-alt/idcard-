import React from 'react';

// Generates a realistic Code 128 style Barcode as crisp scalable SVG
export function BarcodeSVG({ value, height = 36, showText = true }: { value: string; height?: number; showText?: boolean }) {
  // Deterministic stripe pattern generation based on characters in value
  const bars: { width: number; isBlack: boolean }[] = [];
  
  // Start pattern
  bars.push({ width: 2, isBlack: true });
  bars.push({ width: 1, isBlack: false });
  bars.push({ width: 2, isBlack: true });
  bars.push({ width: 2, isBlack: false });

  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    // 4 alternating bars per character
    const b1 = (code % 3) + 1;
    const s1 = ((code >> 1) % 2) + 1;
    const b2 = ((code >> 2) % 3) + 1;
    const s2 = ((code >> 3) % 2) + 1;
    bars.push({ width: b1, isBlack: true });
    bars.push({ width: s1, isBlack: false });
    bars.push({ width: b2, isBlack: true });
    bars.push({ width: s2, isBlack: false });
  }

  // Stop pattern
  bars.push({ width: 2, isBlack: true });
  bars.push({ width: 1, isBlack: false });
  bars.push({ width: 3, isBlack: true });
  bars.push({ width: 1, isBlack: false });
  bars.push({ width: 2, isBlack: true });

  const totalWidth = bars.reduce((acc, b) => acc + b.width, 0);

  let currentX = 0;
  const renderedBars: React.ReactNode[] = [];

  bars.forEach((b, idx) => {
    if (b.isBlack) {
      renderedBars.push(
        <rect
          key={idx}
          x={currentX}
          y={0}
          width={b.width}
          height={height}
          fill="#111827"
        />
      );
    }
    currentX += b.width;
  });

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="w-full h-8 max-w-[170px]"
        preserveAspectRatio="none"
      >
        {renderedBars}
      </svg>
      {showText && (
        <span className="font-mono text-[9px] tracking-widest text-slate-700 font-semibold mt-0.5">
          *{value}*
        </span>
      )}
    </div>
  );
}

// Generates an authentic scannable-looking QR Code matrix SVG
export function QRCodeSVG({ data, size = 64 }: { data: string; size?: number }) {
  // 21x21 QR Code grid simulation
  const matrixSize = 21;
  const grid: boolean[][] = Array(matrixSize)
    .fill(false)
    .map(() => Array(matrixSize).fill(false));

  // Finder patterns at top-left, top-right, bottom-left
  const addFinderPattern = (rowStart: number, colStart: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          grid[rowStart + r][colStart + c] = true;
        }
      }
    }
  };

  addFinderPattern(0, 0);
  addFinderPattern(0, 14);
  addFinderPattern(14, 0);

  // Timing patterns
  for (let i = 8; i < 13; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Pseudo-random pseudo-deterministic filling using hash of data
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash * 31 + data.charCodeAt(i)) & 0xffffffff;
  }

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Don't overwrite finders or timing patterns
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= 13;
      const inBottomLeft = r >= 13 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
        const seed = (r * 37 + c * 43 + hash) & 0xffff;
        grid[r][c] = (seed % 100) > 42;
      }
    }
  }

  const moduleSize = size / matrixSize;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="bg-white p-0.5 rounded shadow-xs"
    >
      <rect width={size} height={size} fill="#ffffff" />
      {grid.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * moduleSize}
              y={r * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill="#0f172a"
            />
          ) : null
        )
      )}
    </svg>
  );
}

// Authentic Official Institute Stamp
export function OfficialStampSVG({
  schoolName = 'શ્રી સરસ્વતી વિદ્યામંદિર',
  city = 'રાજકોટ',
  size = 72,
  color = '#1e3a8a',
}: {
  schoolName?: string;
  city?: string;
  size?: number;
  color?: string;
}) {
  return (
    <div
      style={{ width: size, height: size, color }}
      className="relative select-none pointer-events-none opacity-85 rotate-[-12deg]"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Outer dashed/solid double border */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="4 2"
        />
        <circle
          cx="50"
          cy="50"
          r="43"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* Curved Path for Text */}
        <path
          id="stampTextPathTop"
          d="M 16 50 A 34 34 0 0 1 84 50"
          fill="none"
        />
        <path
          id="stampTextPathBottom"
          d="M 84 50 A 34 34 0 0 1 16 50"
          fill="none"
        />

        <text
          fontSize="7.5"
          fontWeight="bold"
          fill="currentColor"
          className="font-sans uppercase tracking-tight"
        >
          <textPath
            href="#stampTextPathTop"
            startOffset="50%"
            textAnchor="middle"
          >
            {schoolName.substring(0, 24)}
          </textPath>
        </text>

        <text
          fontSize="7.5"
          fontWeight="bold"
          fill="currentColor"
          className="font-sans uppercase tracking-widest"
        >
          <textPath
            href="#stampTextPathBottom"
            startOffset="50%"
            textAnchor="middle"
          >
            ★ {city} ★ VERIFIED
          </textPath>
        </text>

        {/* Center Emblem / Star */}
        <g transform="translate(50, 50)">
          <path
            d="M0,-12 L3,-3 L12,-3 L5,2 L8,11 L0,6 L-8,11 L-5,2 L-12,-3 L-3,-3 Z"
            fill="currentColor"
            opacity="0.9"
          />
        </g>
      </svg>
    </div>
  );
}

// Authentic Principal Calligraphic Signature
export function PrincipalSignatureSVG({
  width = 110,
  height = 36,
  color = '#1e3a8a',
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 55"
      style={{ width, height }}
      className="overflow-visible"
    >
      <path
        d="M 12 40 C 25 15, 30 8, 42 12 C 55 16, 45 42, 38 45 C 32 47, 45 28, 62 25 C 75 22, 70 38, 78 35 C 88 32, 92 18, 102 22 C 112 26, 105 38, 118 32 C 128 28, 138 22, 150 25 M 35 42 Q 85 48 145 38"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Micro Hologram Seal Simulation
export function HologramBadge() {
  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-xs border border-amber-300/40 bg-linear-to-tr from-amber-200 via-rose-200 via-cyan-200 to-emerald-200 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center opacity-70">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-900">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 1" />
          <path d="M12 4 L14 9 L19 10 L15 14 L16 19 L12 16 L8 19 L9 14 L5 10 L10 9 Z" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent transform -rotate-45" />
    </div>
  );
}

// Smart Card EMV Chip Simulation
export function SmartChipSVG() {
  return (
    <div className="w-9 h-7 rounded-sm bg-linear-to-br from-amber-200 via-amber-300 to-yellow-500 border border-yellow-600/40 shadow-xs relative overflow-hidden flex items-center justify-center">
      {/* Chip contact traces */}
      <div className="w-full h-full relative">
        <div className="absolute left-0 top-1/2 w-full h-[1px] bg-yellow-700/60" />
        <div className="absolute left-1/3 top-0 w-[1px] h-full bg-yellow-700/60" />
        <div className="absolute left-2/3 top-0 w-[1px] h-full bg-yellow-700/60" />
        <div className="absolute left-1/4 top-1/4 w-1/2 h-1/2 rounded-full border border-yellow-700/60" />
      </div>
    </div>
  );
}
