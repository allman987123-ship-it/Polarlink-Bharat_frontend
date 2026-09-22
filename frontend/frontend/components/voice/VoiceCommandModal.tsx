"use client";

import React, { useState, useEffect } from "react";
import { X, Mic, MicOff, Volume2, Sparkles, CheckCircle2 } from "lucide-react";

interface VoiceCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceCommandModal({ isOpen, onClose }: VoiceCommandModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("Click start and speak a command...");

  if (!isOpen) return null;

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback("Listening to polar command...");
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processVoiceCommand(text);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setFeedback("Voice capture timed out. Try again.");
      };

      recognition.start();
    } else {
      // Mock simulation for browsers without Web Speech API
      setIsListening(true);
      setFeedback("Listening simulation...");
      setTimeout(() => {
        const mockCommands = [
          "Switch to Bharati Station",
          "Show power generation status",
          "Toggle Thermal SCADA mode",
          "Open CCTV camera feeds",
        ];
        const cmd = mockCommands[Math.floor(Math.random() * mockCommands.length)];
        setTranscript(cmd);
        processVoiceCommand(cmd);
        setIsListening(false);
      }, 2000);
    }
  };

  const processVoiceCommand = (cmd: string) => {
    const lower = cmd.toLowerCase();
    if (lower.includes("bharati")) {
      setFeedback("Executing: Switched mission focus to Bharati Station.");
    } else if (lower.includes("thermal")) {
      setFeedback("Executing: Activated Thermal SCADA gradient mapping.");
    } else if (lower.includes("power") || lower.includes("energy")) {
      setFeedback("Executing: Displaying Microgrid Power Matrix.");
    } else if (lower.includes("cctv")) {
      setFeedback("Executing: Engaging CCTV perimeter surveillance feeds.");
    } else {
      setFeedback(`Command "${cmd}" dispatched to SCADA speech parser.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#071322] border border-cyan-500/50 rounded-2xl shadow-2xl p-6 text-center space-y-4 font-mono">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-cyan-300 font-bold text-sm">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Voice SCADA Assistant</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-4 flex flex-col items-center">
          <div className="relative">
            {isListening && (
              <div className="absolute -inset-3 rounded-full border-2 border-cyan-400/40 animate-ping pointer-events-none" />
            )}
            <button
              onClick={toggleListening}
              className={`h-20 w-20 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/50 scale-110"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/40"
              }`}
            >
              {isListening ? <Mic className="h-8 w-8 animate-pulse" /> : <MicOff className="h-8 w-8" />}
            </button>
          </div>

          <div className="mt-4 text-xs font-bold text-white">
            {isListening ? "RECORDING SPEECH..." : "CLICK MICROPHONE TO SPEAK"}
          </div>

          {transcript && (
            <div className="mt-3 p-2.5 rounded-lg bg-[#040C1A] border border-slate-700 text-cyan-300 text-xs w-full">
              "{transcript}"
            </div>
          )}

          <div className="mt-3 text-xs text-slate-400">{feedback}</div>
        </div>

        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
          Try saying: "Switch to Bharati", "Thermal SCADA mode", or "Show Power"
        </div>
      </div>
    </div>
  );
}
