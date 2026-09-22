import React from "react";
import { LucideIcon } from "lucide-react";

interface TelemetryCardProps {
  label: string;
  value: string | number;
  unit?: string;
  source: string;
  lastUpdated?: string;
  status?: "NORMAL" | "WARNING" | "CRITICAL" | "SIMULATION";
  quality?: "GOOD" | "SUSPECT" | "MISSING" | "OFFLINE";
  icon?: LucideIcon;
  subValue?: string;
}

export function TelemetryCard({
  label,
  value,
  unit,
  source,
  lastUpdated,
  status = "NORMAL",
  quality = "GOOD",
  icon: Icon,
  subValue,
}: TelemetryCardProps) {
  return (
    <div className="bg-[#0B192C] border border-[#1E3E62] rounded-xl p-3.5 shadow-lg flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
      <div>
        <div className="flex justify-between items-start mb-1.5">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
            {label}
          </span>
          {Icon && <Icon className="h-4 w-4 text-cyan-400" />}
        </div>

        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-mono font-black text-white tracking-tight">
            {value}
          </span>
          {unit && <span className="text-xs font-mono text-cyan-300">{unit}</span>}
        </div>

        {subValue && (
          <p className="text-[11px] text-slate-300 font-mono mt-0.5">{subValue}</p>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 space-y-0.5">
        <div className="flex justify-between items-center">
          <span className="truncate max-w-[140px] text-slate-500">{source}</span>
          <span
            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
              quality === "GOOD"
                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                : "bg-amber-950 text-amber-400 border border-amber-800"
            }`}
          >
            ● {quality}
          </span>
        </div>
        {lastUpdated && (
          <div className="text-[9px] text-slate-500 text-right">{lastUpdated}</div>
        )}
      </div>
    </div>
  );
}
