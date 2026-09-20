import React, { useState } from 'react';
import { WaveformViewer } from '../components/audio/WaveformViewer';
import { SpectrogramViewer } from '../components/audio/SpectrogramViewer';
import {
  Activity,
  Cpu,
  Shield,
  WifiOff,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const SoundAnalysisPage: React.FC = () => {
  const [selectedSoundType, setSelectedSoundType] = useState<'chainsaw' | 'background' | 'cicada'>(
    'chainsaw'
  );

  const soundProfiles = {
    chainsaw: {
      label: 'Chainsaw Acoustic Signature',
      confidence: 0.92,
      isChainsaw: true,
      description:
        '2-stroke gas engine exhaust pulses and sharp cutting tooth mechanical vibrations generate concentrated energy between 1.5 kHz and 3.5 kHz.',
      features: 'High crest factor, periodic harmonic bursts, high-frequency cutting teeth noise',
    },
    background: {
      label: 'Calm Forest Ambient Soundscape',
      confidence: 0.08,
      isChainsaw: false,
      description:
        'Wind rustling through canopy foliage and distant natural bird vocalizations with diffuse spectral energy concentrated below 800 Hz.',
      features: 'Low crest factor, broadband white/pink spectral decay, sporadic avian calls',
    },
    cicada: {
      label: 'Cicada Chorus & High Insect Noise',
      confidence: 0.14,
      isChainsaw: false,
      description:
        'High frequency resonant buzzing between 5 kHz and 7 kHz; clearly segregated from mechanical combustion engine frequencies by the DSP filterbank.',
      features: 'Monotonic ultrasonic/high-kHz oscillation, non-pulsing steady state energy',
    },
  };

  const current = soundProfiles[selectedSoundType];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-forest-800" />
          <h1 className="text-xl font-bold text-slate-900">Acoustic Edge-AI Pipeline & Sound Analysis</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Local TinyML audio inference executed in real-time on the ESP32-S3 microcontroller
        </p>
      </div>

      {/* Mandatory Privacy Notice */}
      <div className="p-4 bg-tealbrand-50 border border-tealbrand-200 rounded-2xl text-tealbrand-950 flex items-start gap-3 shadow-xs">
        <Shield className="w-5 h-5 text-tealbrand-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-tealbrand-900">
            Acoustic Privacy & Bandwidth Protection Rule
          </p>
          <p className="text-tealbrand-800 leading-relaxed text-[11px] mt-0.5">
            <strong>“Raw audio remains on the node; only event metadata is transmitted.”</strong>
            Neither continuous audio streams nor raw voice recordings are stored or sent over radio. All feature extraction occurs inside 512KB SRAM and is discarded immediately after classification.
          </p>
        </div>
      </div>

      {/* 4-Stage Edge-AI Pipeline Walkthrough */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-forest-700" />
          <span>Local Edge-AI Pipeline Workflow</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider">Stage 1</span>
              <h3 className="font-bold text-slate-900 text-xs mt-1">Sound Acquisition</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                INMP441 I2S MEMS microphone captures continuous 16kHz 16-bit PCM audio in 1.5-second sliding windows.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-2">DMA Double-Buffer</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider">Stage 2</span>
              <h3 className="font-bold text-slate-900 text-xs mt-1">Feature Extraction</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                128-point FFT converts time-domain waveform into 64-band Log-Mel Spectrogram energy bins.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-2">ESP-DSP Acceleration</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider">Stage 3</span>
              <h3 className="font-bold text-slate-900 text-xs mt-1">TinyML Inference</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Quantized int8 TensorFlow Lite Micro 1D-CNN classifies the spectrogram in ~42ms on ESP32-S3.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-2">TFLite Micro int8</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider">Stage 4</span>
              <h3 className="font-bold text-slate-900 text-xs mt-1">LoRa Alert Dispatch</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                If confidence exceeds 85% across 3 consecutive windows, a compact event packet is transmitted.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-2">SX1262 LoRa IN865</span>
          </div>
        </div>
      </div>

      {/* Interactive Sound Pattern Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Interactive Spectrogram & Classifier Simulator</h2>
            <p className="text-xs text-slate-500">Select an acoustic profile to observe model feature recognition</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSoundType('chainsaw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSoundType === 'chainsaw'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Chainsaw Signature
            </button>
            <button
              onClick={() => setSelectedSoundType('background')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSoundType === 'background'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Calm Forest
            </button>
            <button
              onClick={() => setSelectedSoundType('cicada')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSoundType === 'cicada'
                  ? 'bg-tealbrand-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Cicada / Insect Noise
            </button>
          </div>
        </div>

        {/* Selected Sound Description */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <p className="font-bold text-slate-900">{current.label}</p>
          <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">{current.description}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">Acoustic Features: {current.features}</p>
        </div>

        {/* Visualizers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WaveformViewer
            eventType={current.isChainsaw ? 'possible_chainsaw' : 'background'}
            confidence={current.confidence}
          />
          <SpectrogramViewer
            confidence={current.confidence}
            isChainsaw={current.isChainsaw}
          />
        </div>

        {/* Classifier Output Box */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-slate-500 text-[11px] uppercase tracking-wide font-semibold">
              TinyML Softmax Prediction
            </span>
            <div className="flex items-center gap-4 mt-1.5">
              <div>
                <span className="text-xs text-slate-600 block">Possible Chainsaw</span>
                <span className="text-base font-bold text-amber-600 font-mono">
                  {Math.round(current.confidence * 100)}%
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-xs text-slate-600 block">Background / Natural</span>
                <span className="text-base font-bold text-slate-700 font-mono">
                  {Math.round((1 - current.confidence) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">Classification Verdict:</span>
            {current.confidence >= 0.85 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs mt-1 border border-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Trigger LoRa Alert Packet
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-medium text-xs mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Normal Soundscape (Quiet)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edge Model Specifications Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <Cpu className="w-4 h-4 text-forest-700" />
          <span>Edge Computing Hardware & TinyML Specifications</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Microcontroller</span>
            <strong className="text-slate-900 block mt-0.5">ESP32-S3 Dual-Core</strong>
            <p className="text-[11px] text-slate-500 mt-1">Xtensa LX7 @ 240MHz with vector AI instructions</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Internet Required at Sensor</span>
            <strong className="text-emerald-700 flex items-center gap-1 mt-0.5">
              <WifiOff className="w-3.5 h-3.5" />
              <span>No Internet Needed</span>
            </strong>
            <p className="text-[11px] text-slate-500 mt-1">Completely autonomous on-device offline inference</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Quantized Model Size</span>
            <strong className="text-slate-900 block mt-0.5">64 KB (int8)</strong>
            <p className="text-[11px] text-slate-500 mt-1">Fits comfortably inside 512 KB internal SRAM</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Inference Latency</span>
            <strong className="text-slate-900 block mt-0.5">~42 milliseconds</strong>
            <p className="text-[11px] text-slate-500 mt-1">Leaves CPU in deep sleep 96% of the monitoring cycle</p>
          </div>
        </div>
      </div>
    </div>
  );
};
