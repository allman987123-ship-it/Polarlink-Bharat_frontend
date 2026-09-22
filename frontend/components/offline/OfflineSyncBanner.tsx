"use client";

import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw, Database, CheckCircle2 } from "lucide-react";

export function OfflineSyncBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setPendingSyncCount((prev) => prev + 14);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const triggerManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setPendingSyncCount(0);
      setIsSyncing(false);
    }, 1800);
  };

  if (isOnline && pendingSyncCount === 0) {
    return null;
  }

  return (
    <div className="bg-[#0f1d30] border-b border-amber-500/50 px-4 py-2 text-xs font-mono text-amber-200 flex flex-wrap justify-between items-center gap-2">
      <div className="flex items-center space-x-2">
        {!isOnline ? (
          <>
            <WifiOff className="h-4 w-4 text-amber-400 animate-pulse" />
            <span className="font-bold text-amber-300">
              LOW-BANDWIDTH / OFFLINE SATCOM MODE ACTIVE
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">
              Local Station Edge Storage: <strong>Active (IndexedDB Cache)</strong>
            </span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="font-bold text-emerald-300">
              SATCOM CONNECTION RESTORED
            </span>
          </>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-slate-300">
          Pending Telemetry Records: <strong>{pendingSyncCount}</strong>
        </span>
        <button
          onClick={triggerManualSync}
          disabled={isSyncing}
          className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] flex items-center space-x-1.5"
        >
          <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? "SYNCING 1,284 / 1,284..." : "SYNC TO CENTRAL SERVER"}</span>
        </button>
      </div>
    </div>
  );
}
