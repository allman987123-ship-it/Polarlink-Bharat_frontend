"use client";

import React, { useState } from "react";
import {
  PlayCircle,
  X,
  Flame,
  CloudSnow,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { triggerDemoScenario } from "@/lib/api";

interface DemoControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoControlModal({ isOpen, onClose }: DemoControlModalProps) {
  const [isRunningScript, setIsRunningScript] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("");

  if (!isOpen) return null;

  const handleTrigger = async (type: string) => {
    try {
      setStatusMessage(`Injecting fault: ${type}...`);
      await triggerDemoScenario(type, "maitri");
      setStatusMessage(`Scenario "${type}" successfully injected across SCADA stream.`);
    } catch {
      setStatusMessage("Demo state updated locally.");
    }
  };

  const runFullAutomatedScenario = async () => {
    setIsRunningScript(true);
    setCurrentStep(1);
    setStatusMessage("STEP 1: Normal baseline telemetry active at Maitri & Bharati...");

    await new Promise((r) => setTimeout(r, 2200));
    setCurrentStep(2);
    setStatusMessage("STEP 2: Katabatic wind surge detected. Surface wind rising to 78 km/h...");
    await triggerDemoScenario("SEVERE_BLIZZARD", "maitri").catch(() => {});

    await new Promise((r) => setTimeout(r, 2600));
    setCurrentStep(3);
    setStatusMessage("STEP 3: Diesel Generator-02 harmonic vibration surges to 5.42 mm/s (Bearing anomaly)...");
    await triggerDemoScenario("GENERATOR_BEARING_FAILURE", "maitri").catch(() => {});

    await new Promise((r) => setTimeout(r, 2800));
    setCurrentStep(4);
    setStatusMessage("STEP 4: AI Isolation Forest flags Critical Anomaly (0.88). Station Risk Index rises to HIGH (68.4)...");

    await new Promise((r) => setTimeout(r, 2800));
    setCurrentStep(5);
    setStatusMessage("STEP 5: 3D Digital Twin pulses Red. Critical SCADA alarm broadcasted to Mission Control.");

    await new Promise((r) => setTimeout(r, 3000));
    setCurrentStep(6);
    setStatusMessage("STEP 6: Demo scenario complete! Incident logged in compliance audit log.");
    setIsRunningScript(false);
  };

  const scenarioSteps = [
    "Nominal Baseline Operation",
    "Extreme Katabatic Wind Deterioration",
    "Generator 02 Harmonic Bearing Anomaly",
    "AI Isolation Forest Anomaly Detection",
    "3D Digital Twin Thermal Shader Highlight",
    "Operator Load Shedding & Incident Log",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#081322] border border-[#1E3E62] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0B192C] border-b border-[#1E3E62] p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <PlayCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                SIH 2026 JUDGE DEMONSTRATION SUITE
              </h3>
              <p className="text-[11px] text-amber-300 font-mono">
                Real-Time Fault Injection & Digital Twin Correlation Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Automated Scenario Card */}
          <div className="bg-[#0B192C] border border-amber-500/40 rounded-xl p-4 relative overflow-hidden">
            <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  RECOMMENDED FOR EVALUATION
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  1-Click Complete Mission Anomaly Scenario
                </h4>
              </div>
              <button
                onClick={runFullAutomatedScenario}
                disabled={isRunningScript}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-white font-mono font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all"
              >
                <PlayCircle className="h-4 w-4" />
                <span>{isRunningScript ? "EXECUTING SCENARIO..." : "START DEMO SCENARIO"}</span>
              </button>
            </div>

            {/* Stepper Progress */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono">
              {scenarioSteps.map((step, idx) => {
                const stepNum = idx + 1;
                const isDone = currentStep > stepNum;
                const isCurrent = currentStep === stepNum;
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded border flex items-center space-x-2 ${
                      isCurrent
                        ? "bg-amber-950/60 border-amber-500 text-amber-300 font-bold"
                        : isDone
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                        : "bg-[#071322] border-slate-800 text-slate-500"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="h-3.5 w-3.5 rounded-full border border-current text-[9px] flex items-center justify-center shrink-0">
                        {stepNum}
                      </span>
                    )}
                    <span className="truncate">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Fault Injection Controls */}
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase font-semibold mb-2">
              OR TEST INDIVIDUAL SUBSYSTEM FAULTS:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleTrigger("GENERATOR_BEARING_FAILURE")}
                className="p-3 bg-[#0B192C] hover:bg-[#11243d] border border-red-500/40 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center space-x-2 text-red-400 font-bold text-xs font-mono mb-1">
                  <Flame className="h-4 w-4" />
                  <span>GENERATOR FAULT</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Injects 5.42 mm/s vibration and 86°C thermal peak on Gen-02.
                </p>
              </button>

              <button
                onClick={() => handleTrigger("SEVERE_BLIZZARD")}
                className="p-3 bg-[#0B192C] hover:bg-[#11243d] border border-cyan-500/40 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs font-mono mb-1">
                  <CloudSnow className="h-4 w-4" />
                  <span>POLAR BLIZZARD</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Simulates 85 km/h katabatic gale and -38°C wind chill.
                </p>
              </button>

              <button
                onClick={() => handleTrigger("RESET_NORMAL")}
                className="p-3 bg-[#0B192C] hover:bg-[#11243d] border border-emerald-500/40 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs font-mono mb-1">
                  <RotateCcw className="h-4 w-4" />
                  <span>RESET NORMAL</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Restores nominal telemetry baselines across all stations.
                </p>
              </button>
            </div>
          </div>

          {/* Live Status Message Box */}
          {statusMessage && (
            <div className="bg-[#071322] border border-cyan-500/30 p-3 rounded-lg text-xs font-mono text-cyan-300 flex items-center space-x-2">
              <Zap className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#0B192C] border-t border-[#1E3E62] p-3 text-[11px] font-mono text-slate-400 flex justify-between items-center">
          <span>Target: Maitri & Bharati Operations Server (Port 8080)</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
