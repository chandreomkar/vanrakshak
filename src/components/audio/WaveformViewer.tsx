import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Info } from 'lucide-react';

interface WaveformViewerProps {
  eventType?: string;
  confidence?: number;
}

export const WaveformViewer: React.FC<WaveformViewerProps> = ({
  eventType = 'possible_chainsaw',
  confidence = 0.92,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);

  // Generate synthetic waveform sample points
  const pointsCount = 120;
  const isChainsaw = eventType === 'possible_chainsaw';

  const waveformPoints = Array.from({ length: pointsCount }, (_, i) => {
    const t = i / pointsCount;
    // Harmonic chainsaw pattern: high frequency vibration + engine rev bursts
    if (isChainsaw) {
      const rev = Math.sin(t * Math.PI * 4);
      const carrier = Math.sin(t * 80) * 0.4;
      const noise = (Math.random() - 0.5) * 0.35;
      return Math.max(-0.95, Math.min(0.95, (rev * 0.5 + carrier + noise) * (confidence)));
    } else {
      // Gentle background forest noise: wind rustle + quiet bird chirps
      const wind = Math.sin(t * Math.PI * 2) * 0.15;
      const noise = (Math.random() - 0.5) * 0.1;
      return wind + noise;
    }
  });

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="p-4 bg-slate-900 rounded-xl text-white font-sans">
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-tealbrand-400" />
          <span className="font-semibold text-slate-200">16kHz Acoustic Waveform Window</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-800 font-mono">1.5s Sample</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 font-mono">INMP441 I2S Mic</span>
        </div>
      </div>

      {/* SVG Waveform Graphic */}
      <div className="relative h-28 bg-slate-950/80 rounded-lg p-2 border border-slate-800 overflow-hidden flex items-center">
        {/* Center zero line */}
        <div className="absolute inset-x-0 top-1/2 border-t border-slate-800/80" />

        {/* Playhead progress line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-md shadow-amber-400 z-10 transition-all duration-75"
          style={{ left: `${playProgress}%` }}
        />

        {/* Bar Waveform rendering */}
        <div className="flex items-center justify-between w-full h-full gap-0.5 z-0">
          {waveformPoints.map((val, idx) => {
            const heightPct = Math.max(8, Math.abs(val) * 90);
            const isPassed = (idx / pointsCount) * 100 <= playProgress;
            return (
              <div
                key={idx}
                className={`w-full rounded-xs transition-colors duration-150 ${
                  isPassed
                    ? 'bg-amber-400'
                    : isChainsaw
                    ? 'bg-tealbrand-400/80'
                    : 'bg-emerald-400/60'
                }`}
                style={{ height: `${heightPct}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Playback Controls & Waveform Legend */}
      <div className="flex items-center justify-between mt-3 text-xs">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'Pause Synthetic Audio' : 'Play Acoustic Pattern'}</span>
        </button>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>Amplitude: Peak {isChainsaw ? '-12 dBFS' : '-34 dBFS'}</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Bit Depth: 16-bit PCM</span>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center gap-1.5">
        <Info className="w-3 h-3 text-tealbrand-400 flex-shrink-0" />
        <span>Synthesized edge audio window representation. Raw forest audio remains safely on node for privacy.</span>
      </div>
    </div>
  );
};
