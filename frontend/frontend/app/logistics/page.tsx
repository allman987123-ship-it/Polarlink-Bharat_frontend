"use client";

import React, { useEffect, useState } from "react";
import { Package, Fuel, ShieldAlert, AlertTriangle, CheckCircle2, Droplets, HeartPulse, Sparkles, Search } from "lucide-react";
import { getLogistics } from "@/lib/api";

export default function LogisticsPage() {
  const [station, setStation] = useState<string>("all");
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    getLogistics(station).then(setItems).catch(() => {});
  }, [station]);

  const filtered = items.filter((it) =>
    it.name?.toLowerCase().includes(search.toLowerCase()) ||
    it.category?.toLowerCase().includes(search.toLowerCase()) ||
    it.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="glass-panel rounded-2xl p-5 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white font-mono uppercase tracking-wider flex items-center space-x-2.5">
            <Package className="h-6 w-6 text-cyan-400" />
            <span>ANTARCTIC SUPPLY CHAIN &amp; LOGISTICS INVENTORY</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Aviation fuel reserves, wintering crew rations, emergency medical oxygen, and spare parts telemetry.
          </p>
        </div>

        <div className="flex bg-[#050D1A] border border-[#143257] p-1 rounded-xl text-xs font-mono shadow-inner">
          <button
            onClick={() => setStation("all")}
            className={`px-3.5 py-1.5 rounded-lg transition-all font-bold ${
              station === "all" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            ALL BASES
          </button>
          <button
            onClick={() => setStation("maitri")}
            className={`px-3.5 py-1.5 rounded-lg transition-all font-bold ${
              station === "maitri" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            MAITRI (70°S)
          </button>
          <button
            onClick={() => setStation("bharati")}
            className={`px-3.5 py-1.5 rounded-lg transition-all font-bold ${
              station === "bharati" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            BHARATI (69°S)
          </button>
        </div>
      </div>

      {/* Search Ribbon */}
      <div className="glass-panel rounded-2xl p-4 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search supply inventory, fuel tanks, spare parts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#050D1A] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          Showing <strong className="text-cyan-300">{filtered.length}</strong> logged supply nodes
        </div>
      </div>

      {/* Inventory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((it) => (
          <div
            key={it.id}
            className="glass-panel glass-panel-hover rounded-3xl p-5 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg bg-sky-950/80 text-cyan-300 border border-sky-800 font-bold">
                  {it.category}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border ${
                    it.criticality === "CRITICAL"
                      ? "bg-red-950 text-red-300 border-red-800 animate-pulse"
                      : "bg-emerald-950 text-emerald-300 border-emerald-800"
                  }`}
                >
                  ● {it.criticality}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-mono mt-1">{it.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{it.location}</p>

              <div className="mt-4 bg-[#050D1A]/90 p-3.5 rounded-2xl border border-slate-800 text-xs font-mono">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400">STOCK LEVEL:</span>
                  <span className="text-2xl font-black text-white">
                    {it.quantity.toLocaleString()} <span className="text-xs font-normal text-slate-400">{it.unit}</span>
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Reserve Autonomy</span>
                    <span className="text-emerald-400 font-bold">{it.days_reserve} Days</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        it.days_reserve < 60
                          ? "bg-rose-500"
                          : it.days_reserve < 120
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                      }`}
                      style={{ width: `${Math.min(100, (it.days_reserve / 365) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-slate-400 flex justify-between">
                  <span>Station: <strong className="text-cyan-300 uppercase">{it.station_id}</strong></span>
                  <span>Safety Stock: <strong className="text-white">Normal</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
              <span>Lot Expiry: <strong className="text-slate-300">{it.expiry_date}</strong></span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>SCADA Verified</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
