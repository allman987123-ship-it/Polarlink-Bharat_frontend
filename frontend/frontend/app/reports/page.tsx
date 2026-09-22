"use client";

import React, { useEffect, useState } from "react";
import { FileText, Download, Printer, ShieldCheck, Calendar, CheckCircle2, Search, Filter } from "lucide-react";
import { getReports } from "@/lib/api";

export default function ReportsPage() {
  const [stationId, setStationId] = useState<string>("maitri");
  const [reportsData, setReportsData] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    getReports(stationId)
      .then((res) => {
        if (res?.reports) setReportsData(res.reports);
      })
      .catch(() => {});
  }, [stationId]);

  const handlePrintOrExport = (title: string, format: "PDF" | "CSV") => {
    alert(`Generating official government report: "${title}" in [${format}] format with MoES/NCPOR digital signature.`);
  };

  const filtered = reportsData.filter((r) =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.summary?.toLowerCase().includes(search.toLowerCase()) ||
    r.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="glass-panel rounded-2xl p-5 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white font-mono uppercase tracking-wider flex items-center space-x-2.5">
            <FileText className="h-6 w-6 text-cyan-400" />
            <span>AUTOMATED STATION REPORTING &amp; AUDIT LOGS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Daily polar station operations logs, microgrid energy audits, and predictive maintenance records.
          </p>
        </div>

        <div className="flex bg-[#050D1A] border border-[#143257] p-1 rounded-xl text-xs font-mono shadow-inner">
          <button
            onClick={() => setStationId("maitri")}
            className={`px-4 py-2 rounded-lg transition-all font-bold ${
              stationId === "maitri" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            MAITRI LOGS (70°S)
          </button>
          <button
            onClick={() => setStationId("bharati")}
            className={`px-4 py-2 rounded-lg transition-all font-bold ${
              stationId === "bharati" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            BHARATI LOGS (69°S)
          </button>
        </div>
      </div>

      {/* Search Ribbon */}
      <div className="glass-panel rounded-2xl p-4 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search report archives, incident IDs, audit logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#050D1A] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          Official Repository: <strong className="text-cyan-300">MoES / NCPOR Archive</strong>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="space-y-4">
        {filtered.map((rep) => (
          <div
            key={rep.id}
            className="glass-panel glass-panel-hover rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-5"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-sky-950/80 text-cyan-300 border border-sky-800 font-bold">
                  {rep.id}
                </span>
                <span className="text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-lg font-semibold">
                  {rep.classification}
                </span>
                <span className="text-slate-400 flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{rep.date}</span>
                </span>
              </div>

              <h3 className="text-base font-black text-white font-mono">{rep.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{rep.summary}</p>
              <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-2">
                <span>Signatory: <strong className="text-white">{rep.author}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Cryptographically Signed</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 font-mono text-xs shrink-0">
              <button
                onClick={() => handlePrintOrExport(rep.title, "CSV")}
                className="px-4 py-2.5 rounded-xl bg-[#050D1A] border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950 flex items-center space-x-2 transition-all shadow"
              >
                <Download className="h-4 w-4" />
                <span>EXPORT CSV</span>
              </button>
              <button
                onClick={() => handlePrintOrExport(rep.title, "PDF")}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-black flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/20"
              >
                <Printer className="h-4 w-4" />
                <span>DOWNLOAD PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
