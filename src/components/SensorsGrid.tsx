import React from 'react';
import { Sun, Navigation } from 'lucide-react';
import { TelemetryData } from '../types';
import { cn } from '../lib/utils';

interface SensorsGridProps {
  data: TelemetryData | null;
}

export const SensorsGrid: React.FC<SensorsGridProps> = ({ data }) => {
  // LDR max value is 4095
  const getLdrOpacity = (value: number) => {
    return Math.max(0.1, value / 4095);
  };

  const ldrValues = data?.ldr || { tl: 0, tr: 0, bl: 0, br: 0 };
  const angles = data?.angles || { pan: 0, tilt: 0 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* LDR Sensors Grid */}
      <div className="bg-white/50 border border-slate-200 rounded-xl p-6 shadow-sm backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

        <div className="flex items-center gap-2 mb-6">
          <Sun className="w-5 h-5 text-amber-500" />
          <h3 className="text-slate-700 font-medium">LDR Sensors Map</h3>
        </div>

        <div className="relative max-w-xs mx-auto aspect-square p-8">
          {/* Crosshair decoration */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-full h-px bg-slate-300"></div>
            <div className="h-full w-px bg-slate-300 absolute"></div>
            <div className="w-16 h-16 rounded-full border border-slate-300 absolute"></div>
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full relative z-10">
            {/* Top Left */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 shadow-sm relative overflow-hidden group">
              <div
                className="absolute inset-0 bg-amber-400 transition-opacity duration-300"
                style={{ opacity: getLdrOpacity(ldrValues.tl) * 0.4 }}
              ></div>
              <span className="text-xs text-slate-500 font-medium mb-1 z-10 relative">TL</span>
              <span className={cn(
                "text-2xl font-mono font-bold z-10 relative transition-colors duration-300",
                ldrValues.tl > 2000 ? "text-amber-600" : "text-slate-700"
              )}>{ldrValues.tl}</span>
            </div>

            {/* Top Right */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 shadow-sm relative overflow-hidden">
              <div
                className="absolute inset-0 bg-amber-400 transition-opacity duration-300"
                style={{ opacity: getLdrOpacity(ldrValues.tr) * 0.4 }}
              ></div>
              <span className="text-xs text-slate-500 font-medium mb-1 z-10 relative">TR</span>
              <span className={cn(
                "text-2xl font-mono font-bold z-10 relative transition-colors duration-300",
                ldrValues.tr > 2000 ? "text-amber-600" : "text-slate-700"
              )}>{ldrValues.tr}</span>
            </div>

            {/* Bottom Left */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 shadow-sm relative overflow-hidden">
              <div
                className="absolute inset-0 bg-amber-400 transition-opacity duration-300"
                style={{ opacity: getLdrOpacity(ldrValues.bl) * 0.4 }}
              ></div>
              <span className="text-xs text-slate-500 font-medium mb-1 z-10 relative">BL</span>
              <span className={cn(
                "text-2xl font-mono font-bold z-10 relative transition-colors duration-300",
                ldrValues.bl > 2000 ? "text-amber-600" : "text-slate-700"
              )}>{ldrValues.bl}</span>
            </div>

            {/* Bottom Right */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 shadow-sm relative overflow-hidden">
              <div
                className="absolute inset-0 bg-amber-400 transition-opacity duration-300"
                style={{ opacity: getLdrOpacity(ldrValues.br) * 0.4 }}
              ></div>
              <span className="text-xs text-slate-500 font-medium mb-1 z-10 relative">BR</span>
              <span className={cn(
                "text-2xl font-mono font-bold z-10 relative transition-colors duration-300",
                ldrValues.br > 2000 ? "text-amber-600" : "text-slate-700"
              )}>{ldrValues.br}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mechanics / Angles Module */}
      <div className="bg-white/50 border border-slate-200 rounded-xl p-6 shadow-sm backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

        <div className="flex items-center gap-2 mb-6">
          <Navigation className="w-5 h-5 text-cyan-600" />
          <h3 className="text-slate-700 font-medium">Servos Position</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-6 h-[calc(100%-3rem)] items-center justify-center">

          {/* Pan Indicator (0-180) */}
          <div className="flex-1 w-full bg-slate-50/50 rounded-2xl p-6 border border-slate-200 flex flex-col items-center justify-center relative">
            <div className="text-sm text-slate-500 mb-4 uppercase tracking-wider font-semibold">Pan Angle</div>
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Semi-circle background */}
              <svg viewBox="0 0 100 50" className="absolute top-0 left-0 w-full h-full overflow-visible">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(angles.pan / 180) * 125} 125`}
                  className="transition-all duration-500 ease-out drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                />
              </svg>
              <div className="absolute bottom-2 flex flex-col items-center">
                <span className="text-3xl font-mono font-bold text-cyan-600">{angles.pan.toFixed(1)}°</span>
                <span className="text-[10px] text-slate-500">0 - 180°</span>
              </div>
            </div>
          </div>

          {/* Tilt Indicator (0-90) */}
          <div className="flex-1 w-full bg-slate-50/50 rounded-2xl p-6 border border-slate-200 flex flex-col items-center justify-center relative">
            <div className="text-sm text-slate-500 mb-4 uppercase tracking-wider font-semibold">Tilt Angle</div>
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Quarter-circle background */}
              <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="8"
                  strokeDasharray={`${(angles.tilt / 90) * (2 * Math.PI * 40 * 0.25)} ${2 * Math.PI * 40}`}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-mono font-bold text-purple-600">{angles.tilt.toFixed(1)}°</span>
                <span className="text-[10px] text-slate-500 mt-1">0 - 90°</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
