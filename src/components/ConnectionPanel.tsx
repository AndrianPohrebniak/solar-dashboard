import React, { useState } from 'react';
import { Play, Square, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { ConnectionStatus } from '../types';

interface ConnectionPanelProps {
  status: ConnectionStatus;
  onConnect: (broker: string, topic: string) => void;
  onDisconnect: () => void;
}

export const ConnectionPanel: React.FC<ConnectionPanelProps> = ({ status, onConnect, onDisconnect }) => {
  const [broker, setBroker] = useState(import.meta.env.VITE_MQTT_BROKER || 'wss://34d4937c7a8f4488b256bc82e49d4a96.s1.eu.hivemq.cloud:8884/mqtt');
  const [topic, setTopic] = useState(import.meta.env.VITE_MQTT_TOPIC || 'andrian_diploma_2026/tracker/telemetry');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'Connected' || status === 'Connecting') {
      onDisconnect();
    } else {
      onConnect(broker, topic);
    }
  };

  const isConnected = status === 'Connected';
  const isConnecting = status === 'Connecting';

  return (
    <div className="bg-white/80 border border-slate-200 rounded-xl p-4 shadow-sm backdrop-blur-sm mb-6">
      <form onSubmit={handleConnect} className="flex flex-col md:flex-row items-end md:items-center gap-4">

        <div className="flex-1 w-full flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1 font-medium tracking-wide uppercase">MQTT Broker URL</label>
            <input
              type="text"
              value={broker}
              onChange={(e) => setBroker(e.target.value)}
              disabled={true}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors disabled:opacity-50"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-500 mb-1 font-medium tracking-wide uppercase">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={true}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors w-full md:w-auto justify-center",
            status === 'Connected' ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.2)]" :
              status === 'Connecting' ? "bg-amber-50 border-amber-200 text-amber-600" :
                status === 'Error' ? "bg-rose-50 border-rose-200 text-rose-600" :
                  "bg-slate-50 border-slate-200 text-slate-500"
          )}>
            {status === 'Connected' && <Wifi className="w-4 h-4 animate-pulse" />}
            {status === 'Connecting' && <Wifi className="w-4 h-4 animate-pulse opacity-50" />}
            {status === 'Disconnected' && <WifiOff className="w-4 h-4" />}
            {status === 'Error' && <AlertTriangle className="w-4 h-4" />}
            {status}
          </div>

          <button
            type="submit"
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 min-w-[140px]",
              isConnected || isConnecting
                ? "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            )}
          >
            {isConnected || isConnecting ? (
              <><Square className="w-4 h-4" fill="currentColor" /> Disconnect</>
            ) : (
              <><Play className="w-4 h-4" fill="currentColor" /> Connect</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
