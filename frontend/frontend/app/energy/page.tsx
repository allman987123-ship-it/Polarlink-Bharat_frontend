"use client";

import React, { useEffect, useState } from "react";
import {
  Zap,
  Sun,
  Flame,
  BatteryCharging,
  Activity,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sliders,
  Cpu,
  RefreshCw,
} from "lucide-react";
import { EnergyFlowDiagram } from "@/components/scada/EnergyFlowDiagram";
import { getEnergyStatus } from "@/lib/api";

export default function EnergyPage() {
  const [station, setStation] = useState<"maitri" | "bharati">("maitri");
  const [energyData, setEnergyData] = useState<any>({
    total_generation_kw: 95.0,
    total_consumption_kw: 88.0,
    solar_generation_kw: 18.5,
    generator_output_kw: 76.5,
    battery_soc_pct: 86.5,
    battery_temp_c: 18.4,
    fuel_consumption_lh: 24.2,
    current_load_pct: 72.0,
    grid_stability: "STABLE",
  });

  useEffect(() => {
    getEnergyStatus(station)
      .then((res) => {
        if (res?.status) setEnergyData(res.status);
      })
      .catch(() => {});
  }, [station]);

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="glass-panel rounded-2xl p-5 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white font-mono uppercase tracking-wider flex items-center space-x-2.5">
            <Zap className="h-6 w-6 text-amber-400" />
            <span>ANTARCTIC MICROGRID &amp; ENERGY MANAGEMENT</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Bifacial solar PV harvest, diesel genset cogeneration, LiFePO4 battery storage &amp; demand SCADA.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#050D1A] border border-[#143257] p-1 rounded-xl text-xs font-mono shadow-inner">
          <button
            onClick={() => setStation("maitri")}
            className={`px-4 py-2 rounded-lg transition-all font-bold ${
              station === "maitri"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            MAITRI STATION (70°S)
          </button>
          <button
            onClick={() => setStation("bharati")}
            className={`px-4 py-2 rounded-lg transition-all font-bold ${
              station === "bharati"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            BHARATI STATION (69°S)
          </button>
        </div>
      </div>

      {/* Dynamic Interactive Power Flow Topology */}
      <EnergyFlowDiagram energy={energyData} stationName={station} />

      {/* Energy Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
            <span>TOTAL GENERATION</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-black text-white">{energyData.total_generation_kw} kW</div>
          <div className="mt-2 text-xs text-emerald-400 font-mono flex items-center space-x-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Solar + Diesel Cogeneration Hybrid</span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
            <span>TOTAL DEMAND</span>
            <Activity className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-3xl font-mono font-black text-white">{energyData.total_consumption_kw} kW</div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            Load Factor: <strong className="text-cyan-300">{energyData.current_load_pct}%</strong>
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
            <span>BATTERY BANK SOC</span>
            <BatteryCharging className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-black text-emerald-300">{energyData.battery_soc_pct}%</div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            Cell Temp: <strong className="text-white">{energyData.battery_temp_c}°C</strong> (Nominal Range)
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
            <span>FUEL BURN EFFICIENCY</span>
            <Flame className="h-4 w-4 text-orange-400" />
          </div>
          <div className="text-3xl font-mono font-black text-amber-300">{energyData.fuel_consumption_lh} L/h</div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            Reserve Autonomy: <strong className="text-emerald-400">240 Days</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
