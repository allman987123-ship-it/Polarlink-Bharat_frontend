"use client";

import React, { useEffect, useState } from "react";
import { Shield, ShieldAlert, Users, Lock, Key, Clock, Database, CheckCircle2 } from "lucide-react";
import { getAuditLogs } from "@/lib/api";

export default function AdminPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    getAuditLogs().then(setLogs).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 glow-cyan">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white font-mono uppercase tracking-wider">
                ADMINISTRATION &amp; GOVERNMENT AUDIT TRAIL
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Role-Based Access Control (RBAC), operator actions audit logging, and SIH 2026 security compliance records.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center space-x-2 glow-emerald">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AUDIT LOGGING: ACTIVE (APPEND-ONLY)</span>
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-2">
            <Database className="h-4 w-4 text-cyan-400" />
            <span>IMMUTABLE COMPLIANCE AUDIT LOGS</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Total Records: {logs.length}</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#1E3E62]/40">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1E3E62]/60 bg-[#040A14] text-slate-400">
                <th className="p-3.5">TIMESTAMP</th>
                <th className="p-3.5">OPERATOR / USER</th>
                <th className="p-3.5">ROLE</th>
                <th className="p-3.5">ACTION</th>
                <th className="p-3.5">STATION &amp; ASSET</th>
                <th className="p-3.5">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3E62]/30">
              {logs.map((log) => (
                <tr key={log.id} className="text-slate-300 hover:bg-cyan-950/20 transition-colors">
                  <td className="p-3.5 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3.5 font-bold text-white">{log.user}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-950 text-cyan-300 border border-blue-800/80 text-[10px] font-bold">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-amber-400 font-bold">{log.action}</td>
                  <td className="p-3.5 text-slate-400">{log.station_id?.toUpperCase()} • {log.asset}</td>
                  <td className="p-3.5 text-slate-300 max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

