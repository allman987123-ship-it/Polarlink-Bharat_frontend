"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface StationData {
  id: "bharati" | "maitri";
  name: string;
  hindiName: string;
  location: string;
  region: string;
  coords: string;
  altitude: string;
  commissioned: string;
  description: string;
  outsideTemp: string;
  windChill: string;
  windSpeed: string;
  windDirection: string;
  satcomPing: string;
  satcomBandwidth: string;
  operationalHealth: number;
  crewCount: string;
  microgridKw: number;
  microgridLoadKw: number;
  bessSoc: number;
  gridFreq: number;
  waterStoredL: number;
  habTemp: number;
  co2Ppm: number;
  fuelDays: number;
  fuelStoredKl: number;
  fuelBurnL: number;
  rationsDays: number;
  ozoneDu: number;
  kpIndex: number;
  auroraProb: number;
  solarWindKm: number;
}

const BHARATI_DATA: StationData = {
  id: "bharati",
  name: "Bharati Antarctic Research Station",
  hindiName: "भारती अंटार्कटिक अनुसंधान स्टेशन",
  location: "Larsemann Hills, Princess Elizabeth Land",
  region: "East Antarctica",
  coords: `69°24'28"S, 76°11'14"E`,
  altitude: "35m MSL",
  commissioned: "2012",
  description: "134 ISO Modular Containers enclosed in Aerodynamic Faceted Cladding on 54 Steel Stilts",
  outsideTemp: "-28.4°C",
  windChill: "-45°C",
  windSpeed: "75.6 km/h",
  windDirection: "SSE",
  satcomPing: "634 ms",
  satcomBandwidth: "4896 kbps",
  operationalHealth: 98.6,
  crewCount: "24 / 24 Wintering",
  microgridKw: 120.4,
  microgridLoadKw: 98.1,
  bessSoc: 100,
  gridFreq: 50.0,
  waterStoredL: 12400,
  habTemp: 21.2,
  co2Ppm: 550,
  fuelDays: 339,
  fuelStoredKl: 148,
  fuelBurnL: 435,
  rationsDays: 405,
  ozoneDu: 278.4,
  kpIndex: 2.1,
  auroraProb: 24,
  solarWindKm: 385,
};

const MAITRI_DATA: StationData = {
  id: "maitri",
  name: "Maitri Antarctic Research Station",
  hindiName: "मैत्री अंटार्कटिक अनुसंधान स्टेशन",
  location: "Schirmacher Oasis, Queen Maud Land",
  region: "Central Dronning Maud Land",
  coords: `70°45'58"S, 11°43'56"E`,
  altitude: "117m MSL",
  commissioned: "1989",
  description: "Two-Tier Steel Girder & Thermal Composite Habitat on Stilt Piles with Lake Priyadarshini Lifeline",
  outsideTemp: "-19.2°C",
  windChill: "-38°C",
  windSpeed: "62.4 km/h",
  windDirection: "SE",
  satcomPing: "582 ms",
  satcomBandwidth: "4096 kbps",
  operationalHealth: 96.8,
  crewCount: "25 / 25 Wintering",
  microgridKw: 105.8,
  microgridLoadKw: 88.4,
  bessSoc: 98,
  gridFreq: 50.0,
  waterStoredL: 18500,
  habTemp: 20.8,
  co2Ppm: 580,
  fuelDays: 295,
  fuelStoredKl: 132,
  fuelBurnL: 460,
  rationsDays: 380,
  ozoneDu: 284.1,
  kpIndex: 2.4,
  auroraProb: 32,
  solarWindKm: 410,
};

interface StationContextType {
  station: "bharati" | "maitri";
  setStation: (station: "bharati" | "maitri") => void;
  stationData: StationData;
  simSpeed: 1 | 5 | 10;
  setSimSpeed: (speed: 1 | 5 | 10) => void;
  isCrisisSim: boolean;
  toggleCrisisSim: () => void;
  utcTime: string;
  istTime: string;
}

const StationContext = createContext<StationContextType | undefined>(undefined);

export function StationProvider({ children }: { children: React.ReactNode }) {
  const [station, setStation] = useState<"bharati" | "maitri">("bharati");
  const [simSpeed, setSimSpeed] = useState<1 | 5 | 10>(1);
  const [isCrisisSim, setIsCrisisSim] = useState(false);
  const [utcTime, setUtcTime] = useState<string>("12:49:56 UTC");
  const [istTime, setIstTime] = useState<string>("06:19:26 pm IST");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setUtcTime(now.toISOString().substring(11, 19) + " UTC");
      setIstTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }) + " IST"
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stationData = station === "bharati" ? BHARATI_DATA : MAITRI_DATA;

  const toggleCrisisSim = () => {
    setIsCrisisSim((prev) => !prev);
  };

  return (
    <StationContext.Provider
      value={{
        station,
        setStation,
        stationData,
        simSpeed,
        setSimSpeed,
        isCrisisSim,
        toggleCrisisSim,
        utcTime,
        istTime,
      }}
    >
      {children}
    </StationContext.Provider>
  );
}

export function useStation() {
  const context = useContext(StationContext);
  if (!context) {
    throw new Error("useStation must be used within a StationProvider");
  }
  return context;
}
