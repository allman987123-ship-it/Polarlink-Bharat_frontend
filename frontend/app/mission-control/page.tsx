"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Radio,
  Activity,
  Zap,
  Cpu,
  AlertTriangle,
  CloudSnow,
  Wind,
  Thermometer,
  ShieldAlert,
  Layers,
  CheckCircle2,
  RefreshCw,
  Clock,
  Compass,
} from "lucide-react";
import { StationCanvas3D } from "@/components/digital-twin/StationCanvas3D";
import { RiskGauge } from "@/components/scada/RiskGauge";
import { EnergyFlowDiagram } from "@/components/scada/EnergyFlowDiagram";
import { TelemetryCard } from "@/components/scada/TelemetryCard";
import { getStations, getAlerts, getStationAssets } from "@/lib/api";
import { useStationWebSocket } from "@/lib/websocket";

export default function MissionControlPage() {
  const { telemetryData } = useStationWebSocket();
  const [selectedStation, setSelectedStation] = useState<"maitri" | "bharati">("maitri");
  const [activeTab, setActiveTab] = useState<"3D" | "FLOW" | "ASSETS">("3D");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const [maitriData, setMaitriData] = useState<any>({
    weather: { temperature_c: -19.4, wind_speed_kmh: 32.6, surface_pressure_hpa: 981.2, blizzard_risk: "MODERATE", source: "NCPOR Polar AWS", last_updated: "2026-09-18 12:40:00 UTC" },
    energy: { total_generation_kw: 95.0, total_consumption_kw: 88.0, solar_generation_kw: 18.5, generator_output_kw: 76.5, battery_soc_pct: 86.5, battery_temp_c: 18.4, fuel_consumption_lh: 24.2, current_load_pct: 72.0, grid_stability: "STABLE" },
    risk: { station_id: "maitri", composite_risk_score: 22.4, risk_level: "LOW", weather_risk: 18.0, infrastructure_risk: 12.0, energy_risk: 14.0, logistics_risk: 22.0, environmental_risk: 10.0 },
  });

  const [bharatiData, setBharatiData] = useState<any>({
    weather: { temperature_c: -14.2, wind_speed_kmh: 24.8, surface_pressure_hpa: 992.5, blizzard_risk: "LOW", source: "NCPOR Polar AWS", last_updated: "2026-09-18 12:40:00 UTC" },
    energy: { total_generation_kw: 145.0, total_consumption_kw: 132.0, solar_generation_kw: 38.0, generator_output_kw: 107.0, battery_soc_pct: 92.0, battery_temp_c: 19.1, fuel_consumption_lh: 31.5, current_load_pct: 68.0, grid_stability: "STABLE" },
    risk: { station_id: "bharati", composite_risk_score: 16.8, risk_level: "LOW", weather_risk: 12.0, infrastructure_risk: 8.0, energy_risk: 10.0, logistics_risk: 15.0, environmental_risk: 6.0 },
  });

  const [alerts, setAlerts] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    getAlerts().then(setAlerts).catch(() => {});
    getStationAssets(selectedStation).then(setAssets).catch(() => {});
  }, [selectedStation]);

  useEffect(() => {
    if (telemetryData?.stations) {
      if (telemetryData.stations.maitri) setMaitriData(telemetryData.stations.maitri);
      if (telemetryData.stations.bharati) setBharatiData(telemetryData.stations.bharati);
      if (telemetryData.active_alerts) setAlerts(telemetryData.active_alerts);
    }
  }, [telemetryData]);

  const curr = selectedStation === "maitri" ? maitriData : bharatiData;
  const isGenFaultActive = alerts.some((a) => a.severity === "CRITICAL" && a.station_id === "maitri");

  return (
    <div className="space-y-5">
      {/* Dense Mission Control Top Ribbon */}
      <div className="bg-[#0B192C] border border-[#1E3E62] rounded-xl px-4 py-3 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <h2 className="text-sm md:text-base font-black text-white font-mono uppercase tracking-wider">
              ANTARCTIC OPERATIONS CENTER • MISSION CONTROL SCADA
            </h2>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
              <span>SYSTEM STATUS: <strong className="text-emerald-400">● ONLINE</strong></span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-cyan-400" />
                <span>SYNC: {curr.weather?.last_updated || "LIVE UTC"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Station Tabs */}
        <div className="flex items-center space-x-2 bg-[#071322] border border-[#1E3E62] p-1 rounded-lg text-xs font-mono">
          <button
            onClick={() => setSelectedStation("maitri")}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedStation === "maitri"
                ? "bg-sky-600 text-white font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            MAITRI (70°S)
          </button>
          <button
            onClick={() => setSelectedStation("bharati")}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedStation === "bharati"
                ? "bg-sky-600 text-white font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            BHARATI (69°S)
          </button>
        </div>
      </div>

      {/* 3-Column Operations SCADA Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Station Vital Status (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Risk Gauge */}
          <RiskGauge risk={curr.risk} stationName={selectedStation} />

          {/* Environmental Telemetry */}
          <div className="bg-[#0B192C] border border-[#1E3E62] rounded-xl p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <CloudSnow className="h-4 w-4 text-cyan-400" />
                <span>Polar Weather Status</span>
              </span>
              <span className="text-[10px] text-cyan-300 font-mono">LIVE AWS</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#071322] p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">AMBIENT TEMP</div>
                <div className="text-xl font-mono font-bold text-white mt-0.5">
                  {curr.weather?.temperature_c}°C
                </div>
              </div>

              <div className="bg-[#071322] p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">WIND VELOCITY</div>
                <div className="text-xl font-mono font-bold text-sky-300 mt-0.5">
                  {curr.weather?.wind_speed_kmh} <span className="text-[10px]">km/h</span>
                </div>
              </div>

              <div className="bg-[#071322] p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">BAROMETER</div>
                <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">
                  {curr.weather?.surface_pressure_hpa} hPa
                </div>
              </div>

              <div className="bg-[#071322] p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">BLIZZARD RISK</div>
                <div
                  className={`text-sm font-mono font-bold mt-0.5 ${
                    curr.weather?.blizzard_risk === "EXTREME" || curr.weather?.blizzard_risk === "HIGH"
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  ● {curr.weather?.blizzard_risk}
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
              <span>Source: {curr.weather?.source}</span>
              <span className="text-emerald-400">● Nominal</span>
            </div>
          </div>

          {/* Microgrid Quick Summary */}
          <div className="bg-[#0B192C] border border-[#1E3E62] rounded-xl p-4 shadow-xl space-y-2">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-1.5">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span>Microgrid Summary</span>
            </h3>
            <div className="flex justify-between text-xs font-mono py-1 border-b border-slate-800">
              <span className="text-slate-400">Total Generation:</span>
              <span className="text-white font-bold">{curr.energy?.total_generation_kw} kW</span>
            </div>
            <div className="flex justify-between text-xs font-mono py-1 border-b border-slate-800">
              <span className="text-slate-400">Solar PV String:</span>
              <span className="text-cyan-300 font-bold">+{curr.energy?.solar_generation_kw} kW</span>
            </div>
            <div className="flex justify-between text-xs font-mono py-1 border-b border-slate-800">
              <span className="text-slate-400">Battery SoC:</span>
              <span className="text-emerald-400 font-bold">{curr.energy?.battery_soc_pct}%</span>
            </div>
            <div className="flex justify-between text-xs font-mono py-1">
              <span className="text-slate-400">Grid Stability:</span>
              <span className="text-emerald-300 font-bold">● {curr.energy?.grid_stability}</span>
            </div>
          </div>
        </div>

        {/* Center Column: Interactive 3D Digital Twin / Energy Topology (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0B192C] border border-[#1E3E62] rounded-xl p-3 shadow-xl">
            <div className="flex justify-between items-center mb-2 px-1">
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold text-white font-mono">
                  LIVE 3D DIGITAL TWIN & TOPOLOGY VIEW
                </span>
              </div>
              <div className="flex items-center space-x-1 bg-[#071322] p-0.5 rounded border border-slate-700 text-[11px] font-mono">
                <button
                  onClick={() => setActiveTab("3D")}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === "3D" ? "bg-cyan-600 text-white font-bold" : "text-slate-400"
                  }`}
                >
                  3D MODEL
                </button>
                <button
                  onClick={() => setActiveTab("FLOW")}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === "FLOW" ? "bg-cyan-600 text-white font-bold" : "text-slate-400"
                  }`}
                >
                  POWER FLOW
                </button>
              </div>
            </div>

            {activeTab === "3D" ? (
              <StationCanvas3D
                stationId={selectedStation}
                faultActive={isGenFaultActive && selectedStation === "maitri"}
                onSelectAsset={(asset) => setSelectedAsset(asset)}
              />
            ) : (
              <EnergyFlowDiagram energy={curr.energy} stationName={selectedStation} />
            )}
          </div>
        </div>

        {/* Right Column: Active Alerts, CCTV Stream & Assets (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Active Real-Time Alerts */}
          <div className="bg-[#0B192C] border border-[#1E3E62] rounded-xl p-4 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Station Alarm Dispatch</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                {alerts.filter((a) => a.status === "ACTIVE").length} ACTIVE
              </span>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto scrollbar-thin">
              {alerts.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-4 font-mono">
                  No active alarms logged.
                </div>
              ) : (
                alerts.map((al) => (
                  <div
                    key={al.id}
                    className={`p-2.5 rounded-lg border text-xs font-mono transition-all ${
                      al.severity === "CRITICAL"
                        ? "bg-red-950/60 border-red-500 text-red-200"
                        : al.severity === "WARNING"
                        ? "bg-amber-950/60 border-amber-500 text-amber-200"
                        : "bg-slate-900 border-slate-700 text-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold truncate max-w-[170px]">{al.title}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 uppercase font-bold">
                        {al.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{al.description}</p>
                    <div className="mt-1.5 flex justify-between items-center text-[9px] text-slate-400">
                      <span>{al.station_id.toUpperCase()}</span>
                      <span>{al.created_at}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Subsystem SCADA Health */}
          <div className="bg-[#0B192C] border border-[#1E3E62] rounded-xl p-4 shadow-xl">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>Subsystem Telemetry Matrix</span>
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center bg-[#071322] p-2 rounded border border-slate-800">
                <span className="text-slate-300">Diesel Genset 01</span>
                <span className="text-emerald-400 font-bold">98% ● NORMAL</span>
              </div>
              <div className="flex justify-between items-center bg-[#071322] p-2 rounded border border-slate-800">
                <span className="text-slate-300">Diesel Genset 02</span>
                <span
                  className={`font-bold ${
                    isGenFaultActive && selectedStation === "maitri"
                      ? "text-red-400 animate-pulse"
                      : "text-emerald-400"
                  }`}
                >
                  {isGenFaultActive && selectedStation === "maitri" ? "62% ● CRITICAL" : "96% ● NORMAL"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-[#071322] p-2 rounded border border-slate-800">
                <span className="text-slate-300">Central HVAC Loop</span>
                <span className="text-emerald-400 font-bold">97% ● 21.2°C</span>
              </div>
              <div className="flex justify-between items-center bg-[#071322] p-2 rounded border border-slate-800">
                <span className="text-slate-300">SATCOM GSAT Radome</span>
                <span className="text-emerald-400 font-bold">99% ● 14.2 dB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
