"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, Clock, Check, BellRing, Filter, Search } from "lucide-react";
import { getAlerts, acknowledgeAlert } from "@/lib/api";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [ackStatus, setAckStatus] = useState<string>("");
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  useEffect(() => {
    getAlerts().then(setAlerts).catch(() => {});
  }, []);

  const handleAcknowledge = async (alertId: string) => {
    try {
      await acknowledgeAlert(alertId, "Mission Operations Commander");
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? { ...a, status: "ACKNOWLEDGED", acknowledged_by: "Mission Operations Commander" }
            : a
        )
      );
      setAckStatus(`Alarm ${alertId} successfully logged and acknowledged.`);
      setTimeout(() => setAckStatus(""), 3000);
    } catch {
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: "ACKNOWLEDGED" } : a))
      );
    }
  };

  const filtered = alerts.filter(
    (al) => filterSeverity === "ALL" || al.severity === filterSeverity
  );

  const critCount = alerts.filter((a) => a.severity === "CRITICAL").length;
  const warnCount = alerts.filter((a) => a.severity === "WARNING").length;

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="glass-panel rounded-2xl p-5 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white font-mono uppercase tracking-wider flex items-center space-x-2.5">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            <span>REAL-TIME POLAR ALERT &amp; DISPATCH ENGINE</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Rule-based threshold triggers, meteorological warnings, and operator acknowledgment lifecycle.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-red-950/80 text-red-300 border border-red-500/60 font-bold">
            ● {critCount} CRITICAL
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-500/60 font-bold">
            ● {warnCount} WARNING
          </span>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center space-x-2 font-mono text-xs">
          {(["ALL", "CRITICAL", "WARNING", "INFO"] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3.5 py-1.5 rounded-xl transition-all font-bold ${
                filterSeverity === sev
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/20 border border-cyan-400"
                  : "bg-[#050D1A] text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {ackStatus && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-500/60 px-3.5 py-1.5 rounded-xl animate-in fade-in">
            {ackStatus}
          </span>
        )}
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filtered.map((al) => {
          const isCrit = al.severity === "CRITICAL";
          const isWarn = al.severity === "WARNING";
          const isAck = al.status === "ACKNOWLEDGED";

          return (
            <div
              key={al.id}
              className={`glass-panel glass-panel-hover rounded-3xl p-6 shadow-2xl flex flex-wrap justify-between items-center gap-5 transition-all ${
                isCrit
                  ? "border-red-500/80 bg-red-950/20 shadow-red-500/15"
                  : isWarn
                  ? "border-amber-500/80 bg-amber-950/20 shadow-amber-500/15"
                  : "border-[#143257]"
              }`}
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center space-x-2.5 font-mono text-xs">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase ${
                      isCrit
                        ? "bg-red-950 text-red-300 border border-red-700 animate-pulse"
                        : "bg-amber-950 text-amber-300 border border-amber-700"
                    }`}
                  >
                    ● {al.severity}
                  </span>
                  <span className="text-cyan-300 uppercase font-bold tracking-wide">
                    {al.station_id} STATION
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{al.category}</span>
                </div>

                <h3 className="text-base font-black text-white font-mono">{al.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{al.description}</p>
                <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1.5">
                  <Clock className="h-3 w-3 text-cyan-400" />
                  <span>Logged at: {al.created_at}</span>
                </div>
              </div>

              <div>
                {isAck ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-mono font-bold flex items-center space-x-2 shadow">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>ACKNOWLEDGED BY COMMANDER</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleAcknowledge(al.id)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 text-xs font-mono font-black shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>ACKNOWLEDGE ALARM</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
