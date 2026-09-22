"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageContext";
import {
  Globe,
  Sun,
  Eye,
  MessageSquare,
  Share2,
  Mic,
  ExternalLink,
  ChevronDown,
  Volume2,
} from "lucide-react";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { ShareModal } from "@/components/sharing/ShareModal";
import { VoiceCommandModal } from "@/components/voice/VoiceCommandModal";

export function GovAccessibilityBar() {
  const { language, setLanguage, t, highContrast, setHighContrast, textScale, setTextScale } =
    useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const langNames: { [key: string]: string } = {
    en: "English",
    hi: "हिन्दी (Hindi)",
    mr: "मराठी (Marathi)",
    ta: "தமிழ் (Tamil)",
    bn: "বাংলা (Bengali)",
    gu: "ગુજરાતી (Gujarati)",
  };

  return (
    <>
      <div className="bg-[#030811] text-slate-300 text-[11px] font-mono border-b border-[#0f233d] px-4 py-1 flex flex-wrap justify-between items-center gap-2 select-none z-40 relative">
        {/* Left: Skip to content & Government Links */}
        <div className="flex items-center space-x-3">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:bg-amber-500 focus:text-black focus:px-2 focus:py-0.5 focus:rounded text-xs font-bold"
          >
            {t.skipToContent}
          </a>

          {/* National Portal & MyGov Links */}
          <div className="hidden sm:flex items-center space-x-2.5 text-[10px] text-slate-400">
            <a
              href="https://www.india.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 flex items-center space-x-0.5 transition-colors"
            >
              <span>india.gov.in</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="https://www.mygov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 flex items-center space-x-0.5 transition-colors"
            >
              <span>mygov.in</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="https://moes.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 flex items-center space-x-0.5 transition-colors"
            >
              <span>moes.gov.in</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>

        {/* Right: GIGW 3.0 Accessibility Controls */}
        <div className="flex items-center space-x-3">
          {/* Text Size Adjuster (A-, A, A+) */}
          <div className="flex items-center space-x-1 border-r border-slate-800 pr-2.5">
            <span className="text-[10px] text-slate-500 hidden md:inline mr-1">{t.textSize}:</span>
            <button
              onClick={() => setTextScale("normal")}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                textScale === "normal" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Normal Text Size"
            >
              A-
            </button>
            <button
              onClick={() => setTextScale("large")}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                textScale === "large" ? "bg-cyan-700 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Large Text Size"
            >
              A
            </button>
            <button
              onClick={() => setTextScale("xlarge")}
              className={`px-1.5 py-0.5 rounded text-[12px] font-bold ${
                textScale === "xlarge" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Extra Large Text Size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Mode Toggle */}
          <button
            onClick={() => setHighContrast((prev) => !prev)}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded border transition-colors ${
              highContrast
                ? "bg-amber-400 text-black border-amber-300 font-bold"
                : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white"
            }`}
            title="Toggle High Contrast (GIGW 3.0 Standard)"
          >
            <Eye className="h-3 w-3" />
            <span className="text-[10px] hidden sm:inline">{t.highContrast}</span>
          </button>

          {/* Voice Command Button */}
          <button
            onClick={() => setIsVoiceOpen(true)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Voice SCADA Commands"
          >
            <Mic className="h-3 w-3 text-cyan-400" />
            <span className="text-[10px] hidden md:inline">{t.voiceCommand}</span>
          </button>

          {/* Share Modal Trigger */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Share Mission Portal"
          >
            <Share2 className="h-3 w-3 text-sky-400" />
            <span className="text-[10px] hidden sm:inline">{t.share}</span>
          </button>

          {/* User Feedback & Inquiries Trigger */}
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="User Feedback & Inquiries"
          >
            <MessageSquare className="h-3 w-3 text-emerald-400" />
            <span className="text-[10px] hidden sm:inline">{t.feedback}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-1 px-2.5 py-0.5 rounded bg-[#0b1b30] border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-950 transition-colors"
            >
              <Globe className="h-3 w-3" />
              <span>{langNames[language] || "English"}</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-[#081528] border border-[#1e3e62] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in">
                {Object.entries(langNames).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setLanguage(code as any);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-cyan-950 hover:text-cyan-300 transition-colors flex items-center justify-between ${
                      language === code ? "text-cyan-300 font-bold bg-cyan-950/60" : "text-slate-300"
                    }`}
                  >
                    <span>{name}</span>
                    {language === code && <span className="text-cyan-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popups & Modals */}
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <VoiceCommandModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </>
  );
}
