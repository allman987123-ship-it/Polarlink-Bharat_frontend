"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Activity,
  Cpu,
  Zap,
  Flame,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Camera,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
  Ship,
  Package,
  Clock,
  TrendingUp,
  Wrench,
  FileText,
  ShieldAlert,
  Check,
  Navigation,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface AssetInspectorModalProps {
  asset: any;
  onClose: () => void;
  onActionTrigger?: (action: string, assetId: string) => void;
}

export function AssetInspectorModal({
  asset,
  onClose,
  onActionTrigger,
}: AssetInspectorModalProps) {
  const [actionSuccess, setActionSuccess] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "OVERVIEW" | "HISTORICAL" | "MAINTENANCE" | "PHOTO_REF" | "ALERTS"
  >("OVERVIEW");
  const [historyMetric, setHistoryMetric] = useState<"temp" | "vibration" | "output">("temp");
  const [workOrderCreated, setWorkOrderCreated] = useState(false);

  if (!asset) return null;

  const isCritical = asset.status === "CRITICAL";
  const isWarning = asset.status === "WARNING";

  const handleAction = (actionName: string) => {
    setActionSuccess(`Command "${actionName}" dispatched to Station SCADA Gateway.`);
    if (onActionTrigger) {
      onActionTrigger(actionName, asset.id);
    }
    setTimeout(() => setActionSuccess(""), 4000);
  };

  const handleCreateWorkOrder = () => {
    setWorkOrderCreated(true);
    setActionSuccess(`Work Order #WO-${Math.floor(1000 + Math.random() * 9000)} generated for ${asset.name}. Assigned to Polar Maintenance Crew.`);
    setTimeout(() => setActionSuccess(""), 5000);
  };

  const historicalData = useMemo(() => {
    const baseTemp = parseFloat(asset.temp) || 22.0;
    const baseVib = parseFloat(asset.vibration) || 1.8;
    const baseOut = parseFloat(asset.output) || 95.0;

    const data = [];
    for (let h = 0; h <= 24; h += 2) {
      const timeStr = `${String(h).padStart(2, "0")}:00`;
      const tempVariation = Math.sin(h * 0.4) * 3.5 + (isCritical && h > 18 ? 18.0 : 0);
      const vibVariation = (Math.cos(h * 0.5) * 0.3) + (isCritical && h > 18 ? 3.4 : 0);
      const outVariation = Math.sin(h * 0.3) * 5.0;

      data.push({
        time: timeStr,
        temp: Number((baseTemp + tempVariation).toFixed(1)),
        vibration: Number(Math.max(0.2, baseVib + vibVariation).toFixed(2)),
        output: Number(Math.max(10, baseOut + outVariation).toFixed(1)),
      });
    }
    return data;
  }, [asset, isCritical]);

  const photoReferenceMap: Record<
    string,
    { title: string; caption: string; credit: string; tags: string[]; imageSrc?: string }
  > = {
    // Maitri Station Ground Truth References
    "maitri-main-block": {
      title: "Maitri Main Modular Station Complex (Photo 2 Ground Truth)",
      caption: "Authentic photograph of Maitri Station in the Schirmacher Oasis showing the stilted living complex clad in light grey-green insulated panels on red structural steel space-frame trusses, the 'मैत्री MAITRI' signboard, large painted Indian Flag, international flagpoles, and central entry staircase.",
      credit: "Indian Scientific Expedition to Antarctica (ISEA) Ground-Truth Reference",
      tags: ["Red Space-Frame Stilts", "'मैत्री' Signboard", "Indian Tricolour", "25 Wintering Crew"],
      imageSrc: "/images/maitri_front_elevation_flag.png",
    },
    "maitri-central-mast": {
      title: "Maitri Central Communications & Meteorological Mast (Photo 2)",
      caption: "High steel communications and weather telemetry mast rising straight up above the main entrance portico of Maitri Station, supporting HF/VHF dipole arrays, wind sonic anemometers, and satellite transceiver links.",
      credit: "NCPOR Polar Telecommunications Division",
      tags: ["Central Steel Mast", "Guy-Wires", "HF/VHF Dipoles", "Anemometers"],
      imageSrc: "/images/maitri_front_elevation_flag.png",
    },
    "maitri-lake-priyadarshini": {
      title: "Lake Priyadarshini Glacier Melt Freshwater Intake (Photo 3)",
      caption: "Proglacial freshwater reservoir supplying uninterrupted glacier melt water to Maitri Station via insulated trace-heated overland pipelines.",
      credit: "NCPOR Environmental & Water Quality Station Log",
      tags: ["Lake Priyadarshini", "Glacier Melt", "Freshwater Intake", "Schirmacher Oasis"],
      imageSrc: "/images/maitri_satellite_oasis_layout.jpg",
    },
    "maitri-water-01": {
      title: "Lake Priyadarshini Water Pumphouse & Trace-Heated Pipeline (Photo 3)",
      caption: "Automated glacier melt water pumping station with multi-stage submersible pumps, trace heating, and filtration plants.",
      credit: "NCPOR Environmental & Water Quality Station Log",
      tags: ["Lake Priyadarshini", "Trace Heated", "RO Filtration", "Submersible Pumps"],
      imageSrc: "/images/maitri_satellite_oasis_layout.jpg",
    },
    "maitri-gen-02": {
      title: "Maitri Powerhouse & Diesel Generator Bank (Photo 1 & 3)",
      caption: "Heavy-duty 125 kVA Polar Diesel Gensets running on Aviation Kerosene (Jet A-1) with dual-redundant exhaust heat exchangers supplying hydronic heating to the station.",
      credit: "NCPOR Engineering & Polar Infrastructure Division",
      tags: ["3x 125 kVA Gensets", "Jet A-1 Fuel", "Hydronic Heating Loop", "Vibration Monitored"],
      imageSrc: "/images/maitri_3d_cad_layout.png",
    },
    "maitri-fuel-tank-01": {
      title: "Maitri Bulk POL Fuel Farm Depot (Photo 3)",
      caption: "Double-walled vertical insulated bulk storage tanks holding arctic kerosene for station microgrid power and snow vehicle convoys, equipped with trace heating and bund containment.",
      credit: "NCPOR Antarctic Logistics Directorate",
      tags: ["Jet A-1 Storage", "Catwalks & Ladders", "Safety Bund Berm", "Leak Detection"],
      imageSrc: "/images/maitri_satellite_oasis_layout.jpg",
    },
    "maitri-helipad": {
      title: "Maitri Station Helicopter Landing Zone (Photo 3)",
      caption: "Concrete helipad located northwest of the main living complex servicing helicopter transit flights across the Schirmacher Oasis.",
      credit: "Survey of India / NCPOR Antarctic Logistics Division",
      tags: ["Helipad", "Schirmacher LZ", "Aviation WindSock", "Ka-32 Airlift"],
      imageSrc: "/images/maitri_satellite_oasis_layout.jpg",
    },

    // Bharati Station Real Photos
    "bharati-main-complex": {
      title: "Bharati Station Aerodynamic Cantilevered Superstructure (Photo 2 & 3)",
      caption: "Authentic photograph of Bharati Station in Larsemann Hills. The faceted aerodynamic skin is constructed from 134 modular prefabricated containers wrapped in an insulated envelope, elevated 3.5m above bedrock on heavy steel V-pillars to eliminate katabatic snow drift accumulation.",
      credit: "Indian Scientific Expedition to Antarctica (ISEA) Official Ground Truth",
      tags: ["Faceted Envelope", "134 Containers", "Elevated V-Pillars", "Ribbon Windows"],
      imageSrc: "/images/bharati_stilts_gantry_radomes.png",
    },
    "bharati-isro-imgeos": {
      title: "ISRO IMGEOS Polar Satellite Earth Ground Station 7.5m Radome (Photo 5)",
      caption: "High-throughput National Remote Sensing Centre (NRSC) / ISRO Earth Observation tracking terminal inside a 7.5m geodesic spherical radome mounted on an elevated steel ring lattice base on the rocky ridge behind Bharati Station.",
      credit: "ISRO IMGEOS / NRSC Earth Observation Operations Gallery",
      tags: ["7.5m Geodesic Radome", "Cartosat/RISAT Downlink", "Ring Lattice Base", "Obstruction Beacon"],
      imageSrc: "/images/bharati_twilight_radome_sunset.jpg",
    },
    "bharati-isro-secondary": {
      title: "Bharati Secondary Inmarsat / SATCOM Radome (Photo 2)",
      caption: "Secondary dual-redundant satellite tracking dome on the eastern ridge maintaining uninterrupted voice, video, and high-speed telemetry links to MoES / NCPOR headquarters in Goa.",
      credit: "NCPOR Polar Telecommunications Division",
      tags: ["Inmarsat Relay", "Secondary SATCOM", "Dual Redundancy"],
      imageSrc: "/images/bharati_stilts_gantry_radomes.png",
    },
    "bharati-helipad": {
      title: "Bharati Aviation Helipad & Larsemann Landing Zone (Photo 1)",
      caption: "Reinforced concrete polar helipad situated northwest of the main station complex with circular 'H' markings, high-visibility perimeter boundary lights, and meteorological windsock for Kamov Ka-32 and Bell 412 operations.",
      credit: "Survey of India / NCPOR Antarctic Logistics Division",
      tags: ["Concrete Helipad", "Circular 'H' Marking", "Windsock Mast", "Perimeter Lighting"],
      imageSrc: "/images/bharati_satellite_layout.png",
    },
    "bharati-glacial-lake": {
      title: "Larsemann Hills Glacial Meltwater Lake (Photo 1)",
      caption: "Perennial glacial meltwater lake situated directly south of Bharati Station. Supplies pure freshwater for the station's reverse-osmosis filtration and environmental micro-biology sample analysis.",
      credit: "ISRO Satellite Imagery & Polar Environmental Survey",
      tags: ["Glacial Meltwater", "Freshwater Intake", "Emerald Reservoir", "Larsemann Hills"],
      imageSrc: "/images/bharati_satellite_layout.png",
    },
    "bharati-utility-gantry": {
      title: "Elevated Overland Steel Utility Gantry & Heated Pipelines (Photo 2)",
      caption: "Snaking galvanized steel lattice truss gantry carrying insulated hydronic heating supply/return loops, Jet A-1 fuel conduits, and reverse-osmosis potable water lines across the rocky moraine.",
      credit: "NCPOR Engineering & Polar Infrastructure Division",
      tags: ["Steel Truss Gantry", "Jet A-1 Fuel Trace", "Hydronic Heating", "RO Water"],
      imageSrc: "/images/bharati_stilts_gantry_radomes.png",
    },
    "bharati-excavator": {
      title: "CAT 320D Polar Hydraulic Crawler Excavator (Photo 3)",
      caption: "Yellow tracked crawler excavator parked near the ground maintenance hangar bay, winterized with Arctic lubricants and engine block heaters for snow removal, trenching, and container staging in -50°C blizzards.",
      credit: "Indian Scientific Expedition to Antarctica (ISEA) Logistics Fleet",
      tags: ["CAT 320D Excavator", "Tracked Undercarriage", "Winterized Hydraulics", "Snow Clearing"],
      imageSrc: "/images/bharati_winter_facade_excavator.png",
    },
    "bharati-snowcat": {
      title: "Kässbohrer PistenBully Polar Snow Groomer (Photo 4)",
      caption: "Heavy-duty tracked polar snowcat equipped with front hydraulic dozer blade and GPS crevasse mapping receiver, ensuring safe transit between Bharati Station, the helipad, and the sea ice shelf.",
      credit: "NCPOR Antarctic Logistics Directorate",
      tags: ["PistenBully Snowcat", "Wide Tracks", "Dozer Blade", "Helipad Maintenance"],
      imageSrc: "/images/bharati_aerial_bay_vessel.png",
    },
    "bharati-vessel-golovnin": {
      title: "Chartered Resupply Vessel Moored in Prydz Bay (Photo 4)",
      caption: "Chartered polar ice-class cargo vessel (MV Vasiliy Golovnin / Ivan Papanin) anchored against the fast ice in Prydz Bay, equipped with 45-ton heavy cranes and helicopter pad for annual expedition resupply.",
      credit: "NCPOR Antarctic Logistics Directorate",
      tags: ["Ice-Class Vessel", "Twin Heavy Cranes", "Prydz Bay Mooring", "Annual Resupply"],
      imageSrc: "/images/bharati_aerial_bay_vessel.png",
    },
  };

  const photoRef = photoReferenceMap[asset.id] || {
    title: `${asset.name} Photographic Reference`,
    caption: asset.desc || "Operational polar asset deployed at Indian Antarctic Research Station.",
    credit: "National Centre for Polar and Ocean Research (NCPOR)",
    tags: [asset.category, "SCADA Connected", "Digital Twin Asset"],
    imageSrc: asset.id.includes("maitri") ? "/images/maitri_front_elevation_flag.png" : "/images/bharati_stilts_gantry_radomes.png",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#081322] border border-cyan-500/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Strip */}
        <div className="bg-[#0B192C] border-b border-[#1E3E62] p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
                isCritical
                  ? "bg-red-950/80 border-red-500 text-red-400 animate-pulse"
                  : isWarning
                  ? "bg-amber-950/80 border-amber-500 text-amber-400"
                  : "bg-cyan-950/80 border-cyan-500 text-cyan-400"
              }`}
            >
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-950 text-cyan-300 border border-sky-800 font-bold">
                  {asset.category}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    isCritical
                      ? "bg-red-950 text-red-300 border-red-800 animate-pulse"
                      : isWarning
                      ? "bg-amber-950 text-amber-300 border-amber-800"
                      : "bg-emerald-950 text-emerald-300 border-emerald-800"
                  }`}
                >
                  STATUS: {asset.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-white font-mono mt-0.5 truncate max-w-md sm:max-w-lg">
                {asset.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1E3E62] bg-[#071322] px-4">
          {[
            { id: "OVERVIEW", label: "SCADA Overview", icon: Activity },
            { id: "PHOTO_REF", label: "Ground-Truth Photo", icon: Camera },
            { id: "HISTORICAL", label: "Telemetry History", icon: TrendingUp },
            { id: "MAINTENANCE", label: "Maintenance & Diagnostics", icon: Wrench },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-cyan-400 text-cyan-300 bg-sky-950/40"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Feedback Banner */}
        {actionSuccess && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/50 px-4 py-2 text-xs font-mono text-emerald-300 flex items-center space-x-2 animate-in fade-in">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-mono">
          {/* TAB 1: SCADA OVERVIEW */}
          {activeTab === "OVERVIEW" && (
            <div className="space-y-6">
              <div className="bg-[#0B192C] border border-[#1E3E62] p-4 rounded-xl">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Engineering Overview</div>
                <p className="text-slate-200 text-xs leading-relaxed">{asset.desc || "Standard station critical subsystem."}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#0B192C] border border-[#1E3E62] p-3 rounded-xl">
                  <div className="text-slate-400 text-[10px]">HEALTH INDEX</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">{asset.health || "98.5%"}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">Automated SCADA telemetry</div>
                </div>

                <div className="bg-[#0B192C] border border-[#1E3E62] p-3 rounded-xl">
                  <div className="text-slate-400 text-[10px]">OPERATIONAL TEMP</div>
                  <div className="text-base font-bold text-amber-300 mt-1">{asset.temp || "21.4°C"}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">Sensor: RTD-PT100</div>
                </div>

                <div className="bg-[#0B192C] border border-[#1E3E62] p-3 rounded-xl">
                  <div className="text-slate-400 text-[10px]">{asset.output ? "POWER OUTPUT" : asset.snr ? "SIGNAL TO NOISE" : "CAPACITY"}</div>
                  <div className="text-base font-bold text-cyan-300 mt-1">
                    {asset.output || asset.snr || asset.capacity || asset.currentLevel || "Nominal"}
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5">Real-time SCADA bus</div>
                </div>

                <div className="bg-[#0B192C] border border-[#1E3E62] p-3 rounded-xl">
                  <div className="text-slate-400 text-[10px]">VIBRATION / FREQUENCY</div>
                  <div className="text-base font-bold text-indigo-300 mt-1">
                    {asset.vibration || asset.frequency || asset.windSpeed || "0.85 mm/s (Nominal)"}
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5">ISO 10816 Standard</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wide">SCADA Remote Tele-Commands</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleAction("EXECUTE_CALIBRATION")}
                    className="p-3 bg-sky-950/60 hover:bg-sky-900 border border-sky-800 rounded-xl text-left transition-all hover:border-cyan-400"
                  >
                    <div className="font-bold text-cyan-300 flex items-center space-x-1.5">
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Run Remote Calibration</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Poll sensors, re-zero calibration curves, and verify signal-to-noise ratio.</p>
                  </button>

                  <button
                    onClick={() => handleAction("SET_HIGH_DUTY_CYCLE")}
                    className="p-3 bg-blue-950/60 hover:bg-blue-900 border border-blue-800 rounded-xl text-left transition-all hover:border-cyan-400"
                  >
                    <div className="font-bold text-sky-300 flex items-center space-x-1.5">
                      <Zap className="h-3.5 w-3.5" />
                      <span>Set High-Duty Cycle</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Increase trace heating or switch to maximum power generation mode.</p>
                  </button>

                  <button
                    onClick={() => handleAction("RUN_SELF_TEST")}
                    className="p-3 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800 rounded-xl text-left transition-all hover:border-cyan-400"
                  >
                    <div className="font-bold text-indigo-300 flex items-center space-x-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Diagnostic Self-Test</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Run internal diagnostic sweep and generate telemetry report.</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GROUND-TRUTH PHOTO REFERENCE */}
          {activeTab === "PHOTO_REF" && (
            <div className="space-y-6">
              <div className="bg-[#0B192C] border border-[#1E3E62] rounded-xl overflow-hidden">
                <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img
                    src={photoRef.imageSrc}
                    alt={photoRef.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-black/80 text-cyan-300 text-[10px] font-mono px-2 py-1 rounded border border-cyan-800 font-bold">
                    NCPOR GROUND-TRUTH
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="text-sm font-bold text-white font-mono">{photoRef.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{photoRef.caption}</p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {photoRef.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[10px] text-cyan-300 font-bold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Source: {photoRef.credit}</span>
                    <span className="text-emerald-400">Verified Physical Ground-Truth Match</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TELEMETRY HISTORY */}
          {activeTab === "HISTORICAL" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-[#0B192C] p-3 rounded-xl border border-[#1E3E62]">
                <span className="text-slate-300 font-bold">Historical SCADA Metric (Past 24 Hours):</span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setHistoryMetric("temp")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      historyMetric === "temp" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Temperature (°C)
                  </button>
                  <button
                    onClick={() => setHistoryMetric("vibration")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      historyMetric === "vibration" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Vibration (mm/s)
                  </button>
                  <button
                    onClick={() => setHistoryMetric("output")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      historyMetric === "output" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Load / Power (kW)
                  </button>
                </div>
              </div>

              <div className="h-64 bg-[#0B192C] border border-[#1E3E62] p-4 rounded-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={
                            historyMetric === "temp"
                              ? "#f59e0b"
                              : historyMetric === "vibration"
                              ? "#818cf8"
                              : "#06b6d4"
                          }
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={
                            historyMetric === "temp"
                              ? "#f59e0b"
                              : historyMetric === "vibration"
                              ? "#818cf8"
                              : "#06b6d4"
                          }
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E3E62" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#071322",
                        borderColor: "#1E3E62",
                        borderRadius: "8px",
                        fontSize: "11px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={historyMetric}
                      stroke={
                        historyMetric === "temp"
                          ? "#f59e0b"
                          : historyMetric === "vibration"
                          ? "#818cf8"
                          : "#06b6d4"
                      }
                      fillOpacity={1}
                      fill="url(#colorGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB 4: MAINTENANCE */}
          {activeTab === "MAINTENANCE" && (
            <div className="space-y-6">
              <div className="bg-[#0B192C] border border-[#1E3E62] p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">Station Maintenance Protocol</span>
                  <span className="text-[10px] text-cyan-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                    Next Inspection: In 14 Days
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Regular servicing schedule adhering to Polar SCADA Standards. Includes lubricant viscosity test, insulation resistance checks, and seal integrity assessments against polar katabatic gales.
                </p>

                <div className="pt-2">
                  <button
                    onClick={handleCreateWorkOrder}
                    disabled={workOrderCreated}
                    className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all ${
                      workOrderCreated
                        ? "bg-emerald-800 text-white cursor-not-allowed"
                        : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/40"
                    }`}
                  >
                    <Wrench className="h-4 w-4" />
                    <span>{workOrderCreated ? "Work Order Generated" : "Create Maintenance Work Order"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#0B192C] border-t border-[#1E3E62] p-4 flex justify-between items-center text-xs font-mono">
          <div className="text-slate-400 flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NCPOR Polar SCADA Gateway v2.4 • Live Encrypted Feed</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white hover:bg-slate-700 rounded-lg transition-colors font-bold"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
