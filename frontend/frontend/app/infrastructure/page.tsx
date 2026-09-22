"use client";

import React, { useEffect, useState } from "react";
import {
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  ShieldAlert,
  Zap,
  Radio,
  Droplets,
  Search,
  LayoutGrid,
  List,
  Flame,
} from "lucide-react";
import { getStationAssets } from "@/lib/api";

export default function InfrastructurePage() {
  const [stationId, setStationId] = useState<"maitri" | "bharati">("maitri");
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"GRID" | "TABLE">("GRID");

  useEffect(() => {
    getStationAssets(stationId).then(setAssets).catch(() => {});
  }, [stationId]);

  const categories = ["ALL", "POWER", "HVAC", "COMMS", "WATER", "STRUCTURE", "LABORATORY"];

  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = selectedCategory === "ALL" || asset.category === selectedCategory;
    const matchesSearch =
      asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.building?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="glass-panel rounded-2xl p-5 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white font-mono uppercase tracking-wider flex items-center space-x-2.5">
            <Cpu className="h-6 w-6 text-cyan-400" />
            <span>INFRASTRUCTURE &amp; ASSET HEALTH SCADA</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Real-time diagnostics, mechanical vibration harmonics, runtime hours, and predictive maintenance.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#050D1A] border border-[#143257] p-1 rounded-xl text-xs font-mono shadow-inner">
          <button
            onClick={() => setStationId("maitri")}
            className={`px-4 py-2 rounded-lg transition-all font-bold ${
              stationId === "maitri"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            MAITRI STATION (70°S)
          </button>
          <button
            onClick={() => setStationId("bharati")}
            className={`px-4 py-2 rounded-lg transition-all font-bold ${
              stationId === "bharati"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            BHARATI STATION (69°S)
          </button>
        </div>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap justify-between items-center gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all font-semibold ${
                selectedCategory === cat
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/20 border border-cyan-400"
                  : "bg-[#050D1A] text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & View Switcher */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets by tag, name or building..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#050D1A] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 w-56 md:w-72"
            />
          </div>

          <div className="flex bg-[#050D1A] border border-slate-800 p-0.5 rounded-xl">
            <button
              onClick={() => setViewMode("GRID")}
              className={`p-1.5 rounded-lg ${viewMode === "GRID" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"}`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("TABLE")}
              className={`p-1.5 rounded-lg ${viewMode === "TABLE" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"}`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Asset Cards Grid View */}
      {viewMode === "GRID" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssets.map((asset) => {
            const isCrit = asset.status === "CRITICAL";
            const isWarn = asset.status === "WARNING";

            return (
              <div
                key={asset.id}
                className={`glass-panel glass-panel-hover rounded-3xl p-5 shadow-2xl flex flex-col justify-between transition-all ${
                  isCrit
                    ? "border-red-500/80 bg-red-950/20 shadow-red-500/10"
                    : isWarn
                    ? "border-amber-500/80 bg-amber-950/20 shadow-amber-500/10"
                    : "border-[#143257] hover:border-cyan-400"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg bg-sky-950/80 text-cyan-300 border border-sky-800 font-bold">
                      {asset.category}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border flex items-center space-x-1 ${
                        isCrit
                          ? "bg-red-950 text-red-300 border-red-700 animate-pulse"
                          : isWarn
                          ? "bg-amber-950 text-amber-300 border-amber-700"
                          : "bg-emerald-950 text-emerald-300 border-emerald-700"
                      }`}
                    >
                      <span>● {asset.status}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white font-mono mt-1">{asset.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{asset.building}</p>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-4 bg-[#050D1A]/90 p-3 rounded-2xl border border-slate-800 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 text-[10px]">HEALTH SCORE</span>
                      <div className="text-emerald-400 font-bold text-sm">{asset.health_score}%</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">RUNTIME</span>
                      <div className="text-slate-200 font-bold text-sm">{asset.runtime_hours} h</div>
                    </div>
                    {asset.temperature_c !== undefined && (
                      <div>
                        <span className="text-slate-500 text-[10px]">TEMPERATURE</span>
                        <div className="text-cyan-300 font-bold text-sm">{asset.temperature_c}°C</div>
                      </div>
                    )}
                    {asset.vibration_mms !== undefined && (
                      <div>
                        <span className="text-slate-500 text-[10px]">VIBRATION</span>
                        <div className={`font-bold text-sm ${asset.vibration_mms > 4.5 ? "text-red-400" : "text-slate-200"}`}>
                          {asset.vibration_mms} mm/s
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Recommendation */}
                  {asset.recommendation && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="text-cyan-400 font-mono font-bold block mb-1">AI Prescriptive Maintenance:</span>
                      {asset.recommendation}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] font-mono text-slate-400">
                  <span>Anomaly: <strong className="text-cyan-300">{asset.anomaly_score}</strong></span>
                  <span>Maintenance Risk: <strong className="text-emerald-400">{asset.maintenance_risk_pct}%</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel rounded-3xl p-5 shadow-2xl overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">TAG ID</th>
                <th className="pb-3">ASSET NAME</th>
                <th className="pb-3">CATEGORY</th>
                <th className="pb-3">LOCATION</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3">HEALTH</th>
                <th className="pb-3">RUNTIME</th>
                <th className="pb-3">TEMP</th>
                <th className="pb-3">VIBRATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="text-slate-300 hover:bg-slate-900/40">
                  <td className="py-3 text-cyan-400 font-bold">{asset.id}</td>
                  <td className="py-3 font-bold text-white">{asset.name}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-sky-950 text-cyan-300 border border-sky-800 text-[10px]">
                      {asset.category}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{asset.building}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold">
                      ● {asset.status}
                    </span>
                  </td>
                  <td className="py-3 text-emerald-400 font-bold">{asset.health_score}%</td>
                  <td className="py-3 text-slate-300">{asset.runtime_hours} h</td>
                  <td className="py-3 text-cyan-300">{asset.temperature_c ?? "--"}°C</td>
                  <td className="py-3 text-slate-200">{asset.vibration_mms ?? "--"} mm/s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
