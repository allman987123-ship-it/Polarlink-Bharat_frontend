"use client";

import React, { useEffect, useState } from "react";
import {
  Video,
  ShieldCheck,
  Eye,
  RefreshCw,
  Lock,
  Maximize2,
  Camera,
  Layers,
  Sparkles,
  Sun,
  Flame,
  ZoomIn,
  Move,
  Scan,
  Compass,
} from "lucide-react";
import { getCctvStreams } from "@/lib/api";

export default function CctvPage() {
  const [cameras, setCameras] = useState<any[]>([]);
  const [thermalMode, setThermalMode] = useState<boolean>(false);
  const [aiDetectionEnabled, setAiDetectionEnabled] = useState<boolean>(true);

  useEffect(() => {
    getCctvStreams()
      .then(setCameras)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="glass-panel rounded-2xl p-5 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white font-mono uppercase tracking-wider flex items-center space-x-2.5">
            <Video className="h-6 w-6 text-cyan-400" />
            <span>SECURE POLAR CCTV &amp; COMPUTER VISION GATEWAY</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            4-Channel low-bitrate polar surveillance grid protected by Government Role-Based Access Control (RBAC).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Thermal Vision Toggle */}
          <button
            onClick={() => setThermalMode(!thermalMode)}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 ${
              thermalMode
                ? "bg-rose-950/80 border-rose-500 text-rose-300 font-bold shadow-lg shadow-rose-500/20"
                : "bg-[#050D1A] border-slate-700 text-slate-400 hover:text-white"
            }`}
          >
            <Flame className="h-4 w-4 text-rose-400" />
            <span>THERMAL IR: {thermalMode ? "ON" : "OFF"}</span>
          </button>

          {/* AI Vision Overlay Toggle */}
          <button
            onClick={() => setAiDetectionEnabled(!aiDetectionEnabled)}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 ${
              aiDetectionEnabled
                ? "bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold shadow-lg shadow-cyan-500/20"
                : "bg-[#050D1A] border-slate-700 text-slate-400 hover:text-white"
            }`}
          >
            <Scan className="h-4 w-4 text-cyan-400" />
            <span>AI DETECTION: {aiDetectionEnabled ? "ON" : "OFF"}</span>
          </button>

          <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 font-bold">
            ● 4 / 4 CHANNELS ONLINE
          </span>
        </div>
      </div>

      {/* 4-Camera Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cameras.map((cam, idx) => {
          const aiLabels: { [key: number]: { label: string; conf: string; top: string; left: string }[] } = {
            0: [{ label: "PERSONNEL (CREW)", conf: "98.4%", top: "42%", left: "35%" }],
            1: [{ label: "CAT 320D EXCAVATOR", conf: "99.1%", top: "48%", left: "55%" }],
            2: [{ label: "ISRO IMGEOS RADOME", conf: "99.8%", top: "30%", left: "45%" }],
            3: [{ label: "BULK POL JET A-1 TANKS", conf: "97.6%", top: "50%", left: "60%" }],
          };

          const detections = aiLabels[idx] || [];

          return (
            <div
              key={cam.id}
              className="glass-panel glass-panel-hover rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              {/* Camera Header Strip */}
              <div className="bg-[#050D1A]/95 px-5 py-3 border-b border-slate-800 flex justify-between items-center text-xs font-mono">
                <div className="flex items-center space-x-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-white uppercase tracking-wide">{cam.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400">FPS: {cam.fps}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                    {cam.status}
                  </span>
                </div>
              </div>

              {/* Video Viewport / Simulated Polar Feed */}
              <div
                className={`relative w-full h-[280px] flex items-center justify-center overflow-hidden group transition-all ${
                  thermalMode
                    ? "bg-gradient-to-b from-purple-950 via-rose-950 to-amber-950"
                    : "bg-[#030914]"
                }`}
              >
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-16 w-full animate-scan-line pointer-events-none" />

                {/* Simulated Polar Live Frame Visual */}
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <Camera
                    className={`h-12 w-12 mb-2 transition-transform group-hover:scale-110 ${
                      thermalMode ? "text-rose-400 animate-pulse" : "text-cyan-400/80"
                    }`}
                  />
                  <div
                    className={`text-sm font-bold font-mono ${
                      thermalMode ? "text-amber-300" : "text-cyan-300"
                    }`}
                  >
                    {cam.location}
                  </div>
                  <p className="text-xs text-slate-400 max-w-xs mt-1 font-mono">{cam.description}</p>
                </div>

                {/* AI Bounding Boxes */}
                {aiDetectionEnabled &&
                  detections.map((det, i) => (
                    <div
                      key={i}
                      style={{ top: det.top, left: det.left }}
                      className="absolute border-2 border-cyan-400 bg-cyan-500/15 p-2 rounded pointer-events-none animate-in fade-in"
                    >
                      <div className="text-[9px] font-mono font-black text-cyan-300 bg-slate-950/90 px-1 py-0.5 rounded border border-cyan-400/60 inline-block shadow">
                        {det.label} • {det.conf}
                      </div>
                    </div>
                  ))}

                {/* Live HUD Overlay on Video */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-400 border border-emerald-800 flex items-center space-x-1.5 shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  <span>REC ● {cam.resolution}</span>
                </div>

                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-300 border border-slate-800">
                  PTZ: 180° / 0° (ZOOM 1.0x)
                </div>

                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-cyan-300 border border-slate-800">
                  {cam.last_frame_timestamp}
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="p-3.5 bg-[#050D1A]/95 border-t border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-bold">{cam.stream_type}</span>
                  <span>•</span>
                  <span>Bandwidth: 140 kbps</span>
                </div>
                <div className="flex items-center space-x-2 text-cyan-300">
                  <button
                    onClick={() => alert(`PTZ calibrated for ${cam.name}`)}
                    className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
                    title="Pan/Tilt/Zoom Controls"
                  >
                    <Move className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => alert(`Snapshot captured for ${cam.name}`)}
                    className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
                    title="Screen Capture"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => alert(`Fullscreen viewing for ${cam.name}`)}
                    className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
                    title="Fullscreen"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
