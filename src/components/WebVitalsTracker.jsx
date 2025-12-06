  "use client";

  import { useEffect } from "react";
  import * as Sentry from "@sentry/nextjs";

  export default function WebVitalsTracker() {
    useEffect(() => {
      import("web-vitals").then((wv) => {
        // API da v3
        wv.onCLS((metric) => trackVital("CLS", metric));
        wv.onFID((metric) => trackVital("FID", metric));
        wv.onFCP((metric) => trackVital("FCP", metric));
        wv.onLCP((metric) => trackVital("LCP", metric));
        wv.onTTFB((metric) => trackVital("TTFB", metric));
        if (wv.onINP) wv.onINP((metric) => trackVital("INP", metric));
      });
    }, []);

    function trackVital(name, metric) {
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        Sentry.captureMessage(`Web Vital: ${name}`, {
          level: "info",
          contexts: { webVitals: metric },
        });
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`${name}: ${metric.value.toFixed(2)} (${metric.rating})`);
      }
    }

    return null;
  }
