"use client";

import React, { useState } from "react";
import { Sparkles, Cpu, AlertTriangle, ShieldCheck, Activity, BarChart3, Zap, RefreshCw, CheckCircle2 } from "lucide-react";

export default function AnalyticsPage() {
  const [station, setStation] = useState<"maitri" | "bharati">("maitri");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 glow-cyan">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white font-mono uppercase tracking-wider">
                AI PREDICTIVE MAINTENANCE &amp; ANOMALY DETECTION ENGINE
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Isolation Forest harmonic vibration anomaly detection and Remaining Useful Life (RUL) health forecasting.
              </p>
            </div>
          </div>
        </div>

        <div className="flex bg-[#040A14] border border-cyan-500/20 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setStation("maitri")}
            className={`px-4 py-2 rounded-lg transition-all font-bold ${
              station === "maitri" ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            MAITRI STATION
          </button>
          <button
            onClick={() => setStation("bharati")}
            className={`px-4 py-2 rounded-lg transition-all font-bold ${
              station === "bharati" ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            BHARATI STATION
          </button>
        </div>
      </div>

      {/* Model Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-cyan-400 font-mono font-bold text-xs">
            <div className="flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>ISOLATION FOREST MODEL</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px]">v3.4 ONLINE</span>
          </div>
          <div className="text-3xl font-mono font-black text-white">
            0.04 <span className="text-xs font-normal text-emerald-400 font-sans tracking-normal ml-1">● Nominal Anomaly Score</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">Multi-sensor feature envelope tracking vibration frequency peaks and thermal gradients across primary generator shafts.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-amber-400 font-mono font-bold text-xs">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-amber-400" />
              <span>ESTIMATED REMAINING LIFE (RUL)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/30 text-amber-300 text-[10px]">HIGH CONFIDENCE</span>
          </div>
          <div className="text-3xl font-mono font-black text-white">
            7,840 <span className="text-sm font-normal text-slate-400">Hours</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">Predicted operational window before next mandatory bearing overhaul on secondary DG-2 turbine generator.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-emerald-400 font-mono font-bold text-xs">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>MODEL CONFIDENCE INDEX</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px]">99.2% RECALL</span>
          </div>
          <div className="text-3xl font-mono font-black text-white">96.4%</div>
          <p className="text-xs text-slate-400 leading-relaxed">Trained on polar station operational baselines &amp; synthetic cold-weather degradation datasets (-50°C stress envelope).</p>
        </div>
      </div>
    </div>
  );
}

