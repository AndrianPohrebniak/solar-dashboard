export interface TelemetryData {
  voltage: number;
  current: number;
  power: number;
  ldr: {
    tl: number;
    tr: number;
    bl: number;
    br: number;
  };
  angles: {
    pan: number;
    tilt: number;
  };
}

export type ConnectionStatus = 'Disconnected' | 'Connecting' | 'Connected' | 'Error';
