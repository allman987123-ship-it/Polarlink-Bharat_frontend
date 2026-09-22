"use client";

import React from "react";
import { ShieldAlert, Info } from "lucide-react";
import { getRiskLevelColor } from "@/lib/utils";

interface RiskGaugeProps {
  risk: {
    station_id: string;
    composite_risk_score: number;
    risk_level: string;
    weather_risk: number;
    infrastructure_risk: number;
    energy_risk: number;
    logistics_risk: number;
    environmental_risk: number;
    methodology_note?: string;
  };
  stationName: string;
}

export function RiskGauge({ risk, stationName }: RiskGaugeProps) {
  const score = risk.composite_risk_score || 18.5;
  const level = risk.risk_level || "LOW";
  const badgeClass = getRiskLevelColor(level);

  return (
    <div className="bg-[#0B192C] border border-[#1E3E62] rounded-xl p-4 shadow-xl">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-4 w-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
            STATION RISK INDEX — {stationName.toUpperCase()}
          </h4>
        </div>
        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${badgeClass}`}>
          ● {level} RISK
        </span>
      </div>

      {/* Main Score Bar */}
      <div className="flex items-end justify-between mb-2">
        <div className="text-2xl font-mono font-black text-white">
          {score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Weighted Multi-Factor</span>
      </div>

      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            level === "CRITICAL"
              ? "bg-red-500"
              : level === "HIGH"
              ? "bg-orange-500"
              : level === "MODERATE"
              ? "bg-amber-500"
              : "bg-emerald-500"
          }`}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-5 gap-1 text-[10px] font-mono text-center pt-2 border-t border-slate-800">
        <div className="bg-[#071322] p-1.5 rounded">
          <div className="text-slate-400">Weather</div>
          <div className="text-white font-bold mt-0.5">{risk.weather_risk}</div>
        </div>
        <div className="bg-[#071322] p-1.5 rounded">
          <div className="text-slate-400">Infra</div>
          <div className="text-white font-bold mt-0.5">{risk.infrastructure_risk}</div>
        </div>
        <div className="bg-[#071322] p-1.5 rounded">
          <div className="text-slate-400">Energy</div>
          <div className="text-white font-bold mt-0.5">{risk.energy_risk}</div>
        </div>
        <div className="bg-[#071322] p-1.5 rounded">
          <div className="text-slate-400">Logistics</div>
          <div className="text-white font-bold mt-0.5">{risk.logistics_risk}</div>
        </div>
        <div className="bg-[#071322] p-1.5 rounded">
          <div className="text-slate-400">Env</div>
          <div className="text-white font-bold mt-0.5">{risk.environmental_risk}</div>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 italic mt-2.5 flex items-center space-x-1">
        <Info className="h-3 w-3 inline text-slate-600" />
        <span>Prototype methodology — not an official NCPOR/Government standard.</span>
      </p>
    </div>
  );
}
