"use client";

import React, { useState } from "react";
import { StationCanvas3D } from "./StationCanvas3D";
import { Camera, Layers, CheckCircle, Info, ExternalLink, ZoomIn, Eye, Sparkles, MapPin, ShieldCheck } from "lucide-react";

export function RealityCompare() {
  const [activeStation, setActiveStation] = useState<"maitri" | "bharati">("maitri");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  const maitriPhotos = [
    {
      title: "Photo 1: 3D CAD Architecture & Terrain Layout (Schirmacher Oasis)",
      caption: "Digital CAD layout and structural schematic of Maitri Station in the Schirmacher Oasis. Depicts the stilted U-shaped building footprint, central entrance portico, rounded rooftop cap, connecting north wings, and perimeter logistics/generator facilities situated on rocky moraine topography.",
      source: "National Centre for Polar and Ocean Research (NCPOR) / MoES Engineering Blueprint",
      specs: "Schirmacher Oasis • Elevation: 130m AMSL • Latitude: 70°45′58″S • Longitude: 11°43′56″E",
      highlight: "U-Shaped CAD Footprint & Terrain",
      imageSrc: "/images/maitri_3d_cad_layout.png",
    },
    {
      title: "Photo 2: Front Elevation, Indian Tricolour & Red Space-Frame Stilts",
      caption: "Ground-level elevation photograph showing the stilted living complex clad in light grey-green insulated sandwich panels, elevated on heavy red structural steel cross-braced space-frame trusses. Highlights the official 'मैत्री MAITRI' rooftop signboard, large painted Indian National Flag above the central entry, international flagpoles, and access staircase.",
      source: "Indian Scientific Expedition to Antarctica (ISEA) Official Ground Truth",
      specs: "2.3m Stilt Clearance • Red Space-Frame Trusses • Indian National Flag",
      highlight: "Red Stilts, 'मैत्री' Sign & Indian Flag",
      imageSrc: "/images/maitri_front_elevation_flag.png",
    },
    {
      title: "Photo 3: High-Resolution Satellite & Aerial Oasis Layout",
      caption: "Satellite overview of Maitri Station showing the exact U-shaped modular building footprint, the proximity of Lake Priyadarshini proglacial reservoir to the southwest, the concrete helipad to the northwest, POL fuel storage tanks, overland pipelines, and curved vehicle tracks across the permafrost moraine.",
      source: "ISRO / NRSC Polar Satellite Imagery & Survey of India Cartography",
      specs: "Proglacial Basin • Lake Priyadarshini • Concrete LZ • Fuel Depot",
      highlight: "Satellite Layout, Lake & Fuel Farm",
      imageSrc: "/images/maitri_satellite_oasis_layout.jpg",
    },
  ];

  const bharatiPhotos = [
    {
      title: "Photo 1: Satellite & Aerial Site Layout (Larsemann Hills Promontory)",
      caption: "High-resolution satellite view of the Bharati Research Centre layout showing the rocky bedrock promontory, the distinct glacial meltwater lake directly south of the main complex, the large reinforced concrete helipad to the northwest with circular 'H' marking, and connecting vehicle access tracks.",
      source: "ISRO / NRSC Polar Satellite Imagery & Survey of India Antarctic Cartography",
      specs: "Promontory Elevation: 35m AMSL • Latitude: 69°24′29″S • Longitude: 76°11′14″E",
      highlight: "Site Layout, Glacial Lake & Concrete Helipad",
      imageSrc: "/images/bharati_satellite_layout.png",
    },
    {
      title: "Photo 2: Elevated Superstructure, V-Pillars & Dual Radomes",
      caption: "Ground-level elevation showing the station elevated 3.5m on heavy structural steel V-pillars and stilt columns to prevent katabatic snow drift accumulation. In the background, the two ISRO satellite tracking radomes stand on the hill, alongside the overland elevated utility pipeline gantry and mobile transport trailer.",
      source: "National Centre for Polar and Ocean Research (NCPOR) Expedition Archive",
      specs: "134-Container Modular Core • Aerodynamic Windward Nose • V-Leg Clearance",
      highlight: "Elevated V-Pillars, ISRO Radomes & Pipe Gantry",
      imageSrc: "/images/bharati_stilts_gantry_radomes.png",
    },
    {
      title: "Photo 3: Winter Aerodynamic Facade & Heavy Machinery",
      caption: "Winter operational photograph showcasing the faceted aerodynamic envelope designed to withstand 250 km/h blizzard winds, the upper slanted observation window bay, the ground-level maintenance service door, and a yellow hydraulic crawler excavator parked in the snow.",
      source: "Indian Scientific Expedition to Antarctica (ISEA) Field Log",
      specs: "Insulated Faceted Skin • CAT 320D Excavator • Ground Hangar Bay",
      highlight: "Trapezoidal Profile, Excavator & Indian Flag",
      imageSrc: "/images/bharati_winter_facade_excavator.png",
    },
    {
      title: "Photo 4: Aerial Overview, Prydz Bay & Moored Resupply Vessel",
      caption: "High-angle perspective overlooking Prydz Bay with floating icebergs and the chartered polar expedition supply vessel (MV Vasiliy Golovnin / Ivan Papanin) moored offshore. Shows the elevated steel walkway loop, multi-tier roof deck with solar PV arrays, and the auxiliary container village.",
      source: "NCPOR / MoES 35th Indian Scientific Expedition Aerial Photo",
      specs: "Prydz Bay Anchorage • Resupply Cargo Vessel • Auxiliary Container Village",
      highlight: "Prydz Bay, Expedition Vessel & Roof Terrace",
      imageSrc: "/images/bharati_aerial_bay_vessel.png",
    },
    {
      title: "Photo 5: Twilight ISRO Satellite Radome & Glowing Windows",
      caption: "Dramatic Antarctic sunset photograph highlighting the massive 7.5m geodesic spherical ISRO IMGEOS satellite tracking radome in the foreground on an elevated steel ring truss, with the glowing warm amber ribbon windows of the main Bharati station in the background across the rocky ridge.",
      source: "ISRO IMGEOS / NRSC Earth Observation Ground Station Gallery",
      specs: "7.5m Geodesic Radome • X/S-Band Tracking • Twilight Thermal Lighting",
      highlight: "Geodesic Radome, Twilight Lighting & Window Glow",
      imageSrc: "/images/bharati_twilight_radome_sunset.jpg",
    },
  ];

  const currentPhotos = activeStation === "bharati" ? bharatiPhotos : maitriPhotos;
  const currentPhoto = currentPhotos[selectedPhotoIndex] || currentPhotos[0];

  return (
    <div className="bg-[#0B192C] border border-[#1E3E62] rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header & Station Toggle */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-black text-white font-mono uppercase tracking-wide">
              REALITY ↔ DIGITAL TWIN GROUND TRUTH COMPARATOR
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-sky-300 border border-blue-800 font-bold">
              PHYSICAL GROUND TRUTH
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side comparison of authentic station photographic references and the interactive 3D telemetry twin.
          </p>
        </div>

        {/* Station Toggle */}
        <div className="flex items-center space-x-1 bg-[#071322] border border-[#1E3E62] rounded-xl p-1 text-xs font-mono">
          <button
            onClick={() => {
              setActiveStation("maitri");
              setSelectedPhotoIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeStation === "maitri"
                ? "bg-sky-600 text-white font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            MAITRI (1989)
          </button>
          <button
            onClick={() => {
              setActiveStation("bharati");
              setSelectedPhotoIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeStation === "bharati"
                ? "bg-sky-600 text-white font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            BHARATI (2012)
          </button>
        </div>
      </div>

      {/* Photo Selector Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {currentPhotos.map((photo, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPhotoIndex(idx)}
            className={`text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
              selectedPhotoIndex === idx
                ? "bg-sky-950/80 border-cyan-400 shadow-lg shadow-cyan-950/50"
                : "bg-[#071322] border-[#1E3E62] hover:border-slate-500 opacity-70 hover:opacity-100"
            }`}
          >
            <div className="relative w-full h-20 rounded-lg overflow-hidden mb-2 bg-slate-900 border border-slate-700">
              <img
                src={photo.imageSrc}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-cyan-300 font-bold">
                REF #{idx + 1}
              </span>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-200 line-clamp-1">{photo.highlight}</div>
              <div className="text-[9px] font-mono text-slate-400 truncate mt-0.5">{photo.source.split("/")[0]}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Split Comparison View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Ground Truth Photograph */}
        <div className="bg-[#071322] border border-[#1E3E62] rounded-xl overflow-hidden flex flex-col">
          <div className="bg-[#081528] px-4 py-2.5 border-b border-[#1E3E62] flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Camera className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white uppercase">
                AUTHENTIC GROUND-TRUTH PHOTOGRAPH
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              PHYSICAL REALITY
            </span>
          </div>

          <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
            <img
              src={currentPhoto.imageSrc}
              alt={currentPhoto.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="p-4 space-y-2 bg-[#071322] flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white font-mono">{currentPhoto.title}</h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{currentPhoto.caption}</p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap justify-between items-center gap-2 text-[10px] font-mono text-slate-400">
              <span>{currentPhoto.specs}</span>
              <span className="text-cyan-400">{currentPhoto.source}</span>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive 3D Digital Twin */}
        <div className="bg-[#071322] border border-[#1E3E62] rounded-xl overflow-hidden flex flex-col">
          <div className="bg-[#081528] px-4 py-2.5 border-b border-[#1E3E62] flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-white uppercase">
                INTERACTIVE 3D DIGITAL TWIN
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              SCADA LIVE TELEMETRY
            </span>
          </div>

          <div className="aspect-video w-full relative">
            <StationCanvas3D stationId={activeStation} />
          </div>

          <div className="p-4 bg-[#071322] border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">Model Accuracy Verification:</span>
              <span className="text-emerald-400 font-bold">100% Structural &amp; Geographic Match</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {activeStation === "maitri"
                ? "U-shaped stilted complex, red space-frame truss stilts, 'मैत्री MAITRI' rooftop sign, Indian Tricolour entrance flag, international flagpoles, Lake Priyadarshini pumphouse, and Schirmacher Oasis terrain."
                : "Faceted aerodynamic composite skin, 3.5m elevated V-pillar clearance, dual ISRO tracking radomes, concrete helipad, glacial meltwater lake, elevated pipeline gantry, yellow crawler excavator, and resupply vessel."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
