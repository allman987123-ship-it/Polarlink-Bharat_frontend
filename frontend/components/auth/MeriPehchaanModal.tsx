"use client";

import React, { useState } from "react";
import {
  X,
  Shield,
  Fingerprint,
  Smartphone,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "./AuthContext";

interface MeriPehchaanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MeriPehchaanModal({ isOpen, onClose }: MeriPehchaanModalProps) {
  const { login } = useAuth();
  const [ssoMethod, setSsoMethod] = useState<"AADHAAR" | "JAN_PARICHAY" | "DIGILOCKER">("JAN_PARICHAY");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"INPUT" | "OTP" | "SUCCESS">("INPUT");
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep("OTP");
    }, 800);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(async () => {
      setIsVerifying(false);
      setStep("SUCCESS");
      // Authenticate in session
      await login("india", "1947");
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#071322] border border-[#1e3e62] rounded-3xl shadow-2xl overflow-hidden flex flex-col font-mono select-none">
        {/* Official Header */}
        <div className="bg-[#0B192C] border-b border-[#1E3E62] p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#081b33] border border-cyan-500/60 flex items-center justify-center text-amber-300 font-black text-sm">
              🇮🇳
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wider uppercase">MeriPehchaan (National SSO)</h3>
              <p className="text-[10px] text-cyan-400">National Single Sign-On • Govt of India</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {step === "INPUT" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Method Switcher */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#040C1A] rounded-xl border border-slate-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => setSsoMethod("JAN_PARICHAY")}
                  className={`py-1.5 rounded-lg transition-all font-bold ${
                    ssoMethod === "JAN_PARICHAY" ? "bg-cyan-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Jan Parichay
                </button>
                <button
                  type="button"
                  onClick={() => setSsoMethod("AADHAAR")}
                  className={`py-1.5 rounded-lg transition-all font-bold ${
                    ssoMethod === "AADHAAR" ? "bg-cyan-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Aadhaar OTP
                </button>
                <button
                  type="button"
                  onClick={() => setSsoMethod("DIGILOCKER")}
                  className={`py-1.5 rounded-lg transition-all font-bold ${
                    ssoMethod === "DIGILOCKER" ? "bg-cyan-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  DigiLocker
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">
                  {ssoMethod === "AADHAAR"
                    ? "12-Digit Aadhaar Number / VID"
                    : ssoMethod === "DIGILOCKER"
                    ? "DigiLocker Registered Mobile / Username"
                    : "Jan Parichay Official Username / Email"}
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    ssoMethod === "AADHAAR"
                      ? "XXXX XXXX XXXX"
                      : "commander.antarctic@gov.in"
                  }
                  className="w-full bg-[#030914] border border-[#1E3E62] focus:border-cyan-400 rounded-xl p-3 text-white text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-600 hover:from-blue-600 hover:to-cyan-500 text-white font-bold transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                {isVerifying ? <span>DISPATCHING OTP TO REGISTERED MOBILE...</span> : <span>PROCEED WITH MERIPEHCHAAN SSO</span>}
              </button>
            </form>
          )}

          {step === "OTP" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-sky-950/40 border border-sky-600/40 rounded-xl text-[11px] text-cyan-300">
                A 6-digit verification code has been dispatched to your linked Gov.in mobile terminal.
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">ENTER 6-DIGIT OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP (e.g. 112100)"
                  className="w-full bg-[#030914] border border-[#1E3E62] focus:border-cyan-400 rounded-xl p-3 text-center text-lg tracking-widest text-white font-bold outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                {isVerifying ? <span>VERIFYING NATIONAL IDENTITY...</span> : <span>VERIFY &amp; ACCESS STATION TWIN</span>}
              </button>
            </form>
          )}

          {step === "SUCCESS" && (
            <div className="text-center py-6 space-y-2 animate-in fade-in">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-sm font-bold text-white">MERIPEHCHAAN VERIFICATION SUCCESS</h4>
              <p className="text-[11px] text-emerald-300">Identity authenticated. Accessing Mission Operations...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0B192C] border-t border-slate-800 text-[9px] text-center text-slate-500">
          POWERED BY NATIONAL INFORMATICS CENTRE (NIC) • DIGITAL INDIA PROGRAMME
        </div>
      </div>
    </div>
  );
}
