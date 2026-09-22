"use client";

import React, { useState } from "react";
import {
  Eye,
  Thermometer,
  Wind,
  Layers,
  Sun,
  Sunset,
  Moon,
  CloudSnow,
  RotateCcw,
  Zap,
  Droplets,
} from "lucide-react";
import { StationCanvas3D, VisualMode, LightingMode } from "@/components/digital-twin/StationCanvas3D";
import { AssetInspectorModal } from "@/components/digital-twin/AssetInspectorModal";
import { useStation } from "@/components/providers/StationContext";

export default function DigitalTwinPage() {
  const { station, stationData } = useStation();
  const [visualMode, setVisualMode] = useState<VisualMode>("REALISTIC");
  const [lightingMode, setLightingMode] = useState<LightingMode>("DAY");
  const [activeCameraPreset, setActiveCameraPreset] = useState<string>("Isometric");
  const [isRotating, setIsRotating] = useState(false);
  const [inspectedAsset, setInspectedAsset] = useState<any>(null);

  const cameraPresets = [
    { id: "Isometric", label: "Isometric" },
    { id: "Top SLS", label: "Top SLS" },
    { id: "Undercroft Stilts", label: "Undercroft Stilts" },
    { id: "Helipad Deck", label: "Helipad Deck" },
  ];

  const visualModes: { id: VisualMode; label: string; icon: any }[] = [
    { id: "REALISTIC", label: "Realistic", icon: Eye },
    { id: "THERMAL", label: "Thermal Heatmap", icon: Thermometer },
    { id: "WIND_STRESS", label: "Wind-Stress Strain", icon: Wind },
    { id: "EXPLODED", label: "Explode Tiers", icon: Layers },
  ];

  const lightingModes: { id: LightingMode; label: string; icon: any; color?: string }[] = [
    { id: "DAY", label: "DAY", icon: Sun, color: "text-amber-400" },
    { id: "TWILIGHT", label: "TWILIGHT", icon: Sunset, color: "text-orange-400" },
    { id: "NIGHT", label: "NIGHT", icon: Moon, color: "text-indigo-400" },
    { id: "BLIZZARD", label: "BLIZZARD", icon: CloudSnow, color: "text-sky-400" },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-125px)] min-h-[640px] rounded-2xl overflow-hidden border border-[#0F2F53] bg-[#020B14] shadow-2xl font-mono select-none">
      {/* 3D WebGL Canvas */}
      <div className="w-full h-full">
        <StationCanvas3D
          station={station}
          cameraPreset={activeCameraPreset}
          autoRotate={isRotating}
          lightingMode={lightingMode}
          visualMode={visualMode}
          hideInternalOverlay={true}
          onSelectAsset={setInspectedAsset}
        />
      </div>

      {/* OVERLAY 1: Top-Left Station Dossier Card */}
      <div className="absolute top-3.5 left-3.5 max-w-xs md:max-w-sm p-3.5 rounded-2xl bg-[#061527]/90 backdrop-blur-md border border-[#0F2F53] shadow-2xl space-y-1.5 z-20 pointer-events-auto">
        <div className="flex items-center space-x-1.5 text-[10px] font-bold">
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
            {station.toUpperCase()} STATION
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
            3D DIGITAL TWIN
          </span>
        </div>
        <h2 className="text-sm md:text-base font-black text-white font-sans">{stationData.name}</h2>
        <div className="text-[11px] text-cyan-300 font-semibold">
          {stationData.coords} • Altitude: {stationData.altitude}
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed pt-1 border-t border-[#0F2F53]/60">
          {stationData.description}
        </p>
      </div>

      {/* OVERLAY 2: Top-Right Unified View Modes & Lighting Strip */}
      <div className="absolute top-3.5 right-3.5 flex flex-col items-end space-y-2 z-20 pointer-events-auto">
        {/* Row 1: Visualizer Modes */}
        <div className="flex items-center space-x-1 p-1 rounded-2xl bg-[#040E1B]/90 backdrop-blur-md border border-[#0F2F53] shadow-2xl text-xs">
          {visualModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = visualMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setVisualMode(mode.id)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all text-xs ${
                  isActive
                    ? "bg-[#0A436C] border border-cyan-400 text-cyan-200 shadow-md shadow-cyan-900/50"
                    : "text-slate-400 hover:text-white border border-transparent hover:bg-slate-800/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Lighting Environment Selector */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-[#040E1B]/90 backdrop-blur-md border border-[#0F2F53] shadow-2xl text-[11px]">
          {lightingModes.map((light) => {
            const Icon = light.icon;
            const isActive = lightingMode === light.id;
            return (
              <button
                key={light.id}
                onClick={() => setLightingMode(light.id)}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 transition-all ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`h-3 w-3 ${isActive ? "text-slate-950" : light.color}`} />
                <span>{light.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* OVERLAY 3: Bottom-Left Camera Presets & Auto-Rotate Bar */}
      <div className="absolute bottom-3.5 left-3.5 flex items-center space-x-2 p-1.5 px-3 rounded-2xl bg-[#040E1B]/90 backdrop-blur-md border border-[#0F2F53] shadow-2xl z-20 pointer-events-auto text-xs">
        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">CAMERA:</span>
        <div className="flex items-center space-x-1">
          {cameraPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setActiveCameraPreset(preset.id)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                activeCameraPreset === preset.id
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center space-x-1 ${
              isRotating
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
            title="Auto-rotate station model"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{isRotating ? "Auto: ON" : "Auto"}</span>
          </button>
        </div>
      </div>

      {/* OVERLAY 4: Bottom-Right Telemetry Strip */}
      <div className="absolute bottom-3.5 right-3.5 flex items-center space-x-4 p-2 px-4 rounded-2xl bg-[#040E1B]/90 backdrop-blur-md border border-[#0F2F53] shadow-2xl z-20 pointer-events-auto text-xs">
        <div className="flex items-center space-x-1.5 text-cyan-300">
          <Wind className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-[10px] text-slate-400 uppercase">WIND LOAD:</span>
          <span className="font-bold text-white">{stationData.windSpeed}</span>
        </div>

        <div className="h-3 w-[1px] bg-slate-700" />

        <div className="flex items-center space-x-1.5 text-amber-300">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-[10px] text-slate-400 uppercase">MICROGRID:</span>
          <span className="font-bold text-white">{stationData.microgridKw} kW</span>
        </div>

        <div className="h-3 w-[1px] bg-slate-700" />

        <div className="flex items-center space-x-1.5 text-emerald-300">
          <Droplets className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-[10px] text-slate-400 uppercase">WATER LIFELINE:</span>
          <span className="font-bold text-white">{station === "bharati" ? "Sea RO Nominal" : "Lake Priyadarshini"}</span>
        </div>
      </div>

      {/* Asset Inspector SCADA Modal */}
      {inspectedAsset && (
        <AssetInspectorModal
          asset={inspectedAsset}
          onClose={() => setInspectedAsset(null)}
          onActionTrigger={(action, id) => {
            console.log(`SCADA Command triggered for ${id}: ${action}`);
          }}
        />
      )}
    </div>
  );
}
