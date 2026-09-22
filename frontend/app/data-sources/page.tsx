"use client";

import React from "react";
import { Database, ShieldCheck, ExternalLink, Globe, CheckCircle2, Radio, Server, Wifi } from "lucide-react";

export default function DataSourcesPage() {
  const sources = [
    {
      name: "NCPOR Polar Data Portal & Central SCADA Ingestion",
      type: "Official Government Antarctic Repository",
      provider: "National Centre for Polar and Ocean Research (MoES)",
      parameters: "Station health, structural telemetry, logistics cargo manifests, power microgrid telemetry, trace heating SCADA",
      status: "CONNECTED / ONLINE",
      provenance: "Direct API Gateway / SCADA Ingestion Hub (Goa ↔ Maitri ↔ Bharati)",
      latency: "42 ms",
      frequency: "Real-time MQTT / WebSocket (1s polling)",
    },
    {
      name: "Open-Meteo Antarctic High-Resolution Weather Models",
      type: "Public Polar Numerical Weather Prediction",
      provider: "ECMWF / DWD Polar High-Res Spatial Ingestion",
      parameters: "Surface temperature, wind speed 10m, atmospheric pressure, relative humidity, snow precipitation",
      status: "LIVE / SYNCHRONIZED",
      provenance: "Public REST API (Coordinates: Maitri 70°45′S 11°43′E, Bharati 69°24′S 76°11′E)",
      latency: "128 ms",
      frequency: "Hourly Assimilation Forecast Updates",
    },
    {
      name: "ISRO IMGEOS Satellite Earth Station Downlink Stream",
      type: "Satellite Telemetry Stream",
      provider: "Indian Space Research Organisation (ISRO)",
      parameters: "Antenna tracking telemetry, SNR dB, azimuth/elevation, downlink throughput",
      status: "PASS ACTIVE (LOCKED)",
      provenance: "ISRO Bharati Station Link Gateway (Direct 7.5m Geodesic Radome Downlink)",
      latency: "38 ms",
      frequency: "Continuous Orbital Pass Stream",
    },
    {
      name: "Survey of India (SOI) & NCPOR Antarctic Spatial Data Infrastructure (ASDI)",
      type: "Geospatial GIS & Stereographic Mapping",
      provider: "Survey of India / NCPOR Cryosphere GIS Lab",
      parameters: "Topography, permafrost moraine, blue ice runways, ice shelf boundaries (EPSG:3031)",
      status: "SYNCHRONIZED",
      provenance: "OGC WMS/WFS Polar Stereographic Map Layers",
      latency: "85 ms",
      frequency: "Quarterly Geodetic Baseline Updates",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="glass-panel rounded-2xl p-5 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white font-mono uppercase tracking-wider flex items-center space-x-2.5">
            <Database className="h-6 w-6 text-cyan-400" />
            <span>DATA PROVENANCE &amp; TRANSPARENCY MATRIX</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Full technical disclosure of public polar data APIs, sensor ingestion gateways, and ISRO satcom links.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 font-bold flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>● 4 / 4 INGESTION GATEWAYS OPERATIONAL</span>
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {sources.map((src, i) => (
          <div
            key={i}
            className="glass-panel glass-panel-hover rounded-3xl p-6 shadow-2xl space-y-4 transition-all"
          >
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg bg-sky-950/80 text-cyan-300 border border-sky-800 font-bold">
                  {src.type}
                </span>
                <h3 className="text-base font-black text-white font-mono mt-1.5">{src.name}</h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Agency / Provider: <strong className="text-slate-200">{src.provider}</strong></div>
              </div>
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-xl bg-[#050D1A] text-slate-300 border border-slate-800 flex items-center space-x-1">
                  <Wifi className="h-3 w-3 text-cyan-400" />
                  <span>{src.latency}</span>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-700 font-bold">
                  ● {src.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#050D1A]/90 p-4 rounded-2xl border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">PARAMETERS MONITORED:</span>
                <div className="text-slate-200 mt-1 leading-relaxed">{src.parameters}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">DATA PROVENANCE &amp; PROTOCOL:</span>
                <div className="text-cyan-300 mt-1 leading-relaxed">{src.provenance}</div>
                <div className="text-[11px] text-slate-400 mt-1.5">Stream Update: {src.frequency}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
