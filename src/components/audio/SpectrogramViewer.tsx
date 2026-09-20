import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

interface SpectrogramViewerProps {
  confidence?: number;
  isChainsaw?: boolean;
}

export const SpectrogramViewer: React.FC<SpectrogramViewerProps> = ({
  confidence = 0.92,
  isChainsaw = true,
}) => {
  // 32 time frames x 16 frequency bins
  const timeFrames = 32;
  const freqBins = 16;

  // Generate synthetic spectrogram power intensities
  const grid = Array.from({ length: freqBins }, (_, fIndex) => {
    // Frequency ranges from 8000 Hz (top) down to 0 Hz (bottom)
    const freqKhz = Math.round((8 - (fIndex * 8) / freqBins) * 10) / 10;

    return {
      freqKhz,
      values: Array.from({ length: timeFrames }, (_, tIndex) => {
        if (isChainsaw) {
          // Distinct chainsaw bands between 1.5 kHz and 3.5 kHz (bins 7 to 11)
          const inHarmonicBand = fIndex >= 7 && fIndex <= 11;
          const engineRevPulse = Math.sin((tIndex / timeFrames) * Math.PI * 4);
          if (inHarmonicBand) {
            return Math.min(1, 0.7 + 0.3 * Math.random() + engineRevPulse * 0.15);
          }
          // High pitch blade resonance (bins 3 to 5)
          if (fIndex >= 3 && fIndex <= 5) {
            return Math.min(1, 0.45 + 0.25 * Math.random());
          }
          // Low engine rumble (bins 14 to 15)
          if (fIndex >= 14) {
            return 0.6 + 0.2 * Math.random();
          }
          return Math.random() * 0.2;
        } else {
          // Natural forest: diffuse low frequency wind + occasional cicada / bird spike
          if (fIndex >= 13) return 0.4 * Math.random();
          if (fIndex === 4 && tIndex % 6 === 0) return 0.5; // bird chirp
          return Math.random() * 0.15;
        }
      }),
    };
  });

  const getHeatmapColor = (intensity: number) => {
    if (intensity > 0.8) return 'bg-amber-400';
    if (intensity > 0.6) return 'bg-orange-500';
    if (intensity > 0.4) return 'bg-teal-600';
    if (intensity > 0.2) return 'bg-teal-900';
    return 'bg-slate-900';
  };

  return (
    <div className="p-4 bg-slate-950 rounded-xl text-white font-sans">
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-200">64-Bin Log-Mel Spectrogram Representation</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-900 text-tealbrand-300">ESP32-S3 DSP</span>
          <span className="px-2 py-0.5 rounded bg-slate-900">128-pt FFT</span>
        </div>
      </div>

      {/* Spectrogram Grid Visualizer */}
      <div className="relative border border-slate-800 rounded-lg p-3 bg-slate-900/60 overflow-x-auto">
        <div className="flex gap-2">
          {/* Y-Axis (Frequency) */}
          <div className="flex flex-col justify-between text-[9px] text-slate-400 font-mono py-1 pr-1 border-r border-slate-800 flex-shrink-0">
            <span>8.0 kHz</span>
            <span>6.0 kHz</span>
            <span>4.0 kHz</span>
            <span>2.0 kHz</span>
            <span>0.2 kHz</span>
          </div>

          {/* Matrix Heatmap */}
          <div className="flex-1 min-w-[280px] space-y-1">
            {grid.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-0.5 h-1.5 w-full">
                {row.values.map((val, cIdx) => (
                  <div
                    key={cIdx}
                    className={`flex-1 rounded-2xs ${getHeatmapColor(val)}`}
                    title={`Freq: ${row.freqKhz} kHz • Intensity: ${Math.round(val * 100)}%`}
                  />
                ))}
              </div>
            ))}

            {/* X-Axis (Time) */}
            <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-2 border-t border-slate-800">
              <span>0.0s</span>
              <span>0.5s</span>
              <span>1.0s</span>
              <span>1.5s (Window End)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inference Breakdown */}
      <div className="mt-3 p-3 bg-slate-900/80 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div>
          <span className="text-slate-400 text-[11px]">TinyML Inference Classification:</span>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              Chainsaw: {Math.round(confidence * 100)}%
            </span>
            <span className="text-slate-400">
              Background: {Math.round((1 - confidence) * 100)}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-forest-900/50 text-forest-200 border border-forest-800 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-tealbrand-400" />
          <span>Confirmed over 3 analysis windows</span>
        </div>
      </div>
    </div>
  );
};
