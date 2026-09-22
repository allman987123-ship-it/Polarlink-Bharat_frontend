"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import {
  Zap,
  Activity,
  AlertTriangle,
  Thermometer,
  Wind,
  RefreshCw,
  Eye,
  Maximize2,
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles,
  CloudSnow,
  Radio,
  Sliders,
  Ship,
  Sun,
  Sunset,
  Moon,
  Ruler,
  SplitSquareVertical,
  Video,
  Camera,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Truck,
  Droplets,
  Flame,
  Navigation,
} from "lucide-react";
import { AssetInspectorModal } from "./AssetInspectorModal";

export type LightingMode = "DAY" | "TWILIGHT" | "NIGHT" | "BLIZZARD";
export type VisualMode = "REALISTIC" | "THERMAL" | "XRAY" | "WIND_STRESS" | "EXPLODED";

interface StationCanvas3DProps {
  stationId?: "maitri" | "bharati";
  station?: "maitri" | "bharati";
  cameraPreset?: string;
  autoRotate?: boolean;
  hideInternalOverlay?: boolean;
  selectedAssetId?: string | null;
  onSelectAsset?: (asset: any) => void;
  faultActive?: boolean;
  lightingMode?: LightingMode;
  onLightingModeChange?: (mode: LightingMode) => void;
  visualMode?: VisualMode;
  onVisualModeChange?: (mode: VisualMode) => void;
  isMeasuring?: boolean;
  onMeasureDistance?: (distanceMeters: number | null) => void;
  sectionCutActive?: boolean;
  sectionCutHeight?: number; // 0 to 100
  showCctvFov?: boolean;
  showCctvPip?: boolean;
  layers?: {
    buildings: boolean;
    sensors: boolean;
    power: boolean;
    paths: boolean;
    terrain: boolean;
  };
}

export function StationCanvas3D({
  stationId: propStationId,
  station: propStation,
  cameraPreset: propCameraPreset,
  autoRotate: propAutoRotate,
  hideInternalOverlay = false,
  selectedAssetId,
  onSelectAsset,
  faultActive = false,
  lightingMode: propLightingMode,
  onLightingModeChange,
  visualMode: propVisualMode,
  onVisualModeChange,
  isMeasuring: propIsMeasuring = false,
  onMeasureDistance,
  sectionCutActive = false,
  sectionCutHeight = 50,
  showCctvFov = false,
  showCctvPip = false,
  layers = {
    buildings: true,
    sensors: true,
    power: true,
    paths: true,
    terrain: true,
  },
}: StationCanvas3DProps) {
  const stationId = propStation || propStationId || "bharati";
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalLightingMode, setInternalLightingMode] = useState<LightingMode>("DAY");
  const [internalVisualMode, setInternalVisualMode] = useState<VisualMode>("REALISTIC");
  const [cameraView, setCameraView] = useState<string>("OVERVIEW");
  const [isRotating, setIsRotating] = useState(false);
  const isRotatingRef = useRef<boolean>(false);
  const [activeAsset, setActiveAsset] = useState<any>(null);
  const [hoveredAsset, setHoveredAsset] = useState<any>(null);
  const [inspectorAsset, setInspectorAsset] = useState<any>(null);

  useEffect(() => {
    isRotatingRef.current = !!propAutoRotate;
    setIsRotating(!!propAutoRotate);
  }, [propAutoRotate]);

  // Measurement State
  const [measurePoints, setMeasurePoints] = useState<THREE.Vector3[]>([]);
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);

  // Active Modes
  const lighting = propLightingMode || internalLightingMode;
  const visual = propVisualMode || internalVisualMode;
  const isMeasuring = propIsMeasuring;

  const setLighting = (mode: LightingMode) => {
    setInternalLightingMode(mode);
    if (onLightingModeChange) onLightingModeChange(mode);
  };

  const setVisual = (mode: VisualMode) => {
    setInternalVisualMode(mode);
    if (onVisualModeChange) onVisualModeChange(mode);
  };

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const interactiveMeshesRef = useRef<THREE.Mesh[]>([]);
  const layerGroupsRef = useRef<{ [key: string]: THREE.Group }>({});
  const snowParticlesRef = useRef<THREE.Points | null>(null);
  const beaconLightRef = useRef<THREE.PointLight | null>(null);
  const measureLineRef = useRef<THREE.Line | null>(null);
  const cctvConeRef = useRef<THREE.Mesh | null>(null);
  const clippingPlaneRef = useRef<THREE.Plane | null>(null);

  const targetCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(45, 26, 48));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.5, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.5, 0));

  // Orbit state
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraSpherical = useRef({ radius: 62, theta: Math.PI / 3.4, phi: Math.PI / 3.2 });

  // -------------------------------------------------------------
  // HELPER: Procedural High-Fidelity Textures via HTML5 Canvas
  // -------------------------------------------------------------
  const proceduralTextures = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        terrain: null,
        metal: null,
        tricolor: null,
        solar: null,
        geodesic: null,
        helipad: null,
        maitriSign: null,
        maitriPanel: null,
      };
    }

    // 1. Rocky Moraine & Permafrost Terrain Texture (Schirmacher Oasis & Larsemann Hills)
    const terrainCanvas = document.createElement("canvas");
    terrainCanvas.width = 512;
    terrainCanvas.height = 512;
    const tCtx = terrainCanvas.getContext("2d");
    if (tCtx) {
      tCtx.fillStyle = stationId === "maitri" ? "#7d6b58" : "#87705d";
      tCtx.fillRect(0, 0, 512, 512);

      // Noise grain & rock speckles
      for (let i = 0; i < 40000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = Math.random() * 2.2;
        const shade = Math.random() > 0.5 ? "rgba(35,25,15,0.4)" : "rgba(235,245,255,0.25)";
        tCtx.fillStyle = shade;
        tCtx.beginPath();
        tCtx.arc(x, y, r, 0, Math.PI * 2);
        tCtx.fill();
      }

      // Permafrost moraine cracks & gneiss rock ridges
      tCtx.strokeStyle = "rgba(40, 30, 20, 0.45)";
      tCtx.lineWidth = 1.4;
      for (let j = 0; j < 16; j++) {
        tCtx.beginPath();
        let cx = Math.random() * 512;
        let cy = Math.random() * 512;
        tCtx.moveTo(cx, cy);
        for (let s = 0; s < 7; s++) {
          cx += (Math.random() - 0.5) * 85;
          cy += (Math.random() - 0.5) * 85;
          tCtx.lineTo(cx, cy);
        }
        tCtx.stroke();
      }
    }
    const terrainTexture = new THREE.CanvasTexture(terrainCanvas);
    terrainTexture.wrapS = THREE.RepeatWrapping;
    terrainTexture.wrapT = THREE.RepeatWrapping;
    terrainTexture.repeat.set(16, 16);

    // 2. Maitri Light Grey-Green Sandwich Panel Texture (Photo 2 Reference)
    const mPanelCanvas = document.createElement("canvas");
    mPanelCanvas.width = 256;
    mPanelCanvas.height = 256;
    const mpCtx = mPanelCanvas.getContext("2d");
    if (mpCtx) {
      mpCtx.fillStyle = "#83979b"; // Authentic Maitri grey-green
      mpCtx.fillRect(0, 0, 256, 256);
      for (let x = 0; x < 256; x += 32) {
        mpCtx.fillStyle = "rgba(0,0,0,0.18)";
        mpCtx.fillRect(x, 0, 2, 256);
        mpCtx.fillStyle = "rgba(255,255,255,0.15)";
        mpCtx.fillRect(x + 2, 0, 1, 256);
      }
      mpCtx.fillStyle = "rgba(0,0,0,0.25)";
      mpCtx.fillRect(0, 126, 256, 4);
    }
    const maitriPanelTexture = new THREE.CanvasTexture(mPanelCanvas);
    maitriPanelTexture.wrapS = THREE.RepeatWrapping;
    maitriPanelTexture.wrapT = THREE.RepeatWrapping;
    maitriPanelTexture.repeat.set(8, 2);

    // 3. Corrugated Metal / Insulated Modular Cladding
    const metalCanvas = document.createElement("canvas");
    metalCanvas.width = 256;
    metalCanvas.height = 256;
    const mCtx = metalCanvas.getContext("2d");
    if (mCtx) {
      mCtx.fillStyle = "#d5dbdb";
      mCtx.fillRect(0, 0, 256, 256);
      for (let x = 0; x < 256; x += 8) {
        mCtx.fillStyle = x % 16 === 0 ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)";
        mCtx.fillRect(x, 0, 4, 256);
      }
    }
    const metalTexture = new THREE.CanvasTexture(metalCanvas);
    metalTexture.wrapS = THREE.RepeatWrapping;
    metalTexture.wrapT = THREE.RepeatWrapping;
    metalTexture.repeat.set(6, 2);

    // 4. Indian Tricolour Flag Badge Texture (Photo 2 Reference)
    const triCanvas = document.createElement("canvas");
    triCanvas.width = 256;
    triCanvas.height = 128;
    const flagCtx = triCanvas.getContext("2d");
    if (flagCtx) {
      flagCtx.fillStyle = "#FF9933";
      flagCtx.fillRect(0, 0, 256, 42);
      flagCtx.fillStyle = "#FFFFFF";
      flagCtx.fillRect(0, 42, 256, 44);
      flagCtx.fillStyle = "#138808";
      flagCtx.fillRect(0, 86, 256, 42);

      flagCtx.strokeStyle = "#000080";
      flagCtx.lineWidth = 2.5;
      flagCtx.beginPath();
      flagCtx.arc(128, 64, 16, 0, Math.PI * 2);
      flagCtx.stroke();
      for (let sp = 0; sp < 24; sp++) {
        const angle = (sp * Math.PI) / 12;
        flagCtx.beginPath();
        flagCtx.moveTo(128, 64);
        flagCtx.lineTo(128 + Math.cos(angle) * 16, 64 + Math.sin(angle) * 16);
        flagCtx.stroke();
      }
    }
    const tricolorTexture = new THREE.CanvasTexture(triCanvas);

    // 5. Maitri Rooftop Signboard Texture: "मैत्री MAITRI" (Photo 2 Reference)
    const signCanvas = document.createElement("canvas");
    signCanvas.width = 256;
    signCanvas.height = 128;
    const signCtx = signCanvas.getContext("2d");
    if (signCtx) {
      signCtx.fillStyle = "rgba(255,255,255,0.0)";
      signCtx.clearRect(0, 0, 256, 128);

      signCtx.fillStyle = "#0f172a";
      signCtx.font = "bold 44px sans-serif";
      signCtx.textAlign = "center";
      signCtx.fillText("मैत्री", 128, 48);

      signCtx.font = "bold 52px monospace";
      signCtx.fillText("MAITRI", 128, 108);
    }
    const maitriSignTexture = new THREE.CanvasTexture(signCanvas);

    // 6. Solar PV Panel Texture
    const solarCanvas = document.createElement("canvas");
    solarCanvas.width = 128;
    solarCanvas.height = 128;
    const sCtx = solarCanvas.getContext("2d");
    if (sCtx) {
      sCtx.fillStyle = "#0c2340";
      sCtx.fillRect(0, 0, 128, 128);
      sCtx.strokeStyle = "#38bdf8";
      sCtx.lineWidth = 1;
      for (let i = 0; i <= 128; i += 16) {
        sCtx.beginPath();
        sCtx.moveTo(i, 0);
        sCtx.lineTo(i, 128);
        sCtx.stroke();
        sCtx.beginPath();
        sCtx.moveTo(0, i);
        sCtx.lineTo(128, i);
        sCtx.stroke();
      }
    }
    const solarTexture = new THREE.CanvasTexture(solarCanvas);
    solarTexture.wrapS = THREE.RepeatWrapping;
    solarTexture.wrapT = THREE.RepeatWrapping;
    solarTexture.repeat.set(4, 2);

    // 7. Geodesic Radome Texture
    const geoCanvas = document.createElement("canvas");
    geoCanvas.width = 512;
    geoCanvas.height = 256;
    const gCtx = geoCanvas.getContext("2d");
    if (gCtx) {
      gCtx.fillStyle = "#f8fafc";
      gCtx.fillRect(0, 0, 512, 256);
      gCtx.strokeStyle = "#cbd5e1";
      gCtx.lineWidth = 2.0;
      const step = 32;
      for (let y = 0; y <= 256; y += step) {
        for (let x = 0; x <= 512; x += step) {
          gCtx.strokeRect(x, y, step, step);
          gCtx.beginPath();
          gCtx.moveTo(x, y);
          gCtx.lineTo(x + step, y + step);
          gCtx.stroke();
        }
      }
    }
    const geodesicTexture = new THREE.CanvasTexture(geoCanvas);
    geodesicTexture.wrapS = THREE.RepeatWrapping;
    geodesicTexture.wrapT = THREE.RepeatWrapping;
    geodesicTexture.repeat.set(4, 2);

    // 8. Concrete Helipad Texture
    const heliCanvas = document.createElement("canvas");
    heliCanvas.width = 256;
    heliCanvas.height = 256;
    const hCtx = heliCanvas.getContext("2d");
    if (hCtx) {
      hCtx.fillStyle = "#475569";
      hCtx.fillRect(0, 0, 256, 256);
      hCtx.strokeStyle = "#eab308";
      hCtx.lineWidth = 12;
      hCtx.strokeRect(8, 8, 240, 240);
      hCtx.strokeStyle = "#ffffff";
      hCtx.lineWidth = 10;
      hCtx.beginPath();
      hCtx.arc(128, 128, 85, 0, Math.PI * 2);
      hCtx.stroke();
      hCtx.fillStyle = "#ffffff";
      hCtx.font = "bold 105px sans-serif";
      hCtx.textAlign = "center";
      hCtx.textBaseline = "middle";
      hCtx.fillText("H", 128, 130);
    }
    const helipadTexture = new THREE.CanvasTexture(heliCanvas);

    return {
      terrain: terrainTexture,
      metal: metalTexture,
      tricolor: tricolorTexture,
      solar: solarTexture,
      geodesic: geodesicTexture,
      helipad: helipadTexture,
      maitriSign: maitriSignTexture,
      maitriPanel: maitriPanelTexture,
    };
  }, [stationId]);

  // -------------------------------------------------------------
  // THREE.JS SCENE INITIALIZATION & REBUILD
  // -------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 580;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    let bgHex = 0x061120;
    let fogHex = 0x061120;
    let fogDensity = 0.007;

    if (lighting === "TWILIGHT") {
      bgHex = 0x1f1124;
      fogHex = 0x2b162e;
      fogDensity = 0.010;
    } else if (lighting === "NIGHT") {
      bgHex = 0x020712;
      fogHex = 0x020712;
      fogDensity = 0.009;
    } else if (lighting === "BLIZZARD") {
      bgHex = 0x94a3b8;
      fogHex = 0x94a3b8;
      fogDensity = 0.035;
    }

    if (visual === "THERMAL") {
      bgHex = 0x020617;
      fogHex = 0x020617;
      fogDensity = 0.005;
    }

    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(fogHex, fogDensity);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1400);
    camera.position.set(48, 28, 52);
    camera.lookAt(0, 3.5, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = lighting === "DAY" ? 1.3 : lighting === "TWILIGHT" ? 1.45 : 1.05;
    renderer.localClippingEnabled = true;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const clipPlane = new THREE.Plane(
      new THREE.Vector3(0, -1, 0),
      sectionCutActive ? (sectionCutHeight / 100) * 18 : 1000
    );
    clippingPlaneRef.current = clipPlane;

    const ambientColor = lighting === "TWILIGHT" ? 0xfdba74 : lighting === "NIGHT" ? 0x1e293b : 0xe0f2fe;
    const ambientIntensity = lighting === "NIGHT" ? 0.35 : lighting === "TWILIGHT" ? 0.9 : 1.45;
    const ambientLight = new THREE.AmbientLight(ambientColor, visual === "THERMAL" ? 0.3 : ambientIntensity);
    scene.add(ambientLight);

    const sunColor = lighting === "TWILIGHT" ? 0xff7733 : lighting === "NIGHT" ? 0x38bdf8 : 0xfffbeb;
    const sunIntensity = lighting === "NIGHT" ? 0.4 : lighting === "TWILIGHT" ? 3.0 : 2.7;
    const sunLight = new THREE.DirectionalLight(sunColor, visual === "THERMAL" ? 0.6 : sunIntensity);

    if (lighting === "TWILIGHT") {
      sunLight.position.set(120, 20, -70);
    } else if (lighting === "NIGHT") {
      sunLight.position.set(-45, 50, -35);
    } else {
      sunLight.position.set(70, 90, 50);
    }

    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0002;
    scene.add(sunLight);

    const polarBounce = new THREE.DirectionalLight(0x00e5ff, lighting === "NIGHT" ? 0.2 : 0.45);
    polarBounce.position.set(-25, -10, -25);
    scene.add(polarBounce);

    if (lighting === "NIGHT") {
      const flood1 = new THREE.SpotLight(0xfff7ed, 3.8, 55, Math.PI / 4, 0.4);
      flood1.position.set(14, 15, 18);
      flood1.target.position.set(0, 4, 0);
      scene.add(flood1);
      scene.add(flood1.target);

      const flood2 = new THREE.SpotLight(0x38bdf8, 3.2, 50, Math.PI / 4, 0.5);
      flood2.position.set(-20, 12, 16);
      flood2.target.position.set(-24, 3, 2);
      scene.add(flood2);
      scene.add(flood2.target);
    }

    const layerGroups = {
      buildings: new THREE.Group(),
      sensors: new THREE.Group(),
      power: new THREE.Group(),
      paths: new THREE.Group(),
      terrain: new THREE.Group(),
    };
    layerGroupsRef.current = layerGroups;
    Object.values(layerGroups).forEach((grp) => scene.add(grp));

    const interactiveMeshes: THREE.Mesh[] = [];

    const getMaterial = (
      baseColor: number,
      thermalTempC: number,
      metalness = 0.35,
      roughness = 0.55,
      emissiveNight = 0x000000,
      mapTexture: THREE.Texture | null = null
    ) => {
      const clippingPlanes = sectionCutActive ? [clipPlane] : [];

      if (visual === "THERMAL") {
        let color = 0x0284c7;
        let emissive = 0x0369a1;
        if (thermalTempC > 75) {
          color = 0xef4444;
          emissive = 0x991b1b;
        } else if (thermalTempC > 45) {
          color = 0xf59e0b;
          emissive = 0x78350f;
        } else if (thermalTempC > 18) {
          color = 0x10b981;
          emissive = 0x064e3b;
        }
        return new THREE.MeshStandardMaterial({
          color,
          emissive,
          emissiveIntensity: 0.75,
          roughness: 0.2,
          metalness: 0.7,
          clippingPlanes,
          clipShadows: true,
        });
      }

      if (visual === "XRAY") {
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          wireframe: true,
          emissive: baseColor,
          emissiveIntensity: 0.45,
          transparent: true,
          opacity: 0.85,
          clippingPlanes,
        });
      }

      const mat = new THREE.MeshStandardMaterial({
        color: baseColor,
        metalness,
        roughness,
        map: mapTexture || undefined,
        emissive: lighting === "NIGHT" ? emissiveNight : 0x000000,
        emissiveIntensity: lighting === "NIGHT" && emissiveNight !== 0x000000 ? 0.9 : 0.0,
        clippingPlanes,
        clipShadows: true,
      });
      return mat;
    };

    // -------------------------------------------------------------
    // 5. PROCEDURAL TERRAIN (Schirmacher Oasis vs Larsemann Hills)
    // -------------------------------------------------------------
    if (layers.terrain) {
      const terrainGeo = new THREE.PlaneGeometry(260, 260, 110, 110);
      const pos = terrainGeo.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);

        let z =
          Math.sin(vx * 0.035) * Math.cos(vy * 0.035) * 4.2 +
          Math.sin(vx * 0.08 + 1.2) * Math.cos(vy * 0.07) * 2.1 +
          Math.sin(vx * 0.2) * 0.45;

        // Flatten station central foundation ridge
        const distFromCenter = Math.hypot(vx, vy);
        if (distFromCenter < 28) {
          const flattenFactor = Math.min(1, Math.max(0, (distFromCenter - 14) / 14));
          z = z * flattenFactor + 0.3 * (1 - flattenFactor);
        }

        if (stationId === "maitri") {
          // Lake Priyadarshini depression (Southwest: vx: -38, vy: -22 - Image 3 Satellite)
          const distToLake = Math.hypot(vx - (-38), vy - (-22));
          if (distToLake < 24) {
            z -= Math.cos((distToLake / 24) * (Math.PI / 2)) * 3.4;
          }

          // Helipad flat plateau (Northwest: vx: -26, vy: 16 - Image 3 Satellite)
          const distToHelipad = Math.hypot(vx - (-26), vy - 16);
          if (distToHelipad < 12) {
            z = 0.35 + (z - 0.35) * (distToHelipad / 12);
          }
        } else if (stationId === "bharati") {
          // Larsemann Hills Glacial Lake (South: vy ~ 24, vx ~ 2)
          const distToBharatiLake = Math.hypot(vx - 2, vy - 24);
          if (distToBharatiLake < 18) {
            z -= Math.cos((distToBharatiLake / 18) * (Math.PI / 2)) * 3.8;
          }

          // Helipad flat concrete plateau (Northwest: vx ~ -28, vy ~ -12)
          const distToHelipad = Math.hypot(vx - (-28), vy - (-12));
          if (distToHelipad < 14) {
            z = 0.4 + (z - 0.4) * (distToHelipad / 14);
          }

          // Prydz Bay Ocean depression (North: vy < -24)
          if (vy < -24) {
            const drop = Math.min(6.2, (-24 - vy) * 0.35);
            z -= drop;
          }
        }

        // Surrounding nunataks / moraine ridges
        if (Math.abs(vx) > 75 || Math.abs(vy) > 75) {
          z += Math.pow(Math.max(0, (Math.max(Math.abs(vx), Math.abs(vy)) - 75) * 0.18), 1.6);
        }

        pos.setZ(i, z);
      }
      terrainGeo.computeVertexNormals();

      const terrainMat = getMaterial(
        stationId === "maitri" ? 0x82705e : 0x8e7764,
        -12.0,
        0.05,
        0.95,
        0x000000,
        proceduralTextures.terrain
      );
      const terrain = new THREE.Mesh(terrainGeo, terrainMat);
      terrain.rotation.x = -Math.PI / 2;
      terrain.receiveShadow = true;
      layerGroups.terrain.add(terrain);

      if (stationId === "maitri") {
        // LAKE PRIYADARSHINI WATER PLANE (Schirmacher Oasis Glacier Melt Reservoir - Image 3)
        const lakeGeo = new THREE.CircleGeometry(22, 64);
        const lakeMat = new THREE.MeshStandardMaterial({
          color: visual === "THERMAL" ? 0x0284c7 : 0x0b4d75,
          roughness: 0.06,
          metalness: 0.88,
          transparent: true,
          opacity: 0.93,
        });
        const lake = new THREE.Mesh(lakeGeo, lakeMat);
        lake.rotation.x = -Math.PI / 2;
        lake.position.set(-38, 0.35, -22);
        (lake as any).userData = {
          id: "maitri-lake-priyadarshini",
          name: "Lake Priyadarshini Glacier Melt Freshwater Reservoir",
          category: "WATER",
          status: "NORMAL",
          health: "99.2%",
          temp: "3.2°C",
          iceCoverDepth: "1.65 m",
          desc: "Pristine proglacial freshwater lake named by the 3rd Indian Antarctic Expedition, supplying uninterrupted freshwater to Maitri Station via insulated heat-traced conduits.",
        };
        layerGroups.terrain.add(lake);
        interactiveMeshes.push(lake);

        // Snow Banks & Glacial Moraine Ice Drifts (Image 3 Satellite)
        const snowBankGeo = new THREE.RingGeometry(21, 25, 48);
        const snowBankMat = new THREE.MeshStandardMaterial({
          color: 0xf1f5f9,
          roughness: 0.85,
          metalness: 0.05,
        });
        const snowBank = new THREE.Mesh(snowBankGeo, snowBankMat);
        snowBank.rotation.x = -Math.PI / 2;
        snowBank.position.set(-38, 0.38, -22);
        layerGroups.terrain.add(snowBank);

        // Scattered Glacial Erratics & Boulders (Image 1 CAD Model Reference)
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x5c4d3c, roughness: 0.95, metalness: 0.1 });
        const rockCoords = [
          [-14, 0.6, 12], [8, 0.5, 14], [-8, 0.4, -12], [16, 0.5, -8],
          [-28, 0.7, 4], [22, 0.6, 10], [-4, 0.4, 18], [28, 0.8, -16],
          [-22, 0.5, 18], [12, 0.4, -18]
        ];
        rockCoords.forEach(([rx, ry, rz], idx) => {
          const rGeo = new THREE.DodecahedronGeometry(0.7 + (idx % 3) * 0.4, 0);
          const rock = new THREE.Mesh(rGeo, rockMat);
          rock.position.set(rx, ry, rz);
          rock.rotation.set(idx * 0.5, idx * 0.8, idx * 0.3);
          rock.castShadow = true;
          layerGroups.terrain.add(rock);
        });

        // MAITRI CONCRETE HELIPAD (Image 3 Satellite: Northwest LZ)
        if (layers.buildings) {
          const heliGroup = new THREE.Group();
          const padGeo = new THREE.BoxGeometry(14, 0.6, 14);
          const padMat = new THREE.MeshStandardMaterial({
            map: proceduralTextures.helipad,
            roughness: 0.75,
            metalness: 0.2,
          });
          const pad = new THREE.Mesh(padGeo, padMat);
          pad.position.set(-26, 0.35, 16);
          pad.castShadow = true;
          pad.receiveShadow = true;
          (pad as any).userData = {
            id: "maitri-helipad",
            name: "Maitri Station Helicopter Landing Zone (Schirmacher LZ)",
            category: "AVIATION",
            status: "OPERATIONAL",
            health: "100%",
            capacity: "Aerospatiale SA 315B Lama / Ka-32",
            desc: "Reinforced helipad with circular 'H' markings, boundary marker stones, and approach windsock servicing supply flights from Novolazarevskaya Runway (DROMLAN).",
          };
          heliGroup.add(pad);
          interactiveMeshes.push(pad);

          const wsMastGeo = new THREE.CylinderGeometry(0.08, 0.08, 5.0, 8);
          const wsMastMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
          const wsMast = new THREE.Mesh(wsMastGeo, wsMastMat);
          wsMast.position.set(-34, 2.5, 22);
          heliGroup.add(wsMast);

          const sockGeo = new THREE.ConeGeometry(0.35, 1.8, 12);
          const sockMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.8 });
          const sock = new THREE.Mesh(sockGeo, sockMat);
          sock.rotation.z = Math.PI / 2.3;
          sock.position.set(-33.2, 4.6, 22);
          heliGroup.add(sock);

          layerGroups.buildings.add(heliGroup);
        }
      } else {
        // Bharati Lake & Bay terrain
        const bharatiLakeGeo = new THREE.CircleGeometry(16, 48);
        const bharatiLakeMat = new THREE.MeshStandardMaterial({
          color: visual === "THERMAL" ? 0x0284c7 : 0x0e5a6a,
          roughness: 0.08,
          metalness: 0.85,
          transparent: true,
          opacity: 0.94,
        });
        const bharatiLake = new THREE.Mesh(bharatiLakeGeo, bharatiLakeMat);
        bharatiLake.rotation.x = -Math.PI / 2;
        bharatiLake.position.set(2, 0.25, 24);
        (bharatiLake as any).userData = {
          id: "bharati-glacial-lake",
          name: "Larsemann Hills Glacial Meltwater Lake",
          category: "WATER",
          status: "NORMAL",
          health: "99.4%",
          temp: "2.4°C",
          desc: "Perennial freshwater glacial melt basin supplying Bharati Station reverse osmosis desalination and scientific micro-biology monitoring stations.",
        };
        layerGroups.terrain.add(bharatiLake);
        interactiveMeshes.push(bharatiLake);

        const seaGeo = new THREE.PlaneGeometry(260, 110);
        const seaMat = new THREE.MeshStandardMaterial({
          color: visual === "THERMAL" ? 0x0369a1 : 0x0b2545,
          roughness: 0.15,
          metalness: 0.8,
        });
        const seaWater = new THREE.Mesh(seaGeo, seaMat);
        seaWater.rotation.x = -Math.PI / 2;
        seaWater.position.set(0, -5.8, -75);
        seaWater.receiveShadow = true;
        layerGroups.terrain.add(seaWater);

        const iceMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4, metalness: 0.1 });
        for (let ib = 0; ib < 4; ib++) {
          const ibGeo = new THREE.BoxGeometry(16 + ib * 6, 4.5, 12 + ib * 4);
          const iceberg = new THREE.Mesh(ibGeo, iceMat);
          iceberg.position.set(-60 + ib * 40, -4.2, -85 - (ib % 2) * 12);
          iceberg.rotation.y = ib * 0.6;
          iceberg.castShadow = true;
          layerGroups.terrain.add(iceberg);
        }

        if (layers.buildings) {
          const padGroup = new THREE.Group();
          const padGeo = new THREE.BoxGeometry(16, 0.8, 16);
          const padMat = new THREE.MeshStandardMaterial({
            map: proceduralTextures.helipad,
            roughness: 0.7,
            metalness: 0.2,
          });
          const padMesh = new THREE.Mesh(padGeo, padMat);
          padMesh.position.set(-28, 0.4, -12);
          padMesh.castShadow = true;
          padMesh.receiveShadow = true;
          (padMesh as any).userData = {
            id: "bharati-helipad",
            name: "Bharati Station Aviation Helipad (Larsemann LZ)",
            category: "AVIATION",
            status: "OPERATIONAL",
            health: "100%",
            windSpeed: "14 kts",
            capacity: "Kamov Ka-32 / Bell 412 Heavy Lift",
            desc: "Reinforced concrete polar helipad with circular 'H' markings, high-visibility perimeter lighting, and aviation windsock for ship-to-shore helicopter airlift operations.",
          };
          padGroup.add(padMesh);
          interactiveMeshes.push(padMesh);
          layerGroups.buildings.add(padGroup);
        }
      }

      // 3D Service Roads & Tracks (Matching Image 3 Satellite)
      if (layers.paths) {
        if (stationId === "maitri") {
          const maitriTrack = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-26, 0.4, 16),   // Helipad
            new THREE.Vector3(-14, 0.42, 10),
            new THREE.Vector3(0, 0.45, 12),    // Main Front Approach
            new THREE.Vector3(18, 0.42, 6),    // Generator & Tanks
            new THREE.Vector3(26, 0.4, -10),   // Container Village
            new THREE.Vector3(4, 0.4, -18),    // Rear Courtyard
            new THREE.Vector3(-24, 0.4, -14),  // Pump Pipeline Route
            new THREE.Vector3(-38, 0.4, -22),  // Lake Priyadarshini
          ]);
          const pathPoints = maitriTrack.getPoints(100);
          const trackGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);
          const trackMat = new THREE.LineBasicMaterial({ color: 0xd97706, linewidth: 3 });
          const trackLine = new THREE.Line(trackGeo, trackMat);
          layerGroups.paths.add(trackLine);
        } else {
          const bharatiTrack1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-28, 0.45, -12),
            new THREE.Vector3(-14, 0.45, -4),
            new THREE.Vector3(0, 0.45, 8),
            new THREE.Vector3(16, 0.45, 12),
            new THREE.Vector3(2, 0.45, 24),
          ]);
          const trackPoints = bharatiTrack1.getPoints(90);
          const trackGeo = new THREE.BufferGeometry().setFromPoints(trackPoints);
          const trackMat = new THREE.LineBasicMaterial({ color: 0xd97706, linewidth: 3 });
          const trackLine = new THREE.Line(trackGeo, trackMat);
          layerGroups.paths.add(trackLine);
        }
      }
    }

    // -------------------------------------------------------------
    // 6. BUILD HIGH-FIDELITY STATION 3D MODELS
    // -------------------------------------------------------------
    if (stationId === "maitri") {
      // -----------------------------------------------------------
      // MAITRI RESEARCH STATION (ACCURATE TO 3 GROUND-TRUTH IMAGES)
      // -----------------------------------------------------------

      // 1. U-SHAPED MODULAR COMPLEX & RED STEEL STILT SPACE-FRAME (Images 1, 2, 3)
      if (layers.buildings) {
        const mainGroup = new THREE.Group();

        // Main East-West Spine Block: Clad in authentic grey-green sandwich panels
        const mainSpineGeo = new THREE.BoxGeometry(42, 5.0, 9.6);
        const mainSpineMat = getMaterial(
          0x83979b, // Authentic Maitri grey-green panel color (Photo 2)
          21.8,
          0.4,
          0.5,
          0x000000,
          proceduralTextures.maitriPanel
        );
        const mainSpine = new THREE.Mesh(mainSpineGeo, mainSpineMat);
        mainSpine.position.set(0, 4.8, 0);
        mainSpine.castShadow = true;
        mainSpine.receiveShadow = true;
        (mainSpine as any).userData = {
          id: "maitri-main-block",
          name: "Maitri Main Modular Station Complex (U-Shaped Spine)",
          category: "STRUCTURE",
          status: "NORMAL",
          health: "98.8%",
          temp: "21.8°C",
          humidity: "42%",
          occupancy: "25 Wintering Scientists & Logistics Crew",
          desc: "India's second permanent Antarctic station established in 1989. Features a stilted U-shaped modular building complex housing living quarters, meteorology labs, environmental labs, surgery, central galley, and mission control command room.",
        };
        mainGroup.add(mainSpine);
        interactiveMeshes.push(mainSpine);

        // Curved / Rounded Roof Cap (Image 1 CAD Model Reference)
        const roofCapGeo = new THREE.CylinderGeometry(4.8, 4.8, 42, 32, 1, false, 0, Math.PI);
        const roofCapMat = getMaterial(0x71868a, 21.0, 0.45, 0.5);
        const roofCap = new THREE.Mesh(roofCapGeo, roofCapMat);
        roofCap.rotation.z = Math.PI / 2;
        roofCap.position.set(0, 7.3, 0);
        roofCap.castShadow = true;
        mainGroup.add(roofCap);

        // North Rear Wings (Forming the U-Shaped Footprint - Image 1 CAD & Image 3 Satellite)
        const wingGeo = new THREE.BoxGeometry(8.5, 4.8, 12);
        const wingWest = new THREE.Mesh(wingGeo, mainSpineMat);
        wingWest.position.set(-16.5, 4.7, -10.5);
        wingWest.castShadow = true;
        mainGroup.add(wingWest);

        const wingEast = new THREE.Mesh(wingGeo, mainSpineMat);
        wingEast.position.set(16.5, 4.7, -10.5);
        wingEast.castShadow = true;
        mainGroup.add(wingEast);

        // RED STRUCTURAL STEEL CROSS-BRACED SPACE-FRAME STILTS (Photo 2 Reference)
        const redTrussMat = new THREE.MeshStandardMaterial({
          color: 0x991b1b, // Maitri Red Space-Frame Stilt Color
          metalness: 0.85,
          roughness: 0.3,
        });
        const footPadMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.8 });

        // Space-Frame Stilt Grid: Vertical columns + Diamond Cross-Bracing
        for (let x of [-19, -13, -7, 0, 7, 13, 19]) {
          for (let z of [-4.2, 4.2]) {
            // Concrete Rock Anchors
            const footGeo = new THREE.BoxGeometry(1.2, 0.4, 1.2);
            const foot = new THREE.Mesh(footGeo, footPadMat);
            foot.position.set(x, 0.2, z);
            foot.receiveShadow = true;
            mainGroup.add(foot);

            // Vertical Steel Stilt Columns (2.3m ground clearance)
            const stiltGeo = new THREE.CylinderGeometry(0.28, 0.28, 2.3, 12);
            const stilt = new THREE.Mesh(stiltGeo, redTrussMat);
            stilt.position.set(x, 1.35, z);
            stilt.castShadow = true;
            mainGroup.add(stilt);

            // Diagonal Cross-Bracing Struts (Photo 2)
            const braceGeo = new THREE.CylinderGeometry(0.09, 0.09, 6.4, 8);
            const brace1 = new THREE.Mesh(braceGeo, redTrussMat);
            brace1.rotation.z = 0.65;
            brace1.position.set(x, 1.35, z);
            mainGroup.add(brace1);

            const brace2 = new THREE.Mesh(braceGeo, redTrussMat);
            brace2.rotation.z = -0.65;
            brace2.position.set(x, 1.35, z);
            mainGroup.add(brace2);
          }
        }

        // Additional Stilts for Rear U-Wings
        for (let wx of [-16.5, 16.5]) {
          for (let wz of [-8, -14]) {
            const stiltGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.3, 12);
            const stilt = new THREE.Mesh(stiltGeo, redTrussMat);
            stilt.position.set(wx, 1.35, wz);
            stilt.castShadow = true;
            mainGroup.add(stilt);
          }
        }

        // CENTRAL ENTRANCE PORTICO & SIGNAGE (Photo 2 Ground Truth)
        const porticoGeo = new THREE.BoxGeometry(5.2, 6.2, 2.2);
        const porticoMat = getMaterial(0x7a8f94, 21.0, 0.4, 0.5);
        const portico = new THREE.Mesh(porticoGeo, porticoMat);
        portico.position.set(0, 5.2, 5.0);
        portico.castShadow = true;
        mainGroup.add(portico);

        // "मैत्री MAITRI" Rooftop Signboard (Photo 2)
        const signGeo = new THREE.PlaneGeometry(3.6, 1.8);
        const signMat = new THREE.MeshBasicMaterial({
          map: proceduralTextures.maitriSign,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const signMesh = new THREE.Mesh(signGeo, signMat);
        signMesh.position.set(0, 9.4, 5.8);
        mainGroup.add(signMesh);

        // Large Indian National Flag Mounted Above Main Entry Door (Photo 2)
        const flagGeo = new THREE.PlaneGeometry(4.6, 2.3);
        const flagMat = new THREE.MeshBasicMaterial({ map: proceduralTextures.tricolor, side: THREE.DoubleSide });
        const flag = new THREE.Mesh(flagGeo, flagMat);
        flag.position.set(0, 7.2, 6.12);
        mainGroup.add(flag);

        // Main Entrance Airlock Door (Photo 2)
        const doorGeo = new THREE.PlaneGeometry(1.4, 2.4);
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 });
        const door = new THREE.Mesh(doorGeo, doorMat);
        door.position.set(0, 4.0, 6.12);
        mainGroup.add(door);

        // Steel Access Staircase & Handrails (Photo 2)
        const stairTreadGeo = new THREE.BoxGeometry(2.4, 0.22, 4.4);
        const stairMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.8, roughness: 0.3 });
        const stair = new THREE.Mesh(stairTreadGeo, stairMat);
        stair.rotation.x = -0.42;
        stair.position.set(0, 1.5, 7.5);
        mainGroup.add(stair);

        const railMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.8, roughness: 0.3 });
        for (let rx of [-1.25, 1.25]) {
          const railGeo = new THREE.CylinderGeometry(0.04, 0.04, 4.6, 8);
          const rail = new THREE.Mesh(railGeo, railMat);
          rail.rotation.x = -0.42;
          rail.position.set(rx, 2.3, 7.5);
          mainGroup.add(rail);
        }

        // Ground Approach Pathway Bollards / Marker Stones (Photo 2 Reference)
        const bollardMat1 = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
        const bollardMat2 = new THREE.MeshStandardMaterial({ color: 0xffffff });
        for (let b = 1; b <= 4; b++) {
          for (let bx of [-1.6, 1.6]) {
            const bGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.7, 8);
            const bMat = b % 2 === 0 ? bollardMat1 : bollardMat2;
            const bMesh = new THREE.Mesh(bGeo, bMat);
            bMesh.position.set(bx, 0.35, 9.5 + b * 2.2);
            bMesh.castShadow = true;
            mainGroup.add(bMesh);
          }
        }

        // Rooftop International Flagpoles (India, Russia, South Africa, Germany - Photo 2)
        const poleMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.95 });
        const polePositions = [-14, -8, 8, 14];
        polePositions.forEach((px) => {
          const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 4.2, 8);
          const pole = new THREE.Mesh(poleGeo, poleMat);
          pole.position.set(px, 9.4, 4.8);
          mainGroup.add(pole);

          const bannerGeo = new THREE.PlaneGeometry(1.4, 0.85);
          const bannerMat = new THREE.MeshBasicMaterial({ color: px < 0 ? 0xff9933 : 0x0284c7, side: THREE.DoubleSide });
          const banner = new THREE.Mesh(bannerGeo, bannerMat);
          banner.position.set(px + 0.7, 10.8, 4.8);
          mainGroup.add(banner);
        });

        // Modular White Double-Hung Windows (Photo 2 Reference)
        const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.4 });
        const windowGlassMat = new THREE.MeshStandardMaterial({
          color: lighting === "NIGHT" || lighting === "TWILIGHT" ? 0xfef08a : 0x0369a1,
          emissive: lighting === "NIGHT" || lighting === "TWILIGHT" ? 0xf59e0b : 0x000000,
          emissiveIntensity: lighting === "NIGHT" ? 1.5 : lighting === "TWILIGHT" ? 1.1 : 0.0,
          roughness: 0.1,
          metalness: 0.95,
        });

        for (let w = -18; w <= 18; w += 2.8) {
          if (Math.abs(w) > 3.0) {
            // Front Windows
            const frameGeo = new THREE.BoxGeometry(1.2, 1.2, 0.15);
            const frameFront = new THREE.Mesh(frameGeo, windowFrameMat);
            frameFront.position.set(w, 4.8, 4.88);
            mainGroup.add(frameFront);

            const glassGeo = new THREE.PlaneGeometry(0.95, 0.95);
            const glassFront = new THREE.Mesh(glassGeo, windowGlassMat);
            glassFront.position.set(w, 4.8, 4.97);
            mainGroup.add(glassFront);

            // Rear Windows
            const frameBack = new THREE.Mesh(frameGeo, windowFrameMat);
            frameBack.position.set(w, 4.8, -4.88);
            mainGroup.add(frameBack);

            const glassBack = new THREE.Mesh(glassGeo, windowGlassMat);
            glassBack.rotation.y = Math.PI;
            glassBack.position.set(w, 4.8, -4.97);
            mainGroup.add(glassBack);
          }
        }

        // Two Polar Expedition Crew Avatars on Entrance Stairs (Photo 2 Ground Truth)
        const parkaMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.9 });
        for (let a of [-0.4, 0.4]) {
          const bodyGeo = new THREE.CylinderGeometry(0.2, 0.24, 1.4, 8);
          const body = new THREE.Mesh(bodyGeo, parkaMat);
          body.position.set(a, 3.4, 7.8);
          mainGroup.add(body);

          const headGeo = new THREE.SphereGeometry(0.18, 8, 8);
          const head = new THREE.Mesh(headGeo, parkaMat);
          head.position.set(a, 4.3, 7.8);
          mainGroup.add(head);
        }

        layerGroups.buildings.add(mainGroup);
      }

      // 2. CENTRAL COMMUNICATIONS & METEOROLOGICAL MAST (Photo 2 & Image 3)
      if (layers.sensors) {
        const commsGroup = new THREE.Group();
        const towerHeight = 22;
        const towerSegments = 8;
        const legMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.95, roughness: 0.15 });

        for (let seg = 0; seg < towerSegments; seg++) {
          const yTop = 7.5 + ((seg + 1) * towerHeight) / towerSegments;
          const topSpread = 2.4 * (1 - ((seg + 1) * 0.7) / towerSegments);

          const ringGeo = new THREE.RingGeometry(topSpread * 0.9, topSpread, 4);
          const ringMesh = new THREE.Mesh(ringGeo, legMat);
          ringMesh.rotation.x = -Math.PI / 2;
          ringMesh.rotation.z = Math.PI / 4;
          ringMesh.position.set(0, yTop, 0);
          commsGroup.add(ringMesh);
        }

        const centralMastGeo = new THREE.CylinderGeometry(0.18, 0.28, towerHeight + 4, 16);
        const centralMast = new THREE.Mesh(centralMastGeo, legMat);
        centralMast.position.set(0, 7.5 + (towerHeight + 4) / 2, 0);
        centralMast.castShadow = true;
        (centralMast as any).userData = {
          id: "maitri-central-mast",
          name: "Maitri SATCOM & Atmospheric Telemetry Mast",
          category: "COMMS",
          status: "NORMAL",
          health: "99.4%",
          snr: "16.8 dB",
          frequency: "14.2 GHz (Ku-Band)",
          windSpeed: "28.4 kts (Gust: 41 kts)",
          desc: "High-gain steel communications tower with dual-polarized Yagi arrays, sonic anemometers, riometers, and automated Antarctic satellite downlink transceiver.",
        };
        commsGroup.add(centralMast);
        interactiveMeshes.push(centralMast);

        // Guy Wires
        const guyMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.75 });
        for (let a of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]) {
          const guyGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 24, 0),
            new THREE.Vector3(16 * Math.cos(a), 0.5, 16 * Math.sin(a)),
          ]);
          const guyLine = new THREE.Line(guyGeo, guyMat);
          commsGroup.add(guyLine);
        }

        // Flashing Obstruction Beacon
        const beaconGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const beaconMat = new THREE.MeshStandardMaterial({
          color: 0xef4444,
          emissive: 0xff0000,
          emissiveIntensity: 2.5,
          roughness: 0.1,
        });
        const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
        beaconMesh.position.set(0, 7.5 + towerHeight + 4, 0);
        commsGroup.add(beaconMesh);

        const beaconLight = new THREE.PointLight(0xff2222, 2.0, 30);
        beaconLight.position.set(0, 7.5 + towerHeight + 4, 0);
        commsGroup.add(beaconLight);
        beaconLightRef.current = beaconLight;

        layerGroups.sensors.add(commsGroup);
      }

      // 3. POWERHOUSE & DIESEL GENERATORS (Image 1 CAD & Image 3 Satellite)
      if (layers.power) {
        const powerGroup = new THREE.Group();
        const isFault = faultActive;

        const genGeo = new THREE.BoxGeometry(12, 4.8, 8.0);
        const genMat = getMaterial(
          isFault ? 0xef4444 : 0x2563eb,
          isFault ? 88.4 : 58.6,
          0.6,
          0.3,
          isFault ? 0x7f1d1d : 0x000000
        );
        const genBlock = new THREE.Mesh(genGeo, genMat);
        genBlock.position.set(-24, 3.4, 2);
        genBlock.castShadow = true;
        (genBlock as any).userData = {
          id: "maitri-gen-02",
          name: "Diesel Generator Powerhouse (3x 125 kVA Kirloskar/Cummins)",
          category: "POWER",
          status: isFault ? "CRITICAL" : "NORMAL",
          health: isFault ? "62%" : "96.4%",
          temp: isFault ? "88.4°C (ANOMALY)" : "58.6°C",
          vibration: isFault ? "5.42 mm/s (HIGH)" : "1.82 mm/s",
          output: "96.2 kW",
          fuelFlow: "24.5 L/hr",
          desc: "Central microgrid electrical powerhouse. Runs on Aviation Kerosene (Jet A-1) with dual-redundant exhaust heat recovery supplying hydronic heating loops.",
        };
        powerGroup.add(genBlock);
        interactiveMeshes.push(genBlock);

        for (let s = 0; s < 3; s++) {
          const stackGeo = new THREE.CylinderGeometry(0.2, 0.25, 4.5, 16);
          const stackMat = new THREE.MeshStandardMaterial({
            color: s === 1 && isFault ? 0xef4444 : 0x64748b,
            metalness: 0.9,
            roughness: 0.2,
          });
          const stack = new THREE.Mesh(stackGeo, stackMat);
          stack.position.set(-27 + s * 3.0, 7.5, 4.5);
          stack.castShadow = true;
          powerGroup.add(stack);
        }

        const transGeo = new THREE.BoxGeometry(3.2, 2.4, 2.2);
        const transMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.4 });
        const trans = new THREE.Mesh(transGeo, transMat);
        trans.position.set(-17.5, 1.8, 2);
        powerGroup.add(trans);

        const solarGroup = new THREE.Group();
        for (let pv = 0; pv < 3; pv++) {
          const pvGeo = new THREE.BoxGeometry(4.5, 0.15, 2.4);
          const pvMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            map: proceduralTextures.solar,
            roughness: 0.1,
            metalness: 0.9,
          });
          const pvPanel = new THREE.Mesh(pvGeo, pvMat);
          pvPanel.rotation.x = -0.55;
          pvPanel.position.set(-22 + pv * 5.2, 1.8, 14);
          pvPanel.castShadow = true;
          solarGroup.add(pvPanel);
        }
        (solarGroup as any).userData = {
          id: "maitri-solar-array-01",
          name: "High-Efficiency Polar Solar PV Array (25 kWp)",
          category: "ENERGY",
          status: "NORMAL",
          health: "97.8%",
          output: "18.4 kW",
          efficiency: "21.6%",
          desc: "Bifacial solar photovoltaic string designed for high Antarctic albedo snow reflection capture.",
        };
        powerGroup.add(solarGroup);
        interactiveMeshes.push(solarGroup as any);

        layerGroups.power.add(powerGroup);
      }

      // 4. BULK POL FUEL FARM & DRUM DEPOT (Image 3 Satellite Reference)
      if (layers.power) {
        const fuelGroup = new THREE.Group();

        for (let t = 0; t < 4; t++) {
          const tankGeo = new THREE.CylinderGeometry(2.4, 2.4, 4.2, 24);
          const tankMat = getMaterial(0xd1d5db, -8.0, 0.8, 0.25);
          const tank = new THREE.Mesh(tankGeo, tankMat);
          const tx = 20 + (t % 2) * 6.5;
          const tz = -10 - Math.floor(t / 2) * 6.5;
          tank.position.set(tx, 2.5, tz);
          tank.castShadow = true;
          (tank as any).userData = {
            id: `maitri-fuel-tank-0${t + 1}`,
            name: `POL Fuel Bulk Tank 0${t + 1} (Jet A-1 / Arctic Kerosene)`,
            category: "FUEL",
            status: "NORMAL",
            health: "99.0%",
            capacity: "50,000 Litres",
            currentLevel: `${(84 - t * 4).toFixed(1)}% (Nominal)`,
            temp: "-8.4°C",
            desc: "Double-walled insulated polar petroleum storage tank equipped with hydrostatic level gauges, automated leak detection, and trace heating.",
          };
          fuelGroup.add(tank);
          interactiveMeshes.push(tank);

          const catwalkGeo = new THREE.RingGeometry(2.2, 2.6, 24);
          const catwalkMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
          const catwalk = new THREE.Mesh(catwalkGeo, catwalkMat);
          catwalk.rotation.x = -Math.PI / 2;
          catwalk.position.set(tx, 4.65, tz);
          fuelGroup.add(catwalk);
        }

        const bundGeo = new THREE.BoxGeometry(16, 0.8, 16);
        const bundMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.85 });
        const bund = new THREE.Mesh(bundGeo, bundMat);
        bund.position.set(23, 0.4, -13);
        fuelGroup.add(bund);

        const fuelPipeCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(20, 1.2, -10),
          new THREE.Vector3(5, 1.2, -6),
          new THREE.Vector3(-12, 1.4, -2),
          new THREE.Vector3(-22, 1.8, 2),
        ]);
        const fuelPipeGeo = new THREE.TubeGeometry(fuelPipeCurve, 40, 0.18, 12, false);
        const fuelPipeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 });
        const fuelPipe = new THREE.Mesh(fuelPipeGeo, fuelPipeMat);
        fuelGroup.add(fuelPipe);

        layerGroups.power.add(fuelGroup);
      }

      // 5. LAKE PRIYADARSHINI PUMPHOUSE & HEATED OVERLAND PIPELINE (Image 3 Satellite)
      if (layers.buildings) {
        const waterGroup = new THREE.Group();

        const pumpGeo = new THREE.BoxGeometry(5.2, 3.4, 4.4);
        const pumpMat = getMaterial(0x0284c7, 6.4, 0.4, 0.4);
        const pumpBlock = new THREE.Mesh(pumpGeo, pumpMat);
        pumpBlock.position.set(-38, 2.2, -22);
        pumpBlock.castShadow = true;
        (pumpBlock as any).userData = {
          id: "maitri-water-01",
          name: "Lake Priyadarshini Glacier Water Pumphouse",
          category: "WATER",
          status: "NORMAL",
          health: "98.8%",
          temp: "6.4°C (Trace Heated)",
          flowRate: "18.2 L/min",
          lakeIceDepth: "1.85 m",
          desc: "Automated glacier melt freshwater intake system with submersible multi-stage pumps, automated UV sterilization, and heated supply line.",
        };
        waterGroup.add(pumpBlock);
        interactiveMeshes.push(pumpBlock);

        const waterPipeCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-38, 1.8, -22),
          new THREE.Vector3(-24, 2.4, -12),
          new THREE.Vector3(-10, 3.2, -5),
          new THREE.Vector3(0, 3.8, 0),
        ]);
        const waterPipeGeo = new THREE.TubeGeometry(waterPipeCurve, 48, 0.24, 16, false);
        const waterPipeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.2 });
        const waterPipeline = new THREE.Mesh(waterPipeGeo, waterPipeMat);
        waterGroup.add(waterPipeline);

        for (let i = 1; i <= 6; i++) {
          const pt = waterPipeCurve.getPoint(i / 7);
          const pierGeo = new THREE.CylinderGeometry(0.12, 0.15, pt.y, 8);
          const pierMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
          const pier = new THREE.Mesh(pierGeo, pierMat);
          pier.position.set(pt.x, pt.y / 2, pt.z);
          waterGroup.add(pier);
        }

        layerGroups.buildings.add(waterGroup);
      }

      // 6. LOGISTICS CONTAINER DEPOT & PISTENBULLY VEHICLE (Images 1 & 3)
      if (layers.buildings) {
        const logisticsGroup = new THREE.Group();

        // 20ft ISO Shipping Containers (Orange, Marine Blue, Grey)
        const containerColors = [0xd97706, 0x1e3a8a, 0xd97706, 0x1e3a8a, 0x334155];
        for (let c = 0; c < 5; c++) {
          const cGeo = new THREE.BoxGeometry(5.8, 2.5, 2.4);
          const cMat = new THREE.MeshStandardMaterial({
            color: containerColors[c],
            roughness: 0.45,
            metalness: 0.4,
          });
          const cont = new THREE.Mesh(cGeo, cMat);
          const cx = 22 + (c % 2) * 6.2;
          const cz = 6 + Math.floor(c / 2) * 3.6;
          cont.position.set(cx, 1.3, cz);
          cont.castShadow = true;
          (cont as any).userData = {
            id: `maitri-container-0${c + 1}`,
            name: `Polar Expedition Logistic Container 0${c + 1}`,
            category: "LOGISTICS",
            status: "NORMAL",
            health: "100%",
            cargo: c === 0 ? "Winter Rations & Freeze-Dried Provisions" : "Drill Spares & Engine Overhaul Kit",
            temp: "-4.2°C",
            desc: "20ft ISO thermally insulated sea container retrofitted for polar deep freeze storage.",
          };
          logisticsGroup.add(cont);
          interactiveMeshes.push(cont);
        }

        // PistenBully PB300 Snow Groomer
        const vehicleGroup = new THREE.Group();
        const cabGeo = new THREE.BoxGeometry(3.8, 2.2, 2.6);
        const cabMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.6 });
        const cab = new THREE.Mesh(cabGeo, cabMat);
        cab.position.set(0, 1.8, 0);
        vehicleGroup.add(cab);

        const wsGeo = new THREE.PlaneGeometry(1.8, 1.0);
        const wsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.95 });
        const ws = new THREE.Mesh(wsGeo, wsMat);
        ws.rotation.y = Math.PI / 2;
        ws.position.set(1.91, 2.0, 0);
        vehicleGroup.add(ws);

        const trackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9, metalness: 0.2 });
        for (let tz of [-1.5, 1.5]) {
          const trGeo = new THREE.BoxGeometry(4.6, 0.9, 0.7);
          const tr = new THREE.Mesh(trGeo, trackMat);
          tr.position.set(0, 0.5, tz);
          vehicleGroup.add(tr);
        }

        const bladeGeo = new THREE.BoxGeometry(0.3, 1.2, 3.4);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.set(2.6, 0.8, 0);
        vehicleGroup.add(blade);

        vehicleGroup.position.set(8, 0, 18);
        vehicleGroup.rotation.y = -0.4;
        (vehicleGroup as any).userData = {
          id: "maitri-snowcat-pb300",
          name: "Kässbohrer PistenBully PB300 Polar Snowcat",
          category: "VEHICLE",
          status: "PARKED_OPERATIONAL",
          health: "98.2%",
          fuel: "91% (POL Jet A-1)",
          engineHours: "1,240 hrs",
          desc: "Heavy-duty tracked snow groomer and crevasse rescue convoy vehicle equipped with GPS navigation and differential lock.",
        };
        logisticsGroup.add(vehicleGroup);
        interactiveMeshes.push(vehicleGroup as any);

        layerGroups.buildings.add(logisticsGroup);
      }
    } else {
      // -------------------------------------------------------------
      // BHARATI RESEARCH STATION (ACCURATE TO 5 GROUND-TRUTH PHOTOS)
      // -------------------------------------------------------------
      if (layers.buildings) {
        const bharatiGroup = new THREE.Group();

        const hullGeo = new THREE.BoxGeometry(34, 6.2, 19);
        const hullMat = getMaterial(
          0xd1d5db,
          22.4,
          0.8,
          0.25,
          0x000000,
          proceduralTextures.metal
        );
        const hull = new THREE.Mesh(hullGeo, hullMat);
        hull.position.set(0, 6.6, 0);
        hull.castShadow = true;
        hull.receiveShadow = true;
        (hull as any).userData = {
          id: "bharati-main-complex",
          name: "Bharati Station Aerodynamic Cantilevered Superstructure",
          category: "STRUCTURE",
          status: "NORMAL",
          health: "99.6%",
          temp: "22.4°C",
          humidity: "40%",
          occupancy: "47 Expedition Scientists & Crew",
          desc: "State-of-the-art 3-storey aerodynamic station constructed from 134 modular ISO container units encased in an insulated aluminum-zinc envelope with wrap-around ribbon observation windows.",
        };
        bharatiGroup.add(hull);
        interactiveMeshes.push(hull);

        const noseGeo = new THREE.CylinderGeometry(9.5, 9.5, 6.2, 4);
        const noseMat = getMaterial(0xc5cbce, 22.0, 0.75, 0.3);
        const noseWest = new THREE.Mesh(noseGeo, noseMat);
        noseWest.rotation.y = Math.PI / 4;
        noseWest.position.set(-17, 6.6, 0);
        noseWest.castShadow = true;
        bharatiGroup.add(noseWest);

        const noseEast = new THREE.Mesh(noseGeo, noseMat);
        noseEast.rotation.y = Math.PI / 4;
        noseEast.position.set(17, 6.6, 0);
        noseEast.castShadow = true;
        bharatiGroup.add(noseEast);

        const stiltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.95, roughness: 0.2 });
        const footPadMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6, roughness: 0.7 });

        for (let x of [-13, -6.5, 0, 6.5, 13]) {
          for (let z of [-7.5, 7.5]) {
            const footGeo = new THREE.BoxGeometry(1.6, 0.6, 1.6);
            const foot = new THREE.Mesh(footGeo, footPadMat);
            foot.position.set(x, 0.3, z);
            foot.receiveShadow = true;
            bharatiGroup.add(foot);

            const vLegGeo = new THREE.CylinderGeometry(0.24, 0.24, 4.2, 12);
            const vLeg1 = new THREE.Mesh(vLegGeo, stiltMat);
            vLeg1.rotation.z = 0.22;
            vLeg1.position.set(x - 0.4, 1.8, z);
            vLeg1.castShadow = true;
            bharatiGroup.add(vLeg1);

            const vLeg2 = new THREE.Mesh(vLegGeo, stiltMat);
            vLeg2.rotation.z = -0.22;
            vLeg2.position.set(x + 0.4, 1.8, z);
            vLeg2.castShadow = true;
            bharatiGroup.add(vLeg2);
          }
        }

        const lowerRibbonGeo = new THREE.BoxGeometry(34.2, 1.4, 19.2);
        const lowerRibbonMat = new THREE.MeshStandardMaterial({
          color: lighting === "NIGHT" || lighting === "TWILIGHT" ? 0xfef08a : 0x0f172a,
          emissive: lighting === "NIGHT" || lighting === "TWILIGHT" ? 0xf59e0b : 0x000000,
          emissiveIntensity: lighting === "NIGHT" ? 1.6 : lighting === "TWILIGHT" ? 1.2 : 0.0,
          roughness: 0.1,
          metalness: 0.95,
        });
        const lowerRibbon = new THREE.Mesh(lowerRibbonGeo, lowerRibbonMat);
        lowerRibbon.position.set(0, 5.5, 0);
        bharatiGroup.add(lowerRibbon);

        const cabinWindowMat = new THREE.MeshStandardMaterial({
          color: lighting === "NIGHT" || lighting === "TWILIGHT" ? 0xfde047 : 0x0284c7,
          emissive: lighting === "NIGHT" || lighting === "TWILIGHT" ? 0xeab308 : 0x000000,
          emissiveIntensity: lighting === "NIGHT" ? 1.8 : lighting === "TWILIGHT" ? 1.3 : 0.0,
          roughness: 0.1,
          metalness: 0.9,
        });

        for (let wx = -14; wx <= 14; wx += 2.8) {
          const winGeo = new THREE.PlaneGeometry(1.4, 0.95);
          const winFront = new THREE.Mesh(winGeo, cabinWindowMat);
          winFront.position.set(wx, 8.0, 9.55);
          bharatiGroup.add(winFront);

          const winRear = new THREE.Mesh(winGeo, cabinWindowMat);
          winRear.rotation.y = Math.PI;
          winRear.position.set(wx, 8.0, -9.55);
          bharatiGroup.add(winRear);
        }

        const obsWindowGeo = new THREE.PlaneGeometry(7.5, 3.8);
        const obsWindow = new THREE.Mesh(obsWindowGeo, lowerRibbonMat);
        obsWindow.rotation.y = -Math.PI / 2;
        obsWindow.position.set(-17.05, 6.8, 0);
        bharatiGroup.add(obsWindow);

        const flagGeo = new THREE.PlaneGeometry(3.8, 2.0);
        const flagMat = new THREE.MeshBasicMaterial({ map: proceduralTextures.tricolor, side: THREE.DoubleSide });
        const flag = new THREE.Mesh(flagGeo, flagMat);
        flag.position.set(-11, 7.8, 9.56);
        bharatiGroup.add(flag);

        const cupolaGeo = new THREE.CylinderGeometry(7.5, 9.5, 2.8, 4);
        const cupolaMat = getMaterial(0x94a3b8, 17.5, 0.7, 0.25);
        const cupola = new THREE.Mesh(cupolaGeo, cupolaMat);
        cupola.rotation.y = Math.PI / 4;
        cupola.position.set(0, 11.0, 0);
        cupola.castShadow = true;
        (cupola as any).userData = {
          id: "bharati-roof-observatory",
          name: "Bharati Upper Atmospheric & Meteorologic Penthouse",
          category: "METEOROLOGY",
          status: "NORMAL",
          health: "100%",
          temp: "17.5°C",
          desc: "Raised central bevelled cupola housing all-sky aurora imaging sensors, precision meteorological pyranometers, ozone spectroradiometers, and skylight observation terraces.",
        };
        bharatiGroup.add(cupola);
        interactiveMeshes.push(cupola);

        const railMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.2 });
        const roofRailGeo = new THREE.BoxGeometry(32, 0.9, 17);
        const roofRail = new THREE.Mesh(roofRailGeo, railMat);
        roofRail.position.set(0, 10.1, 0);
        bharatiGroup.add(roofRail);

        const solarGroup = new THREE.Group();
        for (let sp = 0; sp < 4; sp++) {
          const spGeo = new THREE.BoxGeometry(5.2, 0.15, 3.2);
          const spMat = new THREE.MeshStandardMaterial({
            map: proceduralTextures.solar,
            roughness: 0.1,
            metalness: 0.9,
          });
          const spPanel = new THREE.Mesh(spGeo, spMat);
          spPanel.rotation.x = -0.3;
          spPanel.position.set(-10 + sp * 6.5, 10.0, -5.5);
          solarGroup.add(spPanel);
        }
        (solarGroup as any).userData = {
          id: "bharati-solar-array",
          name: "Bharati Polar Rooftop Bifacial PV Solar Strings (40 kWp)",
          category: "ENERGY",
          status: "NORMAL",
          health: "99.1%",
          output: "28.6 kW",
          efficiency: "22.4%",
          desc: "High-efficiency rooftop bifacial solar PV modules capturing high polar direct insolation and albedo snow reflection.",
        };
        bharatiGroup.add(solarGroup);
        interactiveMeshes.push(solarGroup as any);

        const doorGeo = new THREE.PlaneGeometry(4.5, 3.2);
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
        const door = new THREE.Mesh(doorGeo, doorMat);
        door.position.set(-2, 1.8, 9.55);
        bharatiGroup.add(door);

        const stairGeo = new THREE.BoxGeometry(2.2, 0.2, 5.5);
        const stair = new THREE.Mesh(stairGeo, stiltMat);
        stair.rotation.x = -0.55;
        stair.position.set(5.5, 1.8, 11.2);
        bharatiGroup.add(stair);

        layerGroups.buildings.add(bharatiGroup);
      }

      // ISRO IMGEOS RADOMES
      if (layers.sensors) {
        const radomeGroup = new THREE.Group();

        const primaryDomeGeo = new THREE.SphereGeometry(4.8, 32, 24);
        const primaryDomeMat = new THREE.MeshStandardMaterial({
          map: proceduralTextures.geodesic,
          color: lighting === "TWILIGHT" ? 0xffedd5 : 0xffffff,
          roughness: 0.25,
          metalness: 0.15,
        });
        const primaryDome = new THREE.Mesh(primaryDomeGeo, primaryDomeMat);
        primaryDome.position.set(22, 11.2, 4);
        primaryDome.castShadow = true;
        (primaryDome as any).userData = {
          id: "bharati-isro-imgeos",
          name: "ISRO IMGEOS Polar Satellite Earth Ground Station (7.5m Radome)",
          category: "COMMS",
          status: "NORMAL",
          health: "99.8%",
          snr: "19.2 dB (X-Band / S-Band)",
          frequency: "8.2 GHz Direct Orbit Downlink",
          targetSatellite: "Cartosat-3 / EOS-06 / RISAT-2BR1",
          desc: "Primary National Remote Sensing Centre (NRSC) / ISRO deep-space Earth Observation polar ground terminal receiving real-time multi-spectral satellite imagery and polar ocean telemetry.",
        };
        radomeGroup.add(primaryDome);
        interactiveMeshes.push(primaryDome);

        const baseRingGeo = new THREE.CylinderGeometry(4.5, 4.8, 4.0, 16, 2, true);
        const baseRingMat = new THREE.MeshStandardMaterial({
          color: 0xd1d5db,
          metalness: 0.9,
          roughness: 0.2,
          wireframe: true,
        });
        const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
        baseRing.position.set(22, 5.0, 4);
        baseRing.castShadow = true;
        radomeGroup.add(baseRing);

        const beaconGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const beaconMat = new THREE.MeshStandardMaterial({
          color: 0xef4444,
          emissive: 0xff0000,
          emissiveIntensity: 2.5,
          roughness: 0.1,
        });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.set(22, 16.2, 4);
        radomeGroup.add(beacon);

        const beaconLight = new THREE.PointLight(0xff2222, 2.2, 35);
        beaconLight.position.set(22, 16.2, 4);
        radomeGroup.add(beaconLight);
        beaconLightRef.current = beaconLight;

        const secDomeGeo = new THREE.SphereGeometry(3.2, 24, 18);
        const secDomeMat = new THREE.MeshStandardMaterial({
          color: 0xf8fafc,
          roughness: 0.3,
          metalness: 0.1,
        });
        const secDome = new THREE.Mesh(secDomeGeo, secDomeMat);
        secDome.position.set(34, 8.5, -4);
        secDome.castShadow = true;
        (secDome as any).userData = {
          id: "bharati-isro-secondary",
          name: "Bharati Secondary Inmarsat / SATCOM Radome (4.5m)",
          category: "COMMS",
          status: "NORMAL",
          health: "100%",
          snr: "16.8 dB",
          desc: "High-reliability dual-redundant satellite transceiver linking Bharati Station to NCPOR Headquarters (Goa) and National Disaster Management grids.",
        };
        radomeGroup.add(secDome);
        interactiveMeshes.push(secDome);

        const secRingGeo = new THREE.CylinderGeometry(3.0, 3.2, 3.2, 12, 1, true);
        const secRing = new THREE.Mesh(secRingGeo, baseRingMat);
        secRing.position.set(34, 4.0, -4);
        radomeGroup.add(secRing);

        layerGroups.sensors.add(radomeGroup);
      }

      // UTILITY GANTRY
      if (layers.power) {
        const gantryGroup = new THREE.Group();
        const gantryCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(14, 2.8, 6),
          new THREE.Vector3(20, 2.6, 2),
          new THREE.Vector3(26, 2.4, -6),
          new THREE.Vector3(18, 2.0, -18),
          new THREE.Vector3(6, 1.8, -14),
          new THREE.Vector3(-8, 1.6, -10),
        ]);

        const gantryGeo = new THREE.TubeGeometry(gantryCurve, 64, 0.45, 8, false);
        const gantryMat = new THREE.MeshStandardMaterial({
          color: 0x94a3b8,
          metalness: 0.85,
          roughness: 0.3,
          wireframe: true,
        });
        const gantry = new THREE.Mesh(gantryGeo, gantryMat);
        (gantry as any).userData = {
          id: "bharati-utility-gantry",
          name: "Elevated Overland Steel Utility Gantry & Heated Conduits",
          category: "POWER",
          status: "NORMAL",
          health: "99.0%",
          temp: "26.4°C (Trace Heated)",
          flowRate: "42.0 L/min",
          desc: "Insulated steel lattice utility bridge carrying Jet A-1 fuel supply lines, hydronic heating loops, reverse-osmosis potable water, and 415V power distribution busbars.",
        };
        gantryGroup.add(gantry);
        interactiveMeshes.push(gantry);

        const fuelPipeGeo = new THREE.TubeGeometry(gantryCurve, 64, 0.16, 8, false);
        const fuelPipeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
        const fuelPipe = new THREE.Mesh(fuelPipeGeo, fuelPipeMat);
        fuelPipe.position.y = 0.3;
        gantryGroup.add(fuelPipe);

        const waterPipeGeo = new THREE.TubeGeometry(gantryCurve, 64, 0.16, 8, false);
        const waterPipeMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.9, roughness: 0.2 });
        const waterPipe = new THREE.Mesh(waterPipeGeo, waterPipeMat);
        waterPipe.position.y = -0.3;
        gantryGroup.add(waterPipe);

        for (let p = 1; p <= 8; p++) {
          const pt = gantryCurve.getPoint(p / 9);
          const pierGeo = new THREE.CylinderGeometry(0.15, 0.18, pt.y, 8);
          const pierMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
          const pier = new THREE.Mesh(pierGeo, pierMat);
          pier.position.set(pt.x, pt.y / 2, pt.z);
          gantryGroup.add(pier);
        }

        layerGroups.power.add(gantryGroup);
      }

      // CONTAINERS & EXCAVATOR & VESSEL
      if (layers.buildings) {
        const depotGroup = new THREE.Group();
        const containerColors = [0x991b1b, 0x1e3a8a, 0x991b1b, 0x1e3a8a, 0x334155, 0x1e3a8a, 0x991b1b];
        for (let c = 0; c < 7; c++) {
          const cGeo = new THREE.BoxGeometry(6.0, 2.6, 2.5);
          const cMat = new THREE.MeshStandardMaterial({
            color: containerColors[c],
            roughness: 0.4,
            metalness: 0.5,
          });
          const cont = new THREE.Mesh(cGeo, cMat);
          const cx = -14 + (c % 3) * 6.5;
          const cz = -18 - Math.floor(c / 3) * 3.8;
          cont.position.set(cx, 1.4, cz);
          cont.castShadow = true;
          (cont as any).userData = {
            id: `bharati-container-0${c + 1}`,
            name: `Bharati Logistics Sea Container 0${c + 1}`,
            category: "LOGISTICS",
            status: "NORMAL",
            health: "100%",
            cargo: c % 2 === 0 ? "Polar Geological Core Samples & Drill Bits" : "Hydronic Spare Valves & Winter Rations",
            temp: "-5.6°C",
            desc: "ISO 20ft insulated cargo container staged in the northern logistics yard.",
          };
          depotGroup.add(cont);
          interactiveMeshes.push(cont);
        }

        const trailerGroup = new THREE.Group();
        const tFrameGeo = new THREE.BoxGeometry(7.2, 0.4, 2.2);
        const tFrameMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.8, roughness: 0.3 });
        const tFrame = new THREE.Mesh(tFrameGeo, tFrameMat);
        tFrame.position.set(0, 0.8, 0);
        trailerGroup.add(tFrame);

        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
        for (let wx of [-2.4, -1.2, 1.2, 2.4]) {
          for (let wz of [-1.15, 1.15]) {
            const wGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.3, 16);
            const wheel = new THREE.Mesh(wGeo, wheelMat);
            wheel.rotation.x = Math.PI / 2;
            wheel.position.set(wx, 0.4, wz);
            trailerGroup.add(wheel);
          }
        }
        trailerGroup.position.set(6, 0.2, 14);
        trailerGroup.rotation.y = 0.15;
        depotGroup.add(trailerGroup);
        layerGroups.buildings.add(depotGroup);

        const machineryGroup = new THREE.Group();
        const excGroup = new THREE.Group();
        const trackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
        for (let tz of [-1.2, 1.2]) {
          const tGeo = new THREE.BoxGeometry(4.2, 0.8, 0.6);
          const tMesh = new THREE.Mesh(tGeo, trackMat);
          tMesh.position.set(0, 0.4, tz);
          excGroup.add(tMesh);
        }

        const catYellowMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.6, roughness: 0.35 });
        const excCabGeo = new THREE.BoxGeometry(3.0, 1.8, 2.2);
        const excCab = new THREE.Mesh(excCabGeo, catYellowMat);
        excCab.position.set(0, 1.7, 0);
        excCab.castShadow = true;
        excGroup.add(excCab);

        const cabGlassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.95 });
        const cabGlassGeo = new THREE.BoxGeometry(1.2, 1.4, 0.9);
        const cabGlass = new THREE.Mesh(cabGlassGeo, cabGlassMat);
        cabGlass.position.set(0.8, 1.8, 0.55);
        excGroup.add(cabGlass);

        const boomGeo = new THREE.BoxGeometry(3.6, 0.45, 0.45);
        const boom = new THREE.Mesh(boomGeo, catYellowMat);
        boom.rotation.z = -0.55;
        boom.position.set(2.4, 2.5, 0);
        excGroup.add(boom);

        const armGeo = new THREE.BoxGeometry(2.4, 0.35, 0.35);
        const arm = new THREE.Mesh(armGeo, catYellowMat);
        arm.rotation.z = 0.8;
        arm.position.set(4.2, 2.6, 0);
        excGroup.add(arm);

        const bucketGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        const bucketMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.3 });
        const bucket = new THREE.Mesh(bucketGeo, bucketMat);
        bucket.position.set(4.8, 1.3, 0);
        excGroup.add(bucket);

        excGroup.position.set(-6, 0.1, 14);
        excGroup.rotation.y = 0.45;
        (excGroup as any).userData = {
          id: "bharati-excavator",
          name: "CAT 320D Polar Hydraulic Crawler Excavator",
          category: "VEHICLE",
          status: "OPERATIONAL",
          health: "98.4%",
          fuel: "84% (Polar Diesel Jet A-1)",
          engineHours: "840 hrs",
          desc: "Heavy-duty snow clearing, trenching, and container staging hydraulic excavator winterized for -50°C Antarctic operations with pre-heated hydraulic oil reservoirs.",
        };
        machineryGroup.add(excGroup);
        interactiveMeshes.push(excGroup as any);

        const pbGroup = new THREE.Group();
        const pbCabGeo = new THREE.BoxGeometry(3.6, 2.0, 2.4);
        const pbCabMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35, metalness: 0.5 });
        const pbCab = new THREE.Mesh(pbCabGeo, pbCabMat);
        pbCab.position.set(0, 1.7, 0);
        pbGroup.add(pbCab);

        const pbBladeGeo = new THREE.BoxGeometry(0.3, 1.1, 3.2);
        const pbBladeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
        const pbBlade = new THREE.Mesh(pbBladeGeo, pbBladeMat);
        pbBlade.position.set(2.4, 0.7, 0);
        pbGroup.add(pbBlade);

        for (let pz of [-1.3, 1.3]) {
          const ptGeo = new THREE.BoxGeometry(4.2, 0.8, 0.6);
          const ptMesh = new THREE.Mesh(ptGeo, trackMat);
          ptMesh.position.set(0, 0.4, pz);
          pbGroup.add(ptMesh);
        }

        pbGroup.position.set(-18, 0.1, 8);
        pbGroup.rotation.y = -0.3;
        (pbGroup as any).userData = {
          id: "bharati-snowcat",
          name: "Kässbohrer PistenBully Polar Snow Groomer",
          category: "VEHICLE",
          status: "STANDBY",
          health: "99.0%",
          fuel: "92%",
          desc: "High-traction tracked vehicle maintaining the Helipad runway and safe convoy transit corridors through the Larsemann Hills.",
        };
        machineryGroup.add(pbGroup);
        interactiveMeshes.push(pbGroup as any);
        layerGroups.buildings.add(machineryGroup);

        const shipGroup = new THREE.Group();
        const shipHullGeo = new THREE.BoxGeometry(46, 8.5, 12);
        const shipHullMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.6 });
        const shipHull = new THREE.Mesh(shipHullGeo, shipHullMat);
        shipHull.position.set(0, 0, 0);
        shipHull.castShadow = true;
        shipGroup.add(shipHull);

        const bowGeo = new THREE.ConeGeometry(6.0, 9.0, 4);
        const bow = new THREE.Mesh(bowGeo, shipHullMat);
        bow.rotation.z = Math.PI / 2;
        bow.rotation.y = Math.PI / 4;
        bow.position.set(26, 0, 0);
        shipGroup.add(bow);

        const bridgeGeo = new THREE.BoxGeometry(14, 8.0, 10.5);
        const bridgeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.4 });
        const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
        bridge.position.set(-12, 7.5, 0);
        bridge.castShadow = true;
        shipGroup.add(bridge);

        const craneMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.8, roughness: 0.3 });
        for (let cr of [2, 14]) {
          const cranePostGeo = new THREE.CylinderGeometry(0.4, 0.4, 6.0, 8);
          const cranePost = new THREE.Mesh(cranePostGeo, craneMat);
          cranePost.position.set(cr, 6.0, 0);
          shipGroup.add(cranePost);

          const craneJibGeo = new THREE.BoxGeometry(8.0, 0.35, 0.35);
          const craneJib = new THREE.Mesh(craneJibGeo, craneMat);
          craneJib.rotation.z = 0.45;
          craneJib.position.set(cr + 3.2, 8.5, 0);
          shipGroup.add(craneJib);
        }

        shipGroup.position.set(-15, -2.8, -75);
        shipGroup.rotation.y = 0.18;
        (shipGroup as any).userData = {
          id: "bharati-vessel-golovnin",
          name: "Chartered Polar Expedition Resupply Vessel (MV Vasiliy Golovnin / Ivan Papanin)",
          category: "LOGISTICS",
          status: "MOORED_ON_FAST_ICE",
          health: "100%",
          cargoTransferRate: "85 MT/hr",
          fuelDischarge: "320 m³ Jet A-1",
          desc: "Chartered ice-class cargo vessel equipped with 45-ton twin heavy cranes, helicopter landing deck, and bulk fuel discharge manifold supplying the annual Indian Antarctic Expedition.",
        };
        interactiveMeshes.push(shipGroup as any);
        layerGroups.buildings.add(shipGroup);
      }
    }

    // -------------------------------------------------------------
    // 7. CCTV CONE
    // -------------------------------------------------------------
    if (showCctvFov) {
      const coneGeo = new THREE.ConeGeometry(18, 38, 24, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.18,
        wireframe: false,
        side: THREE.DoubleSide,
      });
      const cctvCone = new THREE.Mesh(coneGeo, coneMat);
      cctvCone.position.set(0, 16, 6);
      cctvCone.rotation.x = Math.PI / 2.6;
      cctvCone.rotation.y = 0.4;
      scene.add(cctvCone);
      cctvConeRef.current = cctvCone;
    }

    // -------------------------------------------------------------
    // 8. SNOW PARTICLES FX
    // -------------------------------------------------------------
    const particleCount = lighting === "BLIZZARD" ? 4800 : 1800;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 190;
      particlePositions[p * 3 + 1] = Math.random() * 65;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 190;

      const speedFactor = lighting === "BLIZZARD" ? 2.5 : 1.0;
      particleVelocities.push({
        x: (-0.9 - Math.random() * 1.8) * speedFactor,
        y: (-0.4 - Math.random() * 0.7) * speedFactor,
        z: (Math.random() - 0.5) * 0.5 * speedFactor,
      });
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: lighting === "BLIZZARD" ? 0.48 : 0.28,
      transparent: true,
      opacity: lighting === "BLIZZARD" ? 0.9 : 0.5,
    });
    const snowParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(snowParticles);
    snowParticlesRef.current = snowParticles;

    interactiveMeshesRef.current = interactiveMeshes;

    // -------------------------------------------------------------
    // 9. RAYCASTING & INTERACTION
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshesRef.current, true);

      if (intersects.length > 0) {
        let hitObj = intersects[0].object as any;
        while (hitObj && !hitObj.userData?.id && hitObj.parent) {
          hitObj = hitObj.parent;
        }

        if (hitObj?.userData?.id) {
          setHoveredAsset(hitObj.userData);
          container.style.cursor = isMeasuring ? "crosshair" : "pointer";
          return;
        }
      }
      setHoveredAsset(null);
      container.style.cursor = isMeasuring ? "crosshair" : isDragging.current ? "grabbing" : "grab";
    };

    const handlePointerDown = (event: MouseEvent) => {
      if (event.button === 0) {
        isDragging.current = true;
        previousMousePosition.current = { x: event.clientX, y: event.clientY };
        isRotatingRef.current = false;
        setIsRotating(false);
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const handleDragMove = (event: MouseEvent) => {
      if (!isDragging.current || !cameraRef.current) return;
      const deltaX = event.clientX - previousMousePosition.current.x;
      const deltaY = event.clientY - previousMousePosition.current.y;
      previousMousePosition.current = { x: event.clientX, y: event.clientY };

      cameraSpherical.current.theta -= deltaX * 0.005;
      cameraSpherical.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.04, cameraSpherical.current.phi - deltaY * 0.005)
      );

      const { radius, theta, phi } = cameraSpherical.current;
      targetCameraPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
      targetCameraPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
      targetCameraPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);

      cameraRef.current.position.copy(targetCameraPos.current);
      currentLookAt.current.copy(targetLookAt.current);
      cameraRef.current.lookAt(currentLookAt.current);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      cameraSpherical.current.radius = Math.max(16, Math.min(130, cameraSpherical.current.radius + event.deltaY * 0.04));
      isRotatingRef.current = false;
      setIsRotating(false);

      if (cameraRef.current) {
        const { radius, theta, phi } = cameraSpherical.current;
        targetCameraPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
        targetCameraPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
        targetCameraPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);

        cameraRef.current.position.copy(targetCameraPos.current);
        currentLookAt.current.copy(targetLookAt.current);
        cameraRef.current.lookAt(currentLookAt.current);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      if (isMeasuring) {
        const allIntersects = raycaster.intersectObjects(scene.children, true);
        if (allIntersects.length > 0) {
          const pt = allIntersects[0].point;
          setMeasurePoints((prev) => {
            if (prev.length >= 2) {
              return [pt];
            } else {
              const next = [...prev, pt];
              if (next.length === 2) {
                const dist = next[0].distanceTo(next[1]);
                setMeasuredDistance(dist);
                if (onMeasureDistance) onMeasureDistance(dist);

                if (measureLineRef.current) scene.remove(measureLineRef.current);
                const lineGeo = new THREE.BufferGeometry().setFromPoints(next);
                const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3 });
                const line = new THREE.Line(lineGeo, lineMat);
                scene.add(line);
                measureLineRef.current = line;
              }
              return next;
            }
          });
        }
        return;
      }

      const intersects = raycaster.intersectObjects(interactiveMeshesRef.current, true);
      if (intersects.length > 0) {
        let hitObj = intersects[0].object as any;
        while (hitObj && !hitObj.userData?.id && hitObj.parent) {
          hitObj = hitObj.parent;
        }

        if (hitObj?.userData?.id) {
          setActiveAsset(hitObj.userData);
          setInspectorAsset(hitObj.userData);
          if (onSelectAsset) onSelectAsset(hitObj.userData);

          const wp = new THREE.Vector3();
          hitObj.getWorldPosition(wp);
          targetLookAt.current.set(wp.x, wp.y + 1, wp.z);
        }
      }
    };

    renderer.domElement.addEventListener("mousemove", handlePointerMove);
    renderer.domElement.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mouseup", handlePointerUp);
    renderer.domElement.addEventListener("mousemove", handleDragMove);
    renderer.domElement.addEventListener("wheel", handleWheel, { passive: false });
    renderer.domElement.addEventListener("click", handleClick);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotatingRef.current) {
        cameraSpherical.current.theta += 0.002;
        const { radius, theta, phi } = cameraSpherical.current;
        targetCameraPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
        targetCameraPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
        targetCameraPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);

        camera.position.lerp(targetCameraPos.current, 0.1);
        currentLookAt.current.lerp(targetLookAt.current, 0.1);
        camera.lookAt(currentLookAt.current);
      } else if (!isDragging.current) {
        if (camera.position.distanceTo(targetCameraPos.current) > 0.02 || currentLookAt.current.distanceTo(targetLookAt.current) > 0.02) {
          camera.position.lerp(targetCameraPos.current, 0.12);
          currentLookAt.current.lerp(targetLookAt.current, 0.12);
          camera.lookAt(currentLookAt.current);
        }
      }

      if (beaconLightRef.current) {
        const t = Date.now() * 0.004;
        const flash = Math.sin(t) > 0.6 ? 3.0 : 0.1;
        beaconLightRef.current.intensity = flash;
      }

      if (snowParticlesRef.current) {
        const positions = snowParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let p = 0; p < particleCount; p++) {
          positions[p * 3] += particleVelocities[p].x;
          positions[p * 3 + 1] += particleVelocities[p].y;
          positions[p * 3 + 2] += particleVelocities[p].z;

          if (positions[p * 3 + 1] < -6) {
            positions[p * 3 + 1] = 60;
            positions[p * 3] = (Math.random() - 0.5) * 190;
            positions[p * 3 + 2] = (Math.random() - 0.5) * 190;
          }
        }
        snowParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (faultActive) {
        const pulse = (Math.sin(Date.now() * 0.008) + 1) * 0.5;
        interactiveMeshesRef.current.forEach((m) => {
          if ((m as any).userData?.id === "maitri-gen-02") {
            const mat = m.material as THREE.MeshStandardMaterial;
            if (mat?.emissive) {
              mat.emissiveIntensity = 0.5 + pulse * 1.5;
            }
          }
        });
      }

      renderer.render(scene, camera);
    };

    // Initial camera position snap (no initial drifting)
    const { radius, theta, phi } = cameraSpherical.current;
    targetCameraPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
    targetCameraPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
    targetCameraPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);
    camera.position.copy(targetCameraPos.current);
    currentLookAt.current.copy(targetLookAt.current);
    camera.lookAt(currentLookAt.current);

    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mouseup", handlePointerUp);
      cancelAnimationFrame(animationFrameId);
      renderer.domElement.removeEventListener("mousemove", handlePointerMove);
      renderer.domElement.removeEventListener("mousedown", handlePointerDown);
      renderer.domElement.removeEventListener("mousemove", handleDragMove);
      renderer.domElement.removeEventListener("wheel", handleWheel);
      renderer.domElement.removeEventListener("click", handleClick);
      renderer.dispose();
    };
  }, [
    stationId,
    lighting,
    visual,
    faultActive,
    isMeasuring,
    sectionCutActive,
    sectionCutHeight,
    showCctvFov,
    layers,
    proceduralTextures,
  ]);

  const setPreset = (preset: string) => {
    setCameraView(preset);
    setIsRotating(false);

    const norm = preset.toUpperCase().trim();

    if (norm === "OVERVIEW" || norm === "ISOMETRIC") {
      targetLookAt.current.set(0, 3.5, 0);
      cameraSpherical.current = { radius: 65, theta: Math.PI / 3.4, phi: Math.PI / 3.2 };
    } else if (norm === "TOP SLS" || norm === "TOP") {
      targetLookAt.current.set(0, 0, 0);
      cameraSpherical.current = { radius: 90, theta: 0, phi: 0.08 };
    } else if (norm === "UNDERCROFT STILTS" || norm === "STILTS") {
      targetLookAt.current.set(0, 1.8, 0);
      cameraSpherical.current = { radius: 24, theta: Math.PI / 2.2, phi: Math.PI / 2.1 };
    } else if (norm === "HELIPAD DECK" || norm === "HELIPAD") {
      targetLookAt.current.set(stationId === "maitri" ? -26 : -28, 1.0, stationId === "maitri" ? 16 : -12);
      cameraSpherical.current = { radius: 26, theta: -Math.PI / 3.2, phi: Math.PI / 3.6 };
    } else if (norm === "FACADE") {
      targetLookAt.current.set(0, 5.2, 5.0);
      cameraSpherical.current = { radius: 28, theta: Math.PI / 2, phi: Math.PI / 2.2 };
    } else if (norm === "COURTYARD") {
      targetLookAt.current.set(0, 4.5, -8.0);
      cameraSpherical.current = { radius: 32, theta: -Math.PI / 2, phi: Math.PI / 2.5 };
    } else if (norm === "RADOME") {
      targetLookAt.current.set(22, 11.2, 4);
      cameraSpherical.current = { radius: 24, theta: Math.PI / 2.8, phi: Math.PI / 3.2 };
    } else if (norm === "PIPELINE") {
      targetLookAt.current.set(stationId === "maitri" ? -20 : 16, 2.5, stationId === "maitri" ? -12 : 0);
      cameraSpherical.current = { radius: 26, theta: Math.PI / 4, phi: Math.PI / 3.8 };
    } else if (norm === "BAY & SHIP") {
      targetLookAt.current.set(-15, -2.5, -75);
      cameraSpherical.current = { radius: 55, theta: -Math.PI / 6, phi: Math.PI / 3.6 };
    } else if (norm === "CONTAINERS") {
      targetLookAt.current.set(stationId === "maitri" ? 22 : -8, 1.5, stationId === "maitri" ? 6 : 12);
      cameraSpherical.current = { radius: 28, theta: Math.PI / 2.5, phi: Math.PI / 3.5 };
    } else if (norm === "POWER") {
      targetLookAt.current.set(-24, 3.5, 2);
      cameraSpherical.current = { radius: 26, theta: Math.PI / 3.2, phi: Math.PI / 3.8 };
    } else if (norm === "FUEL") {
      targetLookAt.current.set(23, 2.5, -12);
      cameraSpherical.current = { radius: 28, theta: -Math.PI / 4, phi: Math.PI / 3.5 };
    } else if (norm === "TOWER") {
      targetLookAt.current.set(0, 16, 0);
      cameraSpherical.current = { radius: 32, theta: Math.PI / 4, phi: Math.PI / 4.5 };
    } else if (norm === "LAKE") {
      targetLookAt.current.set(stationId === "maitri" ? -38 : 2, 2.0, stationId === "maitri" ? -22 : 24);
      cameraSpherical.current = { radius: 30, theta: -Math.PI / 2.8, phi: Math.PI / 3.8 };
    } else if (norm === "AERIAL") {
      targetLookAt.current.set(0, 0, 0);
      cameraSpherical.current = { radius: 110, theta: 0, phi: 0.12 };
    }
  };

  useEffect(() => {
    if (propCameraPreset) {
      setPreset(propCameraPreset);
    }
  }, [propCameraPreset]);

  useEffect(() => {
    if (propAutoRotate !== undefined) {
      setIsRotating(propAutoRotate);
    }
  }, [propAutoRotate]);

  const presetButtons =
    stationId === "bharati"
      ? ["OVERVIEW", "FACADE", "RADOME", "HELIPAD", "PIPELINE", "BAY & SHIP", "CONTAINERS", "LAKE", "AERIAL"]
      : ["OVERVIEW", "FACADE", "COURTYARD", "POWER", "FUEL", "TOWER", "HELIPAD", "LAKE", "AERIAL"];

  return (
    <div className="relative w-full h-full min-h-[580px] bg-[#020B14] rounded-2xl overflow-hidden shadow-2xl select-none">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Hover Tooltip */}
      {hoveredAsset && !inspectorAsset && (
        <div className="absolute top-16 left-4 z-30 pointer-events-none bg-[#081528]/95 backdrop-blur-md border border-cyan-400 px-3.5 py-2 rounded-xl shadow-2xl text-xs font-mono animate-in fade-in duration-150 max-w-xs">
          <div className="flex items-center space-x-2 text-cyan-300 font-bold">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="truncate">{hoveredAsset.name}</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-300 mt-1">
            <span>Status: <strong className="text-emerald-400">{hoveredAsset.status}</strong></span>
            {hoveredAsset.temp && <span>Temp: <strong className="text-amber-300">{hoveredAsset.temp}</strong></span>}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Click to view SCADA telemetry &amp; details</div>
        </div>
      )}

      {/* Distance Measurement Badge */}
      {isMeasuring && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-[#081528]/95 backdrop-blur-md border border-cyan-400 px-4 py-2 rounded-xl shadow-2xl text-xs font-mono text-cyan-300 flex items-center space-x-2 animate-in fade-in">
          <Ruler className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span>
            {measuredDistance !== null
              ? `Calculated Real Distance: ${(measuredDistance * 2.5).toFixed(1)} meters`
              : measurePoints.length === 1
              ? "Click 2nd point on station mesh to calculate distance..."
              : "Click any 2 points in the 3D scene to measure distance"}
          </span>
          {measuredDistance !== null && (
            <button
              onClick={() => {
                setMeasurePoints([]);
                setMeasuredDistance(null);
              }}
              className="ml-2 px-1.5 py-0.5 bg-slate-800 text-slate-300 hover:text-white rounded text-[10px]"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {!hideInternalOverlay && (
        <>
          {/* Official Banner */}
          <div className="absolute top-3 left-3 right-3 flex flex-wrap justify-between items-center pointer-events-none gap-2 z-20">
            <div className="flex items-center space-x-2.5 bg-[#081528]/95 backdrop-blur-md border border-[#1E3E62] px-3.5 py-2 rounded-xl text-xs font-mono pointer-events-auto shadow-xl">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-white font-black tracking-wider">
                3D DIGITAL TWIN: {stationId.toUpperCase()} ANTARCTIC RESEARCH STATION
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400 font-bold hidden sm:inline">NCPOR GROUND-TRUTH ENGINE</span>
            </div>

            <div className="flex items-center space-x-1 bg-[#081528]/95 backdrop-blur-md border border-[#1E3E62] p-1 rounded-xl text-xs font-mono pointer-events-auto shadow-xl">
              <button
                onClick={() => setVisual("REALISTIC")}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                  visual === "REALISTIC" ? "bg-cyan-600 text-white font-bold shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>REALISTIC</span>
              </button>
              <button
                onClick={() => setVisual("THERMAL")}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                  visual === "THERMAL" ? "bg-amber-600 text-white font-bold shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                <Thermometer className="h-3.5 w-3.5" />
                <span>THERMAL SCADA</span>
              </button>
            </div>
          </div>

          {/* Camera Presets Toolbar */}
          <div className="absolute bottom-3 left-3 z-20 bg-[#081528]/95 backdrop-blur-md border border-[#1E3E62] p-1.5 rounded-xl flex flex-wrap items-center gap-1 text-xs font-mono shadow-xl pointer-events-auto max-w-[90vw]">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                isRotating ? "bg-cyan-600 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              {isRotating ? "AUTOROTATE: ON" : "AUTOROTATE"}
            </button>

            <span className="text-slate-700">|</span>

            {presetButtons.map((view) => (
              <button
                key={view}
                onClick={() => setPreset(view)}
                className={`px-2 py-1 rounded-lg transition-all text-[11px] ${
                  cameraView === view ? "bg-slate-700 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Asset Inspector SCADA Modal */}
      {inspectorAsset && (
        <AssetInspectorModal
          asset={inspectorAsset}
          onClose={() => setInspectorAsset(null)}
          onActionTrigger={(action, id) => {
            console.log(`SCADA Command triggered for ${id}: ${action}`);
          }}
        />
      )}
    </div>
  );
}
