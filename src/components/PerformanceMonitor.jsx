/**
 * Componente para Monitoramento de Performance
 * Mostra:
 * - Server Status (Vercel Edge / Origin)
 * - Web Vitals (FCP, LCP, CLS, TTFB)
 * - Cache Status
 * - Network Information
 */

"use client";

import { useEffect, useState } from "react";

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    ttfb: null,
    fcp: null,
    lcp: null,
    cls: null,
    cacheStatus: null,
    serverLocation: null,
    networkType: null,
  });

  useEffect(() => {
    // Obter Web Vitals
    if ("web-vital" in window) {
      const { getCLS, getFCP, getLCP, getTTFB } = window;

      getCLS((metric) => {
        setMetrics((prev) => ({ ...prev, cls: metric.value }));
      });

      getFCP((metric) => {
        setMetrics((prev) => ({ ...prev, fcp: metric.value }));
      });

      getLCP((metric) => {
        setMetrics((prev) => ({ ...prev, lcp: metric.value }));
      });

      getTTFB((metric) => {
        setMetrics((prev) => ({ ...prev, ttfb: metric.value }));
      });
    }

    // Obter informações de rede
    if ("connection" in navigator) {
      const connection = navigator.connection;
      setMetrics((prev) => ({
        ...prev,
        networkType: connection.effectiveType,
      }));
    }

    // Verificar cache status via headers
    fetch("/api/health")
      .then((res) => {
        const cacheControl = res.headers.get("cache-control");
        const cacheStatus = res.headers.get("x-vercel-cache");
        
        setMetrics((prev) => ({
          ...prev,
          cacheStatus: cacheStatus || cacheControl,
        }));

        return res.json();
      })
      .catch(() => {
        // Silencioso
      });

    // Obter localização do servidor via Vercel headers
    fetch("/api/health")
      .then((res) => {
        const region = res.headers.get("x-vercel-region") || "unknown";
        setMetrics((prev) => ({
          ...prev,
          serverLocation: region,
        }));
      })
      .catch(() => {
        // Silencioso
      });
  }, []);

  // Não renderizar em produção por padrão
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const formatMetric = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "number") return value.toFixed(2) + "ms";
    return value;
  };

  const getMetricColor = (name, value) => {
    if (value === null) return "text-gray-500";

    const thresholds = {
      fcp: { good: 1800, warn: 3000 },
      lcp: { good: 2500, warn: 4000 },
      ttfb: { good: 600, warn: 1200 },
      cls: { good: 0.1, warn: 0.25 },
    };

    const threshold = thresholds[name];
    if (!threshold) return "text-gray-400";

    if (value <= threshold.good) return "text-green-500";
    if (value <= threshold.warn) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-green-400 rounded p-3 text-xs font-mono max-w-sm z-50">
      <div className="text-green-400 font-bold mb-2">📊 Performance Monitor</div>

      {/* Web Vitals */}
      <div className="space-y-1 mb-2 border-b border-gray-700 pb-2">
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={getMetricColor("fcp", metrics.fcp)}>
            {formatMetric(metrics.fcp)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={getMetricColor("lcp", metrics.lcp)}>
            {formatMetric(metrics.lcp)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={getMetricColor("cls", metrics.cls)}>
            {formatMetric(metrics.cls)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={getMetricColor("ttfb", metrics.ttfb)}>
            {formatMetric(metrics.ttfb)}
          </span>
        </div>
      </div>

      {/* Network Info */}
      <div className="space-y-1 mb-2 border-b border-gray-700 pb-2">
        <div className="flex justify-between">
          <span>Network:</span>
          <span className="text-blue-400">{metrics.networkType || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span>Server:</span>
          <span className="text-purple-400">{metrics.serverLocation || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span>Cache:</span>
          <span className="text-cyan-400 truncate">
            {metrics.cacheStatus || "—"}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="text-gray-500 text-xs">
        <div>🟢 Good | 🟡 Warn | 🔴 Poor</div>
      </div>
    </div>
  );
}
