"use client";

import React, { useState } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Globe,
  FileSpreadsheet,
  Download,
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "http://localhost:3000";
  const shareTitle = "Indian Antarctic Digital Twin — NCPOR Mission Operations Platform";
  const shareText = "Real-time 3D Digital Twin, Microgrid Energy & Polar SCADA telemetry for Maitri & Bharati Stations.";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        console.log("Share skipped", err);
      }
    } else {
      handleCopy();
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + currentUrl)}`,
      color: "bg-emerald-700 hover:bg-emerald-600",
    },
    {
      name: "X (Twitter)",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}&hashtags=NCPOR,MoES,DigitalIndia,Antarctica`,
      color: "bg-slate-800 hover:bg-slate-700",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      color: "bg-sky-800 hover:bg-sky-700",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#071322] border border-[#1e3e62] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0B192C] border-b border-[#1E3E62] p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Share2 className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono">Disseminate Government Resource</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 font-mono text-xs">
          {/* Quick Copy Link */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">DIRECT PORTAL URL</label>
            <div className="flex items-center space-x-2 bg-[#040C1A] border border-slate-700 rounded-lg p-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="bg-transparent text-slate-300 w-full outline-none text-[11px]"
              />
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-[10px] flex items-center space-x-1 shrink-0 transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "COPIED" : "COPY"}</span>
              </button>
            </div>
          </div>

          {/* Social Channels */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-2">OFFICIAL SOCIAL CHANNELS</label>
            <div className="grid grid-cols-3 gap-2">
              {shareLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg text-center text-white font-bold text-xs transition-colors ${s.color}`}
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {/* Native Device Share */}
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow flex items-center justify-center space-x-2"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Open Native Device Share Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
}
