const getApiBase = () => {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    const base = process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
    return base.endsWith("/api") ? base : `${base}/api`;
  }
  return "http://127.0.0.1:8080/api";
};

const API_BASE = getApiBase();

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Backend fetch failed for ${endpoint}, using client fallback:`, err);
    throw err;
  }
}

export async function getStations() {
  return fetchApi<any[]>("/stations");
}

export async function getStationDetails(stationId: string) {
  return fetchApi<any>(`/stations/${stationId}`);
}

export async function getEnergyStatus(stationId: string = "maitri") {
  return fetchApi<any>(`/energy/${stationId}`);
}

export async function getStationAssets(stationId: string = "maitri") {
  return fetchApi<any[]>(`/assets?station_id=${stationId}`);
}

export async function getAlerts(stationId: string = "all") {
  return fetchApi<any[]>(`/alerts?station_id=${stationId}`);
}

export async function acknowledgeAlert(alertId: string, operatorName: string = "NCPOR Shift Lead") {
  return fetchApi<any>(`/alerts/${alertId}/acknowledge`, {
    method: "POST",
    body: JSON.stringify({ operator_name: operatorName, notes: "Acknowledged in Mission Control SCADA." }),
  });
}

export async function getTelemetryHistory(stationId: string, metric: string, timeRange: string) {
  return fetchApi<any>(`/telemetry/history?station_id=${stationId}&metric=${metric}&time_range=${timeRange}`);
}

export async function getCctvStreams(userRole: string = "OPERATOR") {
  return fetchApi<any[]>(`/cctv?user_role=${userRole}`);
}

export async function getGisLayers() {
  return fetchApi<any>("/gis/layers");
}

export async function getLogistics(stationId: string = "all") {
  return fetchApi<any[]>(`/logistics?station_id=${stationId}`);
}

export async function getReports(stationId: string = "maitri") {
  return fetchApi<any>(`/reports/summary?station_id=${stationId}`);
}

export async function getAuditLogs(stationId: string = "all") {
  return fetchApi<any[]>(`/audit?station_id=${stationId}`);
}

export async function queryAIAssistant(query: string, stationId: string = "all") {
  return fetchApi<any>("/ai/query", {
    method: "POST",
    body: JSON.stringify({ query, station_id: stationId, user_role: "OPERATOR" }),
  });
}

export async function triggerDemoScenario(scenarioType: string, stationId: string = "maitri") {
  return fetchApi<any>("/demo/trigger", {
    method: "POST",
    body: JSON.stringify({ scenario_type: scenarioType, station_id: stationId }),
  });
}
