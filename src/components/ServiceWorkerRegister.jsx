"use client";
import { useEffect, useState } from "react";
import { onOnlineStatusChange, requestBackgroundSync } from "@/lib/offlineStorage";

export function ServiceWorkerRegister() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Registrar Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("[PWA] Service Worker registration failed:", error);
        });
    }

    // Monitorar status online/offline
    setIsOnline(navigator.onLine);
    onOnlineStatusChange((online) => {
      setIsOnline(online);
      console.log("[PWA] Online status changed:", online);

      // Quando voltar online, solicitar sincronização
      if (online) {
        requestBackgroundSync().catch(console.error);
      }
    });
  }, []);

  // Mostrar banner quando offline
  if (!isOnline) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-900 text-yellow-100 p-3 text-center z-50">
        <p className="text-sm">
          📡 Você está offline. As alterações serão sincronizadas quando a internet voltar.
        </p>
      </div>
    );
  }

  return null;
}
