"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Thermometer,
  Wind,
  Wifi,
  RotateCcw,
  Zap,
  Activity,
  Layers,
  Radio,
  Lock,
} from "lucide-react";
import { useStation } from "./providers/StationContext";
import { useAuth } from "./auth/AuthContext";
import { AIAssistantDrawer } from "./ai/AIAssistantDrawer";

export function Header() {
  const { station, setStation, stationData, simSpeed, setSimSpeed, isCrisisSim, toggleCrisisSim, utcTime, istTime } = useStation();
  const { user, logout } = useAuth();
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <>
      <header className="bg-[#030B14] border-b border-[#0F2F53] text-slate-100 select-none sticky top-0 z-40 shadow-xl px-3 py-2">
        <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Brand Identity & Time & Simulation Controls */}
          <div className="flex items-center space-x-3">
            {/* Antarctic Mission Logo */}
            <div className="h-9 w-9 rounded-xl bg-[#071F36] border border-cyan-500/50 flex items-center justify-center shadow-md shadow-cyan-500/20 overflow-hidden shrink-0">
              <img src="/logo.webp" alt="PolarLink Antarctic Logo" className="h-full w-full object-cover" />
            </div>

            {/* Brand Title & Subtitle */}
            <div className="leading-tight">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-black text-sm text-white tracking-wider">
                  POLARLINK-BHARAT
                </span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono font-bold uppercase tracking-widest">
                  NCPOR • MoES
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Indian Antarctic Research Stations Remote Management Platform
              </div>
            </div>

            {/* Clock Pill */}
            <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#06182D] border border-[#10365F] text-[10px] font-mono text-cyan-300">
              <span className="text-slate-400">🕒</span>
              <span className="font-bold text-white">{utcTime}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">{istTime} [NCPOR Goa]</span>
            </div>

            {/* Speed Multiplier Pill */}
            <div className="hidden lg:flex items-center space-x-1 px-1.5 py-0.5 rounded-lg bg-[#06182D] border border-[#10365F] text-[10px] font-mono">
              <button
                onClick={() => setSimSpeed(1)}
                className={`px-1.5 py-0.5 rounded transition-all font-bold ${
                  simSpeed === 1 ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setSimSpeed(5)}
                className={`px-1.5 py-0.5 rounded transition-all font-bold ${
                  simSpeed === 5 ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                5x
              </button>
              <button
                onClick={() => setSimSpeed(10)}
                className={`px-1.5 py-0.5 rounded transition-all font-bold ${
                  simSpeed === 10 ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                10x
              </button>
              <button
                onClick={() => setSimSpeed(1)}
                className="p-1 text-slate-400 hover:text-white"
                title="Reset simulation speed"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>

            {/* Crisis Sim Button */}
            <button
              onClick={toggleCrisisSim}
              className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md ${
                isCrisisSim
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-red-500/50 animate-pulse border border-red-400"
                  : "bg-[#DC2626] hover:bg-[#EF4444] text-white shadow-red-600/30 border border-red-500"
              }`}
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>CRISIS SIM</span>
            </button>
          </div>

          {/* Center: Station Toggle Pill */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-[#040F1E] border border-[#10365F] text-xs font-mono shadow-inner">
            <button
              onClick={() => setStation("bharati")}
              className={`px-4 py-1.5 rounded-xl transition-all font-bold ${
                station === "bharati"
                  ? "bg-[#0A436C] border border-cyan-400 text-cyan-200 shadow-md shadow-cyan-900/40"
                  : "text-slate-400 hover:text-white border border-transparent"
              }`}
            >
              Bharati (Larsemann)
            </button>
            <button
              onClick={() => setStation("maitri")}
              className={`px-4 py-1.5 rounded-xl transition-all font-bold ${
                station === "maitri"
                  ? "bg-[#0A436C] border border-cyan-400 text-cyan-200 shadow-md shadow-cyan-900/40"
                  : "text-slate-400 hover:text-white border border-transparent"
              }`}
            >
              Maitri (Schirmacher)
            </button>
          </div>

          {/* Right: Weather & Link Telemetry Pills */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            {/* Temp / Chill */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-[#06182D] border border-[#10365F]">
              <Thermometer className="h-4 w-4 text-cyan-400" />
              <div className="leading-tight">
                <div className="text-[9px] text-slate-400 font-medium uppercase">OUTSIDE / CHILL</div>
                <div className="text-white font-bold text-[11px]">
                  {stationData.outsideTemp} <span className="text-slate-400 font-normal">/ {stationData.windChill}</span>
                </div>
              </div>
            </div>

            {/* Katabatic Wind */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-[#06182D] border border-[#10365F]">
              <Wind className="h-4 w-4 text-cyan-400" />
              <div className="leading-tight">
                <div className="text-[9px] text-slate-400 font-medium uppercase">KATABATIC WIND</div>
                <div className="text-white font-bold text-[11px]">
                  {stationData.windSpeed} <span className="text-cyan-300 font-normal">({stationData.windDirection})</span>
                </div>
              </div>
            </div>

            {/* GSAT Polar Link */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-[#06182D] border border-[#10365F]">
              <Wifi className="h-4 w-4 text-emerald-400" />
              <div className="leading-tight">
                <div className="text-[9px] text-slate-400 font-medium uppercase">GSAT-14 POLAR LINK</div>
                <div className="text-emerald-300 font-bold text-[11px] flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{stationData.satcomPing} • {stationData.satcomBandwidth}</span>
                </div>
              </div>
            </div>

            {/* AI Assistant */}
            <button
              onClick={() => setIsAIOpen(true)}
              className="p-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20 hover:scale-105 transition-all"
              title="AI Polar Copilot"
            >
              <Sparkles className="h-4 w-4" />
            </button>

            {/* Lock / Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-700/80 text-red-300 transition-all"
              title="Lock Terminal"
            >
              <Lock className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
}
