"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import {
  Shield,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Sparkles,
  Layers,
  Terminal,
  Cpu,
  Fingerprint,
} from "lucide-react";
import { MeriPehchaanModal } from "./MeriPehchaanModal";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, login, lockoutSeconds } = useAuth();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [isSsoOpen, setIsSsoOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#030a16] flex flex-col items-center justify-center text-cyan-400 font-mono">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-transparent border-b-cyan-400 border-l-transparent animate-spin" />
          <div className="absolute inset-2 rounded-full bg-[#081528] flex items-center justify-center">
            <Shield className="h-6 w-6 text-cyan-400" />
          </div>
        </div>
        <div className="text-sm font-bold tracking-widest uppercase">INITIALIZING SECURITY SUBSYSTEMS...</div>
      </div>
    );
  }

  if (isAuthenticated && !successAnimation) {
    return <>{children}</>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!userId.trim()) {
      setErrorMsg("Please enter Station Commander ID");
      return;
    }
    if (!password.trim()) {
      setErrorMsg("Please enter Security Passcode");
      return;
    }

    setIsSubmitting(true);
    const res = await login(userId, password);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessAnimation(true);
      setTimeout(() => {
        setSuccessAnimation(false);
      }, 1200);
    } else {
      setErrorMsg(res.message || "Invalid authentication credentials");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030914] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* High-Tech Background Polar Matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-white to-emerald-500" />

      {/* Cyber radar circle background */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-sky-500/10 animate-pulse pointer-events-none" />
      <div className="absolute w-[900px] h-[900px] rounded-full border border-sky-500/5 pointer-events-none" />

      {/* Login Portal Card */}
      <div className="relative w-full max-w-lg bg-[#071322]/95 backdrop-blur-xl border border-[#1a3d68] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* National Emblem & Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-[#0b1d35] border border-cyan-500/40 shadow-inner overflow-hidden">
            <img src="/logo.webp" alt="PolarLink Antarctic Logo" className="w-14 h-14 rounded-xl object-cover" />
          </div>

          <div className="text-xs font-black tracking-widest text-slate-200 uppercase font-mono">
            GOVERNMENT OF INDIA • MINISTRY OF EARTH SCIENCES
          </div>
          <div className="text-[11px] font-bold text-sky-400 tracking-wider font-mono">
            NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH (NCPOR)
          </div>
          <h2 className="text-lg font-black text-white font-mono tracking-wide mt-1">
            MISSION OPERATIONS GATEWAY
          </h2>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold">
            <Shield className="h-3 w-3 text-cyan-400" />
            <span>LEVEL-4 RESTRICTED CLEARANCE REQUIRED</span>
          </div>
        </div>

        {/* Success Overlay Animation */}
        {successAnimation && (
          <div className="absolute inset-0 bg-[#071322]/98 rounded-3xl flex flex-col items-center justify-center p-6 text-center z-30 animate-in fade-in">
            <CheckCircle2 className="h-16 w-16 text-emerald-400 animate-bounce mb-3" />
            <h3 className="text-lg font-black text-white font-mono">CLEARANCE VERIFIED</h3>
            <p className="text-xs text-emerald-300 font-mono mt-1">Decryption Handshake Complete. Entering Mission Control...</p>
          </div>
        )}

        {/* Error / Lockout Banner */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/80 text-red-300 text-xs font-mono flex items-center space-x-2 animate-in fade-in">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {lockoutSeconds > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/80 border border-amber-500/80 text-amber-300 text-xs font-mono flex items-center justify-between animate-in fade-in">
            <span className="flex items-center space-x-1.5 font-bold">
              <Lock className="h-4 w-4 text-amber-400" />
              <span>TERMINAL SECURITY LOCKOUT</span>
            </span>
            <span className="text-sm font-black text-white px-2 py-0.5 rounded bg-amber-900 border border-amber-600">
              {lockoutSeconds}s
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5 flex items-center space-x-1.5">
              <User className="h-3.5 w-3.5 text-cyan-400" />
              <span>Station Commander ID</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter Station Commander ID"
                disabled={lockoutSeconds > 0 || isSubmitting}
                className="w-full bg-[#030914] border border-[#1E3E62] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
                autoComplete="off"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5 flex items-center space-x-1.5">
              <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
              <span>Security Passcode</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Security Passcode"
                disabled={lockoutSeconds > 0 || isSubmitting}
                className="w-full bg-[#030914] border border-[#1E3E62] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-4 pr-12 py-3 text-sm font-mono text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={lockoutSeconds > 0 || isSubmitting}
            className="w-full mt-2 bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-mono font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>VERIFYING CRYPTOGRAPHIC TOKEN...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-cyan-200 group-hover:scale-110 transition-transform" />
                <span>AUTHENTICATE TERMINAL ACCESS</span>
              </span>
            )}
          </button>
        </form>

        {/* MeriPehchaan NSSO Divider & Trigger */}
        <div className="mt-5 pt-4 border-t border-slate-800 space-y-3 text-center">
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] font-mono text-slate-400 uppercase">OR GOVERNMENT SINGLE SIGN-ON</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <button
            type="button"
            onClick={() => setIsSsoOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0b1c33] hover:bg-[#0f2747] border border-cyan-600/40 text-cyan-300 font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow"
          >
            <span className="text-sm">🇮🇳</span>
            <span>Sign In with MeriPehchaan (National SSO)</span>
          </button>
        </div>

        {/* Security Notice Footer */}
        <div className="mt-4 pt-3 border-t border-slate-900 text-center text-[10px] font-mono text-slate-500">
          SECURE ENCRYPTED CHANNEL • HMAC-SHA256 TOKEN VERIFIED • AUDIT LOGGED
        </div>
      </div>

      <MeriPehchaanModal isOpen={isSsoOpen} onClose={() => setIsSsoOpen(false)} />
    </div>
  );
}
