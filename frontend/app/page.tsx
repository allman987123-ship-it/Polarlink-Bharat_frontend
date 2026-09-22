"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Map,
  Zap,
  Droplets,
  Fuel,
  Activity,
  Radio,
  ArrowRight,
  TrendingUp,
  Cpu,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { useStation } from "@/components/providers/StationContext";

export default function HomePage() {
  const { station, stationData, isCrisisSim } = useStation();

  return (
    <div className="space-y-4 font-mono select-none">
      {/* 1. TOP STATION HEADER BANNER */}
      <div className="bg-[#061527] border border-[#0F2F53] rounded-2xl p-5 shadow-xl flex flex-wrap justify-between items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-wider">
              STATION DIGITAL TWIN • ACTIVE
            </span>
            <span className="text-slate-400 text-[11px]">Commissioned: {stationData.commissioned}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white font-sans tracking-wide">
            {stationData.name} <span className="text-cyan-400 text-base md:text-lg font-normal">({stationData.hindiName})</span>
          </h1>
          <p className="text-xs text-slate-400">
            {stationData.location} • <span className="text-slate-300 font-semibold">{stationData.coords}</span> • Altitude: {stationData.altitude}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/gis"
            className="px-3.5 py-2 rounded-xl bg-[#040E1B] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md"
          >
            <Map className="h-3.5 w-3.5" />
            <span>Antarctica Map GIS</span>
          </Link>

          {/* Operational Health Index Card */}
          <div className="bg-[#040E1B] border border-[#0F2F53] rounded-xl p-2.5 px-4 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="leading-tight">
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">OPERATIONAL HEALTH INDEX</div>
              <div className="text-lg font-black text-white flex items-center space-x-1.5">
                <span>{isCrisisSim ? "84.2%" : `${stationData.operationalHealth}%`}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isCrisisSim ? "bg-amber-900 text-amber-300" : "bg-emerald-950 text-emerald-400 border border-emerald-500/30"}`}>
                  {isCrisisSim ? "DEGRADED" : "NOMINAL"}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">Crew on-site: {stationData.crewCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4 SCADA KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Card 1: Microgrid & CHP */}
        <div className="bg-[#061527] border border-[#0F2F53] hover:border-cyan-500/40 rounded-2xl p-4 shadow-lg space-y-2.5 transition-all">
          <div className="flex justify-between items-center text-xs text-amber-400 font-bold">
            <span className="flex items-center space-x-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span>MICROGRID &amp; CHP</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Hybrid Bus</span>
          </div>
          <div className="text-3xl font-black text-white font-sans">
            {isCrisisSim ? "82.1" : stationData.microgridKw} <span className="text-sm font-normal text-slate-400 font-mono">kW</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#0F2F53]/60 text-slate-400">
            <span>BESS SoC: <strong className="text-white">{stationData.bessSoc}%</strong></span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              Load: {stationData.microgridLoadKw} kW
            </span>
            <span>Freq: <strong className="text-white">{stationData.gridFreq} Hz</strong></span>
          </div>
        </div>

        {/* Card 2: Water & Life Support */}
        <div className="bg-[#061527] border border-[#0F2F53] hover:border-cyan-500/40 rounded-2xl p-4 shadow-lg space-y-2.5 transition-all">
          <div className="flex justify-between items-center text-xs text-cyan-400 font-bold">
            <span className="flex items-center space-x-1.5">
              <Droplets className="h-3.5 w-3.5" />
              <span>WATER &amp; LIFE SUPPORT</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-950/80 text-cyan-300 border border-blue-500/30 text-[9px] font-bold">
              {station === "bharati" ? "RO Pump Active" : "Lake Intake"}
            </span>
          </div>
          <div className="text-3xl font-black text-white font-sans">
            {stationData.waterStoredL.toLocaleString()} <span className="text-sm font-normal text-slate-400 font-mono">L</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#0F2F53]/60 text-slate-400">
            <span>Hab Temp: <strong className="text-emerald-400">{stationData.habTemp}°C</strong></span>
            <span>CO₂: <strong className="text-white">{stationData.co2Ppm} ppm</strong></span>
          </div>
        </div>

        {/* Card 3: Fuel & Resupply */}
        <div className="bg-[#061527] border border-[#0F2F53] hover:border-cyan-500/40 rounded-2xl p-4 shadow-lg space-y-2.5 transition-all">
          <div className="flex justify-between items-center text-xs text-amber-300 font-bold">
            <span className="flex items-center space-x-1.5">
              <Fuel className="h-3.5 w-3.5" />
              <span>FUEL &amp; RESUPPLY</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
              {stationData.fuelStoredKl} kL Stored
            </span>
          </div>
          <div className="text-3xl font-black text-white font-sans">
            {stationData.fuelDays} <span className="text-sm font-normal text-slate-400 font-mono">Days</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#0F2F53]/60 text-slate-400">
            <span>Burn: <strong className="text-white">{stationData.fuelBurnL} L/day</strong></span>
            <span className="text-amber-300">Rations: <strong>{stationData.rationsDays} Days</strong></span>
          </div>
        </div>

        {/* Card 4: Polar Science */}
        <div className="bg-[#061527] border border-[#0F2F53] hover:border-cyan-500/40 rounded-2xl p-4 shadow-lg space-y-2.5 transition-all">
          <div className="flex justify-between items-center text-xs text-purple-400 font-bold">
            <span className="flex items-center space-x-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>POLAR SCIENCE</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30 text-[9px] font-bold">
              Kp: {stationData.kpIndex} (Quiet)
            </span>
          </div>
          <div className="text-3xl font-black text-white font-sans">
            {stationData.ozoneDu} <span className="text-sm font-normal text-slate-400 font-mono">DU</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#0F2F53]/60 text-slate-400">
            <span>Aurora Prob: <strong className="text-cyan-300">{stationData.auroraProb}%</strong></span>
            <span>Solar Wind: <strong className="text-white">{stationData.solarWindKm} km/s</strong></span>
          </div>
        </div>
      </div>

      {/* 3. 2-COLUMN BOTTOM SPLIT PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Panel: Station Subsystem Health Matrix */}
        <div className="lg:col-span-7 bg-[#061527] border border-[#0F2F53] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#0F2F53]/70">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
              <Cpu className="h-4 w-4" />
              <span className="tracking-wider">STATION SUBSYSTEM HEALTH MATRIX</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Nodes Connected</span>
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Row 1 */}
            <div className="p-3.5 rounded-xl bg-[#040E1B] border border-[#0F2F53]/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Triplex Diesel Genset Cluster</span>
                <span className="text-[10px] text-emerald-400 font-bold">N+1 Redundancy</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                1 of 3 Generators Online with exhaust jacket heat recovery to central hydronic loop.
              </p>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan-400 h-full w-[100%] rounded-full" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="p-3.5 rounded-xl bg-[#040E1B] border border-[#0F2F53]/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Renewables &amp; Albedo Gain</span>
                <span className="text-[10px] text-cyan-400 font-bold">49.3 kW</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Bifacial PV arrays capture ~28.4% reflected polar albedo; wind turbines operating with de-icing heaters.
              </p>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan-400 h-full w-[75%] rounded-full" />
              </div>
            </div>

            {/* Row 3 */}
            <div className="p-3.5 rounded-xl bg-[#040E1B] border border-[#0F2F53]/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Greywater Biological Treatment</span>
                <span className="text-[10px] text-cyan-400 font-bold">91.2% Eff</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                State-of-the-art bioreactor and reverse osmosis recycling minimizes fresh glacial intake.
              </p>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan-400 h-full w-[91%] rounded-full" />
              </div>
            </div>

            {/* Row 4 */}
            <div className="p-3.5 rounded-xl bg-[#040E1B] border border-[#0F2F53]/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Stilt Structural Strain</span>
                <span className="text-[10px] text-purple-400 font-bold">142 με</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Real-time strain gauges on elevated steel stilts monitor aerodynamic drag and permafrost anchor integrity.
              </p>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-500 h-full w-[35%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Live Incident & Telemetry Stream */}
        <div className="lg:col-span-5 bg-[#061527] border border-[#0F2F53] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#0F2F53]/70">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                <Activity className="h-4 w-4" />
                <span className="tracking-wider">LIVE INCIDENT &amp; TELEMETRY STREAM</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Real-Time</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#040E1B] border border-[#0F2F53]/60 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-bold flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Solar Inverter MPPT Albedo Gain Active</span>
                  </span>
                  <span className="text-slate-500 text-[10px]">14:32 UTC</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Snow surface albedo reflection is boosting bifacial Solar PV output by +28.4%.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#040E1B] border border-[#0F2F53]/60 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>Glacial Pump Lifeline Cycling Nominal</span>
                  </span>
                  <span className="text-slate-500 text-[10px]">14:28 UTC</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Sub-ice heated intake line operational; flow rate steady at 45.2 L/min.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#040E1B] border border-[#0F2F53]/60 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-bold flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    <span>SATCOM GSAT / Edge Sync Link Active</span>
                  </span>
                  <span className="text-slate-500 text-[10px]">14:15 UTC</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  42ms edge latency established with NCPOR Ground Operations Goa.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#0F2F53]/70 flex justify-between items-center text-[11px] text-slate-400">
            <span>SATCOM Ping: <strong className="text-white">{stationData.satcomPing}</strong></span>
            <Link href="/data-sources" className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-bold">
              <span>Link Diagnostics</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
