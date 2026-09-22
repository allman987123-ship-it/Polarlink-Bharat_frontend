export interface WeatherObservation {
  station_id: string;
  station_name: string;
  temperature_c: number;
  feels_like_c: number;
  relative_humidity_pct: number;
  surface_pressure_hpa: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  wind_direction_cardinal: string;
  visibility_km: number;
  solar_radiation_wm2: number;
  weather_condition: string;
  blizzard_risk: string;
  source: string;
  data_type: string;
  connection_status: string;
  last_updated: string;
}

export interface EnergyStatus {
  station_id: string;
  total_generation_kw: number;
  total_consumption_kw: number;
  solar_generation_kw: number;
  generator_output_kw: number;
  battery_soc_pct: number;
  battery_temp_c: number;
  fuel_consumption_lh: number;
  peak_demand_kw: number;
  current_load_pct: number;
  power_factor: number;
  frequency_hz: number;
  grid_stability: string;
  anomalies_detected: number;
  timestamp: string;
  source: string;
}

export interface StationRiskAssessment {
  station_id: string;
  composite_risk_score: number;
  risk_level: string;
  weather_risk: number;
  infrastructure_risk: number;
  energy_risk: number;
  logistics_risk: number;
  environmental_risk: number;
  methodology_note: string;
  timestamp: string;
}

export interface AssetTelemetry {
  id: string;
  name: string;
  station_id: string;
  category: string;
  building: string;
  model_3d_tag?: string;
  status: string;
  health_score: number;
  runtime_hours: number;
  temperature_c?: number;
  vibration_mms?: number;
  load_pct?: number;
  anomaly_score: number;
  maintenance_risk_pct: number;
  recommendation?: string;
  last_update: string;
}

export interface Alert {
  id: string;
  station_id: string;
  station_name?: string;
  asset_id?: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "WARNING" | "ADVISORY" | "INFO";
  category: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
  created_at: string;
  acknowledged_at?: string;
  acknowledged_by?: string;
}

export interface StationOverview {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  location_name: string;
  commissioned_year: number;
  status: string;
  winter_capacity: number;
  summer_capacity: number;
  weather: WeatherObservation;
  energy: EnergyStatus;
  risk: StationRiskAssessment;
  active_alerts_count: number;
}
