import React, { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import { ConnectionPanel } from './ConnectionPanel';
import { RealTimeCharts } from './RealTimeCharts';
import { SensorsGrid } from './SensorsGrid';
import { TelemetryData, ConnectionStatus } from '../types';

interface ChartData extends TelemetryData {
  time: string;
}

export const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>('Disconnected');
  const [currentData, setCurrentData] = useState<TelemetryData | null>(null);
  const [history, setHistory] = useState<ChartData[]>([]);
  const clientRef = useRef<mqtt.MqttClient | null>(null);

  // Helper to get formatted time
  const getTimeString = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  };

  const handleConnect = (broker: string, topic: string) => {
    if (clientRef.current) {
      clientRef.current.end();
    }

    setStatus('Connecting');
    
    try {
      const client = mqtt.connect(broker, {
        keepalive: 60,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        username: import.meta.env.VITE_MQTT_USERNAME,
        password: import.meta.env.VITE_MQTT_PASSWORD,
      });

      client.on('connect', () => {
        setStatus('Connected');
        client.subscribe(topic, (err) => {
          if (err) {
            console.error('Subscription error:', err);
            setStatus('Error');
          } else {
            console.log(`Subscribed to topic: ${topic}`);
          }
        });
      });

      client.on('message', (receivedTopic, message) => {
        if (receivedTopic === topic) {
          try {
            const rawData = JSON.parse(message.toString());
            
            // Map the flat JSON structure from the real device:
            // {"pan":10.00,"tilt":75.00,"tl":1161,"tr":1502,"dl":832,"dr":933,"v":0.69,"i":0.00,"p":0.00}
            const parsedData: TelemetryData = {
              voltage: rawData.v ?? 0,
              current: rawData.i ?? 0,
              power: rawData.p ?? 0,
              ldr: {
                tl: Math.max(0, 4095 - (rawData.tl ?? 4095)),
                tr: Math.max(0, 4095 - (rawData.tr ?? 4095)),
                bl: Math.max(0, 4095 - (rawData.dl ?? 4095)), // mapping down-left to bottom-left
                br: Math.max(0, 4095 - (rawData.dr ?? 4095)), // mapping down-right to bottom-right
              },
              angles: {
                pan: rawData.pan ?? 0,
                tilt: rawData.tilt ?? 0,
              }
            };

            setCurrentData(parsedData);
            
            setHistory(prev => {
              const newHistory = [...prev, { ...parsedData, time: getTimeString() }];
              if (newHistory.length > 20) {
                return newHistory.slice(newHistory.length - 20);
              }
              return newHistory;
            });
          } catch (e) {
            console.error('Failed to parse MQTT message:', e);
          }
        }
      });

      client.on('error', (error) => {
        console.error('MQTT Connection Error:', error);
        setStatus('Error');
      });

      client.on('close', () => {
        if (status !== 'Disconnected') {
          setStatus('Disconnected');
        }
      });

      clientRef.current = client;
    } catch (error) {
      console.error('MQTT Setup Error:', error);
      setStatus('Error');
    }
  };

  const handleDisconnect = () => {
    if (clientRef.current) {
      clientRef.current.end();
      clientRef.current = null;
    }
    setStatus('Disconnected');
    setCurrentData(null);
    setHistory([]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.end();
      }
    };
  }, []);

  const hasData = currentData !== null && history.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
              Solar Tracker Telemetry
            </h1>
            <p className="text-slate-500 mt-2 text-sm">Real-time IoT Monitoring Dashboard</p>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">System Status</span>
              <span className={`text-sm font-medium ${status === 'Connected' ? 'text-emerald-500' : status === 'Error' ? 'text-rose-500' : 'text-slate-500'}`}>
                {status === 'Connected' ? 'Online' : status === 'Error' ? 'Error' : 'Offline'}
              </span>
            </div>
            <div className={`w-3 h-3 rounded-full ${status === 'Connected' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : status === 'Error' ? 'bg-rose-500' : 'bg-slate-300'}`}></div>
          </div>
        </header>

        <ConnectionPanel 
          status={status} 
          onConnect={handleConnect} 
          onDisconnect={handleDisconnect} 
        />

        {hasData ? (
          <div className="space-y-6">
            <RealTimeCharts data={history} />
            <SensorsGrid data={currentData} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 border-dashed rounded-2xl shadow-sm">
            <div className="w-16 h-16 mb-4 text-slate-300">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-slate-700 mb-2">НЕМАЄ ДАНИХ (NO DATA)</h3>
            <p className="text-slate-500 max-w-md text-center">
              {status === 'Connected' 
                ? 'Waiting for incoming telemetry on the subscribed topic...' 
                : 'Connect to the MQTT broker to start receiving real-time data.'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
