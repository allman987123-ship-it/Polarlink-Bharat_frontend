"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  MapPin,
  Calendar,
  Users,
  Radio,
  Zap,
  Droplets,
  ShieldCheck,
  Thermometer,
  Wind,
  Compass,
  ArrowUpRight,
  Shield,
  Layers,
  HeartPulse,
} from "lucide-react";

export default function StationsPage() {
  const [activeTab, setActiveTab] = useState<"maitri" | "bharati">("maitri");

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="glass-panel rounded-2xl p-5 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white font-mono uppercase tracking-wider flex items-center space-x-2.5">
            <Activity className="h-6 w-6 text-cyan-400" />
            <span>INDIAN ANTARCTIC RESEARCH STATIONS PROFILE</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Operational capabilities, life-support logistics, and architectural engineering dossiers.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#050D1A] border border-[#143257] p-1 rounded-xl text-xs font-mono shadow-inner">
          <button
            onClick={() => setActiveTab("maitri")}
            className={`px-4 py-2 rounded-lg transition-all font-bold ${
              activeTab === "maitri"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            MAITRI STATION (1989)
          </button>
          <button
            onClick={() => setActiveTab("bharati")}
            className={`px-4 py-2 rounded-lg transition-all font-bold ${
              activeTab === "bharati"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            BHARATI STATION (2012)
          </button>
        </div>
      </div>

      {/* Main Station Profile Card */}
      {activeTab === "maitri" ? (
        <div className="glass-panel rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="font-bold px-2.5 py-1 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800">
                  MAI • 2ND INDIAN PERMANENT STATION
                </span>
                <span className="font-bold px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  ● OPERATIONAL
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
                MAITRI RESEARCH STATION (मैत्री)
              </h3>
              <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
                Commissioned in 1989 on the rocky, ice-free permafrost terrain of Schirmacher Oasis, Queen Maud Land. Built on elevated red steel space-frame stilts to prevent katabatic snow accumulation, Maitri serves as India&apos;s pivotal gateway for geomagnetism, atmospheric physics, meteorology, glaciology, and seismology.
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-400 bg-[#050D1A]/90 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div>Coordinates: <strong className="text-cyan-300">70°45′58″S, 11°43′56″E</strong></div>
              <div>Elevation: <strong className="text-white">130 m AMSL</strong></div>
              <div>Operating Agency: <strong className="text-amber-300">NCPOR, MoES (Govt of India)</strong></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#050D1A]/90 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold font-mono text-xs">
                <Users className="h-4 w-4" />
                <span>EXPEDITION OCCUPANCY</span>
              </div>
              <div className="text-3xl font-mono font-black text-white">25 <span className="text-xs font-normal text-slate-400">Wintering</span> / 65 <span className="text-xs font-normal text-slate-400">Summer</span></div>
              <p className="text-xs text-slate-400">Accommodates scientists, engineers, logistics and medical support crew.</p>
            </div>

            <div className="bg-[#050D1A]/90 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-mono text-xs">
                <Zap className="h-4 w-4" />
                <span>POWER GENERATION</span>
              </div>
              <div className="text-3xl font-mono font-black text-white">375 <span className="text-xs font-normal text-slate-400">kVA</span> + 50 <span className="text-xs font-normal text-slate-400">kW Solar</span></div>
              <p className="text-xs text-slate-400">3x 125kVA Diesel Gensets running on Jet A-1 + Bifacial Polar Solar PV string.</p>
            </div>

            <div className="bg-[#050D1A]/90 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-blue-400 font-bold font-mono text-xs">
                <Droplets className="h-4 w-4" />
                <span>WATER SOURCE</span>
              </div>
              <div className="text-2xl font-mono font-black text-white">Lake Priyadarshini</div>
              <p className="text-xs text-slate-400">Freshwater glacier melt intake with heated thermal pipelines and RO purification.</p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href="/digital-twin?station=maitri"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-black text-xs font-mono shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all"
            >
              <span>EXPLORE MAITRI IN 3D DIGITAL TWIN</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="font-bold px-2.5 py-1 rounded-lg bg-sky-950/80 text-cyan-300 border border-sky-800">
                  BHA • 3RD INDIAN PERMANENT STATION
                </span>
                <span className="font-bold px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  ● OPERATIONAL
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
                BHARATI RESEARCH STATION (भारती)
              </h3>
              <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
                Commissioned in 2012 in the Larsemann Hills, Princess Elizabeth Land. Built with 134 prefabricated shipping containers wrapped in an aerodynamic insulated envelope, Bharati operates as a world-class polar laboratory and hosts an ISRO Earth Station for high-throughput satellite downlinks.
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-400 bg-[#050D1A]/90 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div>Coordinates: <strong className="text-cyan-300">69°24′29″S, 76°11′14″E</strong></div>
              <div>Elevation: <strong className="text-white">35 m AMSL</strong></div>
              <div>Operating Agency: <strong className="text-amber-300">NCPOR, MoES (Govt of India)</strong></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#050D1A]/90 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold font-mono text-xs">
                <Users className="h-4 w-4" />
                <span>EXPEDITION OCCUPANCY</span>
              </div>
              <div className="text-3xl font-mono font-black text-white">47 <span className="text-xs font-normal text-slate-400">Wintering</span> / 72 <span className="text-xs font-normal text-slate-400">Summer</span></div>
              <p className="text-xs text-slate-400">Multi-level living suites, state-of-the-art biochemistry laboratories, and telemedicine facility.</p>
            </div>

            <div className="bg-[#050D1A]/90 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-mono text-xs">
                <Zap className="h-4 w-4" />
                <span>POWER &amp; HEAT COGENERATION</span>
              </div>
              <div className="text-3xl font-mono font-black text-white">600 <span className="text-xs font-normal text-slate-400">kVA CHP</span> + 100 <span className="text-xs font-normal text-slate-400">kW Solar</span></div>
              <p className="text-xs text-slate-400">Combined Heat &amp; Power units recovering 85% exhaust thermal energy for hydronic heating.</p>
            </div>

            <div className="bg-[#050D1A]/90 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-purple-400 font-bold font-mono text-xs">
                <Radio className="h-4 w-4" />
                <span>ISRO IMGEOS EARTH STATION</span>
              </div>
              <div className="text-3xl font-mono font-black text-white">105 <span className="text-xs font-normal text-slate-400">Mbps Downlink</span></div>
              <p className="text-xs text-slate-400">Continuous polar satellite telemetry reception forwarded via dedicated link to NRSC Shadnagar.</p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href="/digital-twin?station=bharati"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-black text-xs font-mono shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all"
            >
              <span>EXPLORE BHARATI IN 3D DIGITAL TWIN</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
