"use client";

import React, { useState } from "react";
import {
  X,
  MessageSquare,
  Star,
  Send,
  CheckCircle2,
  Shield,
  HelpCircle,
  FileText,
  Building,
} from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [category, setCategory] = useState<"TECHNICAL" | "OPERATIONS" | "ENVIRONMENTAL" | "GENERAL">("TECHNICAL");
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `CPGRAMS-MOES-ANTARCTIC-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedId);
      setIsSubmitting(false);
    }, 800);
  };

  const handleReset = () => {
    setTicketId(null);
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#071322] border border-[#1e3e62] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0B192C] border-b border-[#1E3E62] p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono">User Feedback &amp; MoES Inquiry Desk</h3>
              <p className="text-[10px] text-slate-400 font-mono">GIGW 3.0 / CPGRAMS Integrated Public Assistance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs">
          {ticketId ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="h-14 w-14 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-white">Grievance / Feedback Registered</h4>
              <p className="text-slate-300 text-xs max-w-sm mx-auto leading-relaxed">
                Thank you for your valuable feedback. Your inquiry has been logged in the NCPOR Mission Control Desk.
              </p>
              <div className="p-3 bg-[#0B192C] border border-cyan-500/40 rounded-xl inline-block text-cyan-300 font-bold text-xs">
                Registration No: {ticketId}
              </div>
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all"
                >
                  Close Desk
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Picker */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5">INQUIRY / FEEDBACK CATEGORY</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "TECHNICAL", label: "SCADA & Telemetry" },
                    { id: "OPERATIONS", label: "Station Operations" },
                    { id: "ENVIRONMENTAL", label: "Antarctic Ecology" },
                    { id: "GENERAL", label: "Citizen Inquiry" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCategory(id as any)}
                      className={`p-2 rounded-lg border text-left transition-all text-[11px] ${
                        category === id
                          ? "bg-cyan-950 border-cyan-400 text-cyan-300 font-bold shadow-md shadow-cyan-900/30"
                          : "bg-[#0B192C] border-slate-700 text-slate-400 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">PLATFORM EXPERIENCE RATING</label>
                <div className="flex space-x-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`h-5 w-5 ${rating >= s ? "fill-amber-400" : "text-slate-600"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">OPERATOR / CITIZEN NAME</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#040C1A] border border-slate-700 focus:border-cyan-400 rounded-lg p-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">OFFICIAL EMAIL / CONTACT</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gov.in or email"
                    className="w-full bg-[#040C1A] border border-slate-700 focus:border-cyan-400 rounded-lg p-2 text-white outline-none"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">FEEDBACK / INQUIRY DETAILS</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your feedback, suggestion, or technical query regarding Indian Antarctic Stations..."
                  className="w-full bg-[#040C1A] border border-slate-700 focus:border-cyan-400 rounded-lg p-2 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>TRANSMITTING TO MoES DESK...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>SUBMIT OFFICIAL FEEDBACK</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
