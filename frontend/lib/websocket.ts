const getWsUrl = () => {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    const httpUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "");
    return httpUrl.replace(/^http:/, "ws:").replace(/^https:/, "wss:") + "/ws/telemetry";
  }
  return "ws://127.0.0.1:8080/ws/telemetry";
};

const WS_URL = getWsUrl();

export function useStationWebSocket() {
  const [telemetryData, setTelemetryData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setTelemetryData(data);
          } catch (e) {
            console.error("WS Parse error", e);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          // Auto-reconnect after 3s
          reconnectTimeout = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          setIsConnected(false);
          ws.close();
        };
      } catch {
        setIsConnected(false);
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { telemetryData, isConnected };
}
