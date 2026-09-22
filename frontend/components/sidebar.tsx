"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Map,
  LayoutDashboard,
  Zap,
  Droplets,
  Package,
  TrendingUp,
  Radio,
  ShieldAlert,
  Info,
} from "lucide-react";
import { useStation } from "./providers/StationContext";

export function Sidebar() {
  const pathname = usePathname();
  const { station } = useStation();

  const navItems = [
    {
      href: "/digital-twin",
      label: "3D Digital Twin",
      badge: "Interactive 3D",
      icon: Box,
    },
    {
      href: "/gis",
      label: "Antarctica Bases Map",
      badge: "Polar GIS",
      icon: Map,
    },
    {
      href: "/",
      label: "Station Overview",
      badge: null,
      icon: LayoutDashboard,
    },
    {
      href: "/energy",
      label: "Microgrid & CHP",
      badge: "Hybrid",
      icon: Zap,
    },
    {
      href: "/infrastructure",
      label: "Life Support & Infra",
      badge: station === "bharati" ? "Sea RO" : "Lake / Loss",
      icon: Droplets,
    },
    {
      href: "/logistics",
      label: "Logistics & Fleet GIS",
      badge: "Vessels",
      icon: Package,
    },
    {
      href: "/environment",
      label: "Polar Science & Climate",
      badge: "Ozone",
      icon: TrendingUp,
    },
    {
      href: "/data-sources",
      label: "SATCOM & Edge Sync",
      badge: null,
      icon: Radio,
    },
    {
      href: "/alerts",
      label: "Crisis Command & SOP",
      badge: "1",
      badgeAlert: true,
      icon: ShieldAlert,
    },
  ];

  return (
    <aside className="w-56 shrink-0 flex flex-col justify-between select-none py-2 pr-2 text-xs font-mono">
      <div className="space-y-3">
        {/* Section Header */}
        <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          DIGITAL TWIN SUBSYSTEMS
        </div>

        {/* Navigation Item List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl transition-all border ${
                  isActive
                    ? "bg-[#06263F] border-cyan-400/80 text-cyan-300 shadow-lg shadow-cyan-900/30"
                    : "bg-[#040E1B]/60 border-transparent hover:bg-[#07192F] hover:border-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span className={`text-[11px] truncate ${isActive ? "font-bold text-white" : "font-medium"}`}>
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 border ${
                      item.badgeAlert
                        ? "bg-red-500/20 text-red-400 border-red-500/50 animate-pulse"
                        : isActive
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                        : "bg-slate-800/80 text-slate-400 border-slate-700/60"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Expedition Metadata Card */}
      <div className="mt-4 p-3 rounded-2xl bg-[#040E1B] border border-[#0F2F53] space-y-2 text-[10px]">
        <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
          <Info className="h-3.5 w-3.5" />
          <span className="tracking-wider">EXPEDITION METADATA</span>
        </div>
        <div className="space-y-1 text-slate-400">
          <div className="flex justify-between">
            <span>ISEA Mission:</span>
            <span className="text-white font-semibold">44th Indian</span>
          </div>
          <div className="flex justify-between">
            <span>Control Mode:</span>
            <span className="text-cyan-300">Auto Remote Twin</span>
          </div>
          <div className="flex justify-between">
            <span>NCPOR HQ Link:</span>
            <span className="text-emerald-400">Goa Ground Hub</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
