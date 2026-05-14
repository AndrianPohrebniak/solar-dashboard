import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TelemetryData } from '../types';

interface ChartData extends TelemetryData {
  time: string;
}

interface RealTimeChartsProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 border border-slate-200 p-3 rounded-lg shadow-xl backdrop-blur-sm">
        <p className="text-slate-500 text-xs mb-1">{label}</p>
        <p className="text-slate-800 font-medium">
          {payload[0].value.toFixed(2)} {payload[0].payload.unit}
        </p>
      </div>
    );
  }
  return null;
};

export const RealTimeCharts: React.FC<RealTimeChartsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Voltage Chart */}
      <div className="bg-white/50 border border-slate-200 rounded-xl p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-700 font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
            Voltage
          </h3>
          <span className="text-amber-600 font-mono text-lg font-bold">
            {data.length > 0 ? data[data.length - 1].voltage.toFixed(2) : '0.00'} V
          </span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.map(d => ({ ...d, unit: 'V' }))}>
              <defs>
                <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickMargin={8} />
              <YAxis domain={[0, 6]} stroke="#64748b" fontSize={10} tickFormatter={(val) => `${val}V`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={5} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
              <Line
                type="monotone"
                dataKey="voltage"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
                filter="url(#glowAmber)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Current Chart */}
      <div className="bg-white/50 border border-slate-200 rounded-xl p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-700 font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
            Current
          </h3>
          <span className="text-cyan-600 font-mono text-lg font-bold">
            {data.length > 0 ? data[data.length - 1].current.toFixed(1) : '0.0'} mA
          </span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.map(d => ({ ...d, unit: 'mA' }))}>
              <defs>
                <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickMargin={8} />
              <YAxis domain={[0, 'auto']} stroke="#64748b" fontSize={10} tickFormatter={(val) => `${val}`} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#0891b2"
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
                filter="url(#glowCyan)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Power Chart */}
      <div className="bg-white/50 border border-slate-200 rounded-xl p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-700 font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            Power
          </h3>
          <span className="text-emerald-600 font-mono text-lg font-bold">
            {data.length > 0 ? data[data.length - 1].power.toFixed(1) : '0.0'} mW
          </span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.map(d => ({ ...d, unit: 'mW' }))}>
              <defs>
                <filter id="glowEmerald" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickMargin={8} />
              <YAxis domain={[0, 'auto']} stroke="#64748b" fontSize={10} tickFormatter={(val) => `${val}`} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="power"
                stroke="#059669"
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
                filter="url(#glowEmerald)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
