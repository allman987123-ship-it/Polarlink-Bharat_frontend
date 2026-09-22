"use client";

import React, { useState } from "react";
import {
  CloudSnow,
  Wind,
  Thermometer,
  AlertTriangle,
  Compass,
  ShieldAlert,
  Sun,
  Droplets,
  Eye,
  ShieldCheck,
  Navigation,
} from "lucide-react";

export default function WeatherPage() {
  const [station, setStation] = useState<"maitri" | "bharati">("maitri");

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="glass-panel rounded-2xl p-5 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white font-mono uppercase tracking-wider flex items-center space-x-2.5">
            <CloudSnow className="h-6 w-6 text-cyan-400" />
            <span>POLAR METEOROLOGICAL INTELLIGENCE &amp; BLIZZARD TRACKER</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Katabatic wind tracking, barometric pressure tendencies, and 5-day polar numerical forecast models.
          </p>
        </div>

        <div className="flex bg-[#050D1A] border border-[#143257] p-1 rounded-xl text-xs font-mono shadow-inner">
          <button
            onClick={() => setStation("maitri")}
            className={`px-4 py-2 rounded-lg transition-all font-bold ${
              station === "maitri"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            MAITRI (70°S)
          </button>
          <button
            onClick={() => setStation("bharati")}
            className={`px-4 py-2 rounded-lg transition-all font-bold ${
              station === "bharati"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            BHARATI (69°S)
          </button>
        </div>
      </div>

      {/* Real-time Weather KPI Dials */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Air Temperature */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
            <span>SURFACE TEMPERATURE</span>
            <Thermometer className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-mono font-black text-white">
            {station === "maitri" ? "-18.4" : "-14.2"} <span className="text-sm font-normal text-slate-400">°C</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            Wind Chill: <strong className="text-cyan-300">{station === "maitri" ? "-31.8°C" : "-24.5°C"}</strong>
          </div>
        </div>

        {/* Katabatic Wind */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
            <span>KATABATIC WIND</span>
            <Wind className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-3xl font-mono font-black text-white">
            {station === "maitri" ? "32.6" : "24.8"} <span className="text-sm font-normal text-slate-400">km/h</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            Gusts: <strong className="text-amber-400">{station === "maitri" ? "54.2 km/h" : "41.0 km/h"}</strong> (SE 142°)
          </div>
        </div>

        {/* Barometric Pressure */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
            <span>BAROMETRIC PRESSURE</span>
            <Compass className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-mono font-black text-white">
            {station === "maitri" ? "981.2" : "992.5"} <span className="text-sm font-normal text-slate-400">hPa</span>
          </div>
          <div className="mt-2 text-xs text-emerald-400 font-mono">
            Tendency: <strong>Steady (+0.4 hPa/3h)</strong>
          </div>
        </div>

        {/* Solar Irradiance */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
            <span>POLAR SOLAR IRRADIANCE</span>
            <Sun className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-black text-amber-300">
            {station === "maitri" ? "720" : "680"} <span className="text-sm font-normal text-slate-400">W/m²</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            UV Index: <strong className="text-white">3.2 (Moderate)</strong>
          </div>
        </div>
      </div>

      {/* 5-Day Polar Forecast Cards */}
      <div className="glass-panel rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            5-DAY NUMERICAL POLAR METEOROLOGICAL FORECAST — {station.toUpperCase()}
          </h3>
          <span className="text-xs font-mono text-slate-400">ECMWF / DWD High-Res Assimilation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
          {[
            { day: "TODAY", tempMax: -14, tempMin: -22, wind: 34, cond: "Blowing Snow", risk: "35%", riskColor: "text-amber-400" },
            { day: "TOMORROW", tempMax: -16, tempMin: -24, wind: 48, cond: "Katabatic Winds", risk: "65%", riskColor: "text-rose-400" },
            { day: "SUNDAY", tempMax: -19, tempMin: -28, wind: 22, cond: "Clear Polar Sky", risk: "10%", riskColor: "text-emerald-400" },
            { day: "MONDAY", tempMax: -18, tempMin: -26, wind: 28, cond: "Partly Cloudy", risk: "15%", riskColor: "text-emerald-400" },
            { day: "TUESDAY", tempMax: -15, tempMin: -21, wind: 38, cond: "Drifting Snow", risk: "40%", riskColor: "text-amber-400" },
          ].map((f, i) => (
            <div key={i} className="bg-[#050D1A]/90 border border-slate-800 p-4 rounded-2xl text-center font-mono hover:border-cyan-500/50 transition-all">
              <div className="text-xs font-bold text-cyan-300">{f.day}</div>
              <CloudSnow className="h-7 w-7 text-cyan-400 mx-auto my-3" />
              <div className="text-lg font-black text-white">{f.tempMax}° / {f.tempMin}°</div>
              <div className="text-xs text-sky-300 mt-1 font-semibold">{f.wind} km/h</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{f.cond}</div>
              <div className="mt-3 text-[10px] px-2 py-1 rounded-xl bg-slate-900 border border-slate-800">
                Blizzard Risk: <strong className={f.riskColor}>{f.risk}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
