"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Layers,
  Ship,
  Plane,
  Navigation,
  Globe,
  Radio,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight,
  Compass,
} from "lucide-react";
import { getGisLayers } from "@/lib/api";

export default function GisPage() {
  const [gisData, setGisData] = useState<any>({
    stations: [
      { id: "maitri", name: "Maitri Research Station", country: "India 🇮🇳", coordinates: [11.7322, -70.7661], status: "OPERATIONAL", region: "Schirmacher Oasis", elevation: "130m AMSL", crew: "25 Winter" },
      { id: "bharati", name: "Bharati Research Station", country: "India 🇮🇳", coordinates: [76.1872, -69.4081], status: "OPERATIONAL", region: "Larsemann Hills", elevation: "35m AMSL", crew: "47 Winter" },
      { id: "dakshin-gangotri", name: "Dakshin Gangotri (Historical)", country: "India 🇮🇳", coordinates: [12.0000, -70.0989], status: "HISTORICAL_SUPPLY_BASE", region: "Ice Shelf", elevation: "Sea Level", crew: "Unmanned" },
    ],
    routes: [
      { id: "cape-town-maitri", name: "DROMLAN Air Corridor: Cape Town ✈ Novolazarevskaya Runway (Maitri)", type: "AIR" },
      { id: "isea-vessel-44", name: "44th ISEA Expedition Supply Vessel (Goa 🚢 Bharati 🚢 Maitri)", type: "MARITIME" },
    ],
    vessels: [
      { id: "vessel-01", name: "MV Vasiliy Golovnin (NCPOR Charter)", speed_knots: 12.4, destination: "Bharati Station", coordinates: [54.3, -58.4] },
    ],
  });

  const [selectedStation, setSelectedStation] = useState<any>(gisData.stations[0]);

  useEffect(() => {
    getGisLayers().then(setGisData).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="glass-panel rounded-2xl p-5 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white font-mono uppercase tracking-wider flex items-center space-x-2.5">
            <Globe className="h-6 w-6 text-cyan-400" />
            <span>ANTARCTIC SPATIAL GIS &amp; EXPEDITION LOGISTICS MAP</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Polar stereographic mapping of Indian stations, expedition supply vessels, flight corridors, and ice shelves.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-[#050D1A] text-cyan-300 border border-[#143257] font-bold">
            PROJECTION: EPSG:3031 / POLAR STEREOGRAPHIC
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Antarctic Spatial Canvas / Interactive Map (8 cols) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex justify-between items-center text-xs font-mono border-b border-slate-800/80 pb-3">
            <span className="text-white font-black uppercase tracking-wider">ANTARCTIC CONTINENT SPATIAL LAYER</span>
            <span className="text-cyan-400">NCPOR ASDI Spatial Infrastructure</span>
          </div>

          {/* Interactive Antarctic Vector Map Representation */}
          <div className="relative w-full h-[480px] bg-gradient-to-b from-[#061224] to-[#030914] rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-6 shadow-inner">
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

            {/* Simulated Polar Continent Outline */}
            <div className="relative w-[400px] h-[400px] rounded-full border border-sky-500/20 flex items-center justify-center">
              <div className="absolute inset-6 rounded-full border border-cyan-500/15" />
              <div className="absolute inset-20 rounded-full border border-cyan-500/15" />
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <div className="absolute text-[10px] font-mono text-slate-400 font-bold">SOUTH POLE 90°S</div>

              {/* Maitri Marker (Queen Maud Land ~ 70°S, 11°E) */}
              <button
                onClick={() => setSelectedStation(gisData.stations.find((s: any) => s.id === "maitri"))}
                className="absolute top-12 left-28 p-2.5 rounded-xl bg-[#050D1A]/95 border border-amber-400 text-amber-300 text-xs font-mono flex items-center space-x-2 shadow-xl shadow-amber-500/20 hover:scale-110 transition-transform"
              >
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span className="font-bold">MAITRI (70°S)</span>
              </button>

              {/* Bharati Marker (Larsemann Hills ~ 69°S, 76°E) */}
              <button
                onClick={() => setSelectedStation(gisData.stations.find((s: any) => s.id === "bharati"))}
                className="absolute top-16 right-12 p-2.5 rounded-xl bg-[#050D1A]/95 border border-cyan-400 text-cyan-300 text-xs font-mono flex items-center space-x-2 shadow-xl shadow-cyan-500/20 hover:scale-110 transition-transform"
              >
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-bold">BHARATI (69°S)</span>
              </button>

              {/* Dakshin Gangotri Historical */}
              <button
                onClick={() => setSelectedStation(gisData.stations.find((s: any) => s.id === "dakshin-gangotri"))}
                className="absolute top-4 left-24 p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-400 text-[10px] font-mono hover:text-white"
              >
                Dakshin Gangotri (1983)
              </button>

              {/* Vessel Track */}
              <div className="absolute bottom-16 right-6 p-2 rounded-xl bg-blue-950/90 border border-blue-500 text-sky-300 text-[11px] font-mono flex items-center space-x-1.5 shadow-lg">
                <Ship className="h-4 w-4 text-cyan-400" />
                <span>MV Vasiliy Golovnin (12.4 kn)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Selected Station / Feature Details (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800/80 pb-3">
              <MapPin className="h-4 w-4 text-cyan-400" />
              <span>Spatial Feature Inspector</span>
            </h3>

            {selectedStation ? (
              <div className="space-y-3.5 font-mono text-xs">
                <div className="bg-[#050D1A]/90 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">FEATURE NAME:</span>
                  <div className="text-white font-black text-base mt-1">{selectedStation.name}</div>
                  <span className="text-xs text-cyan-300 font-semibold">{selectedStation.region}</span>
                </div>

                <div className="bg-[#050D1A]/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">COORDINATES:</span>
                    <span className="text-emerald-400 font-bold">
                      [{selectedStation.coordinates[0]}°E, {selectedStation.coordinates[1]}°S]
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ELEVATION:</span>
                    <span className="text-white font-bold">{selectedStation.elevation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">CREW COMPLEMENT:</span>
                    <span className="text-cyan-300 font-bold">{selectedStation.crew}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">STATUS:</span>
                    <span className="text-emerald-400 font-bold">● {selectedStation.status}</span>
                  </div>
                </div>

                <Link
                  href={`/digital-twin?station=${selectedStation.id}`}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-black text-center block shadow-lg shadow-cyan-500/20 transition-all text-xs font-mono"
                >
                  LAUNCH 3D DIGITAL TWIN
                </Link>
              </div>
            ) : (
              <div className="text-slate-400 text-xs py-10 text-center font-mono">
                Click any station marker or supply vessel on the map to inspect spatial telemetry.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
