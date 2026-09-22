"use client";

import React, { useState } from "react";
import {
  FileText,
  Radio,
  ExternalLink,
  ChevronRight,
  Shield,
  Calendar,
  Sparkles,
} from "lucide-react";

export function CentralPublishingFeed() {
  const [activeCategory, setActiveCategory] = useState<"ALL" | "EXPEDITIONS" | "ATMOSPHERE" | "ADVISORIES">("ALL");

  const articles = [
    {
      id: "CCPS-2026-089",
      category: "EXPEDITIONS",
      title: "45th Indian Scientific Expedition to Antarctica (ISEA) Resupply Convoy Departs Cape Town",
      date: "18 Sep 2026",
      source: "NCPOR Polar Operations Directorate",
      summary: "Chartered polar ice-class cargo vessel carrying 1,400 tonnes of Jet A-1 arctic fuel and scientific instrumentation for Maitri and Bharati stations is en route.",
      url: "https://ncpor.res.in",
    },
    {
      id: "CCPS-2026-074",
      category: "ATMOSPHERE",
      title: "Schirmacher Oasis Geomagnetic Observatory Records Severe Polar Geomagnetic Storm",
      date: "17 Sep 2026",
      source: "Indian Institute of Geomagnetism & NCPOR",
      summary: "High-latitude riometers and tri-axial fluxgate magnetometers at Maitri recorded K-index 7 aurora substorms with nominal SATCOM link preservation.",
      url: "https://moes.gov.in",
    },
    {
      id: "CCPS-2026-061",
      category: "ADVISORIES",
      title: "MoES Issues Winter Operations Safety Advisory for Larsemann Hills Crevasse Routes",
      date: "15 Sep 2026",
      source: "Ministry of Earth Sciences, Govt of India",
      summary: "Autonomous ground penetrating radar (GPR) surveys updated the fast ice transit corridors for PistenBully tracked convoy safety.",
      url: "https://www.india.gov.in",
    },
  ];

  const filtered = activeCategory === "ALL" ? articles : articles.filter((a) => a.category === activeCategory);

  return (
    <div className="bg-[#081528]/95 backdrop-blur-md border border-[#1E3E62] rounded-2xl p-4 shadow-2xl select-none">
      <div className="flex flex-wrap justify-between items-center mb-3 pb-2 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-sky-950 border border-sky-600/40 flex items-center justify-center text-cyan-300">
            <Radio className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-mono uppercase">
              Central Content Publishing System (CCPS) Feed
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Government of India / MoES Unified Data &amp; Bulletin Broadcast
            </span>
          </div>
        </div>

        <div className="flex space-x-1 font-mono text-[10px]">
          {["ALL", "EXPEDITIONS", "ATMOSPHERE", "ADVISORIES"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-2 py-0.5 rounded transition-all ${
                activeCategory === cat
                  ? "bg-cyan-600 text-white font-bold"
                  : "text-slate-400 hover:text-white bg-slate-900/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-[#040C1A] border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mb-1">
                <span className="px-1.5 py-0.2 rounded bg-sky-950 text-cyan-300 border border-sky-800 font-bold">
                  {item.category}
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="h-2.5 w-2.5" />
                  <span>{item.date}</span>
                </span>
              </div>
              <h4 className="text-xs font-bold text-white font-mono group-hover:text-cyan-300 transition-colors line-clamp-2 mt-1">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                {item.summary}
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono text-cyan-400">
              <span className="text-slate-500 truncate mr-2">{item.source}</span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-0.5 hover:underline font-bold shrink-0"
              >
                <span>Read Official Dispatch</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
