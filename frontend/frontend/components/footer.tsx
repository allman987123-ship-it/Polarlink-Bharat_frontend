import React from "react";
import Link from "next/link";
import { ShieldCheck, Database, Radio, Info, ExternalLink, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#040914] border-t border-[#1E3E62] text-slate-400 text-xs py-8 px-4 mt-auto select-none">
      {/* Official Government Linking Bar */}
      <div className="max-w-[1920px] mx-auto pb-6 mb-6 border-b border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-[11px] font-mono">
        <a
          href="https://www.india.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#071322] border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-white transition-all flex items-center justify-between"
        >
          <span>india.gov.in</span>
          <ExternalLink className="h-3 w-3 text-cyan-400" />
        </a>
        <a
          href="https://www.mygov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#071322] border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-white transition-all flex items-center justify-between"
        >
          <span>mygov.in</span>
          <ExternalLink className="h-3 w-3 text-cyan-400" />
        </a>
        <a
          href="https://data.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#071322] border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-white transition-all flex items-center justify-between"
        >
          <span>data.gov.in</span>
          <ExternalLink className="h-3 w-3 text-cyan-400" />
        </a>
        <a
          href="https://moes.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#071322] border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-white transition-all flex items-center justify-between"
        >
          <span>moes.gov.in</span>
          <ExternalLink className="h-3 w-3 text-cyan-400" />
        </a>
        <a
          href="https://ncpor.res.in"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#071322] border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-white transition-all flex items-center justify-between"
        >
          <span>ncpor.res.in</span>
          <ExternalLink className="h-3 w-3 text-cyan-400" />
        </a>
        <a
          href="https://digitalindia.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-[#071322] border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-white transition-all flex items-center justify-between"
        >
          <span>digitalindia.gov.in</span>
          <ExternalLink className="h-3 w-3 text-cyan-400" />
        </a>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <div className="flex items-center space-x-2 text-slate-100 font-bold mb-2">
            <span className="text-amber-400 text-sm">🇮🇳</span>
            <span>INDIAN ANTARCTIC RESEARCH PROGRAMME</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences,
            Headland Sada, Vasco-da-Gama, Goa 403804, India.
          </p>
          <div className="mt-3 flex space-x-3 text-[11px] font-mono text-cyan-400">
            <a href="https://twitter.com/moesgoi" target="_blank" rel="noopener noreferrer" className="hover:underline">X: @moesgoi</a>
            <span>•</span>
            <a href="https://twitter.com/NCPOR_Goa" target="_blank" rel="noopener noreferrer" className="hover:underline">@NCPOR_Goa</a>
          </div>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold mb-2 flex items-center space-x-1.5">
            <Radio className="h-3.5 w-3.5 text-cyan-400" />
            <span>Active Research Stations</span>
          </h4>
          <ul className="space-y-1 text-[11px]">
            <li className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span><strong>Maitri Station</strong> (70°45′58″S, 11°43′56″E) • Queen Maud Land</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span><strong>Bharati Station</strong> (69°24′29″S, 76°11′14″E) • Larsemann Hills</span>
            </li>
            <li className="flex items-center space-x-2 text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
              <span>Dakshin Gangotri (Historical Site &amp; Supply Base)</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold mb-2 flex items-center space-x-1.5">
            <Database className="h-3.5 w-3.5 text-blue-400" />
            <span>GIGW 3.0 &amp; DBIM Compliance</span>
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Strict compliance with Guidelines for Indian Government Websites (GIGW 3.0),
            Digital Brand Identity Manual (DBIM), and WCAG 2.1 AAA Accessibility standards.
          </p>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold mb-2 flex items-center space-x-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>SIH 2026 Problem Statement SIH26060</span>
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Digital Twin Platform developed for the Ministry of Earth Sciences (MoES)
            under Smart India Hackathon 2026.
          </p>
        </div>
      </div>
    </footer>
  );
}
