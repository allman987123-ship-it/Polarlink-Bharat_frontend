"use client";

import React from "react";
import { Sun, Flame, BatteryCharging, Zap, ArrowRight, Activity, ShieldCheck, Cpu, Droplets, Radio, CheckCircle2 } from "lucide-react";

interface EnergyFlowProps {
  energy: {
    total_generation_kw: number;
    total_consumption_kw: number;
    solar_generation_kw: number;
    generator_output_kw: number;
    battery_soc_pct: number;
    battery_temp_c: number;
    fuel_consumption_lh: number;
    current_load_pct: number;
    grid_stability: string;
  };
  stationName: string;
}

export function EnergyFlowDiagram({ energy, stationName }: EnergyFlowProps) {
  return (
    <div className="glass-panel rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white font-mono uppercase tracking-wider">
              MICROGRID POWER TOPOLOGY &amp; FLOW — {stationName.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Autonomous Antarctic Hybrid Power System • 415V AC 3-Phase Synchronized Bus
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">GRID STABILITY:</span>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 flex items-center space-x-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>● {energy.grid_stability || "STABLE"}</span>
          </span>
        </div>
      </div>

      {/* Energy Flow Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Source 1: Generation Side */}
        <div className="space-y-4">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>1. GENERATION ASSETS</span>
          </div>

          {/* Solar PV Array */}
          <div className="glass-panel rounded-2xl p-4 relative overflow-hidden border-cyan-500/40 group hover:border-cyan-400 transition-all">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sun className="h-5 w-5 text-amber-400 animate-spin" style={{ animationDuration: "30s" }} />
                <div>
                  <span className="text-xs font-bold text-white font-mono">Bifacial Solar PV Array</span>
                  <div className="text-[10px] text-slate-400">Albedo Reflection Yield</div>
                </div>
              </div>
              <span className="text-sm font-mono font-black text-cyan-300">{energy.solar_generation_kw} kW</span>
            </div>
            <div className="mt-3 h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full animate-pulse"
                style={{ width: `${Math.min(100, (energy.solar_generation_kw / 50) * 100)}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] text-slate-400 font-mono flex justify-between">
              <span>Polar Irradiance: 720 W/m²</span>
              <span className="text-emerald-400 font-bold">● Active Harvest</span>
            </div>
          </div>

          {/* Diesel Genset / CHP */}
          <div className="glass-panel rounded-2xl p-4 border-amber-500/40 group hover:border-amber-400 transition-all">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-400" />
                <div>
                  <span className="text-xs font-bold text-white font-mono">Diesel Gensets (3x 125 kVA)</span>
                  <div className="text-[10px] text-slate-400">Cogeneration / Heat Recovery</div>
                </div>
              </div>
              <span className="text-sm font-mono font-black text-amber-300">{energy.generator_output_kw} kW</span>
            </div>
            <div className="mt-3 text-[11px] text-slate-300 font-mono flex justify-between bg-[#050D1A] p-2 rounded-xl border border-slate-800">
              <span>Fuel Burn: <strong className="text-white">{energy.fuel_consumption_lh} L/h</strong></span>
              <span>Thermal CHP: <strong className="text-amber-400">42.5 kWth</strong></span>
            </div>
          </div>
        </div>

        {/* Center: Inverter & Battery Bank Storage */}
        <div className="space-y-4">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>2. POWER BUS &amp; STORAGE</span>
          </div>

          {/* Main Central Bus */}
          <div className="glass-panel rounded-2xl p-4 text-center shadow-lg border-sky-400/60 bg-gradient-to-b from-[#081E38] to-[#040C1A]">
            <span className="text-[10px] font-mono text-sky-300 uppercase tracking-widest font-bold">
              CENTRAL MICROGRID BUS (415V 50Hz)
            </span>
            <div className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-sky-400 mt-1">
              {energy.total_generation_kw} <span className="text-sm font-normal text-slate-300">kW</span>
            </div>
            <div className="mt-2 text-xs font-mono text-slate-300 flex justify-around border-t border-slate-700/60 pt-2">
              <span>Load: <strong className="text-cyan-300">{energy.current_load_pct}%</strong></span>
              <span>•</span>
              <span>Freq: <strong className="text-emerald-400">50.0 Hz</strong></span>
              <span>•</span>
              <span>PF: <strong className="text-sky-300">0.98</strong></span>
            </div>
          </div>

          {/* Battery Bank Storage */}
          <div className="glass-panel rounded-2xl p-4 border-emerald-500/40 group hover:border-emerald-400 transition-all">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <BatteryCharging className="h-5 w-5 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-white font-mono">LiFePO4 ESS Battery Bank</span>
                  <div className="text-[10px] text-slate-400">350 kWh Cold-Rated Storage</div>
                </div>
              </div>
              <span className="text-sm font-mono font-black text-emerald-300">{energy.battery_soc_pct}% SoC</span>
            </div>
            <div className="mt-3 h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                style={{ width: `${energy.battery_soc_pct}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] text-slate-400 font-mono flex justify-between">
              <span>Cell Temp: <strong className="text-white">{energy.battery_temp_c}°C</strong></span>
              <span>Autonomy: <strong className="text-emerald-400">36.5 Hours</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Station Demand & Critical Loads */}
        <div className="space-y-4">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            <span>3. DEMAND SCADA</span>
          </div>

          <div className="glass-panel rounded-2xl p-4 border-indigo-500/40">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-white font-mono">Total Consumption</span>
                <div className="text-[10px] text-slate-400">Life-Support &amp; Scientific Labs</div>
              </div>
              <span className="text-sm font-mono font-black text-red-300">{energy.total_consumption_kw} kW</span>
            </div>
            <ul className="mt-3 space-y-2 text-xs font-mono text-slate-300">
              <li className="flex justify-between items-center p-1.5 rounded-lg bg-[#050D1A] border border-slate-800">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Flame className="h-3.5 w-3.5 text-amber-400" />
                  <span>HVAC &amp; Trace Heating:</span>
                </span>
                <span className="font-bold text-white">{Math.round(energy.total_consumption_kw * 0.48)} kW</span>
              </li>
              <li className="flex justify-between items-center p-1.5 rounded-lg bg-[#050D1A] border border-slate-800">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Activity className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Science &amp; Seismology:</span>
                </span>
                <span className="font-bold text-white">{Math.round(energy.total_consumption_kw * 0.22)} kW</span>
              </li>
              <li className="flex justify-between items-center p-1.5 rounded-lg bg-[#050D1A] border border-slate-800">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Droplets className="h-3.5 w-3.5 text-blue-400" />
                  <span>Meltwater Pumphouse:</span>
                </span>
                <span className="font-bold text-white">{Math.round(energy.total_consumption_kw * 0.14)} kW</span>
              </li>
              <li className="flex justify-between items-center p-1.5 rounded-lg bg-[#050D1A] border border-slate-800">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Radio className="h-3.5 w-3.5 text-indigo-400" />
                  <span>ISRO IMGEOS Comms:</span>
                </span>
                <span className="font-bold text-white">{Math.round(energy.total_consumption_kw * 0.10)} kW</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
