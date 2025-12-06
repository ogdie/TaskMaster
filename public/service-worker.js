/// <reference lib="webworker" />
/* eslint-disable no-undef */

const CACHE_NAME = "taskmaster-v1";
const SYNC_TAG = "sync-tasks";

// Instalar service worker
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");
  event.waitUntil(self.skipWaiting());
});

// Ativar service worker
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  event.waitUntil(self.clients.claim());
});

// Interceptar requisições
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Apenas cache para GET requests
  if (request.method !== "GET") {
    return;
  }

  // Estratégia: Network First para API, Cache First para assets
  if (url.pathname.startsWith("/api/")) {
    // Network first para API (tentar rede, cair para cache)
    event.respondWith(networkFirst(request));
  } else {
    // Cache first para assets estáticos
    event.respondWith(cacheFirst(request));
  }
});

// Network First Strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    // Cache bem-sucedidas
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log("[SW] Network request failed, trying cache...", error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Se não há cache, retornar erro offline
    return new Response("Offline - Não há dados em cache", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Cache First Strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log("[SW] Fetch failed:", error);
    return new Response("Offline", { status: 503 });
  }
}

// Background Sync para mutations
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag);

  if (event.tag === SYNC_TAG) {
    event.waitUntil(syncTasks());
  }
});

async function syncTasks() {
  try {
    // Recuperar tarefas pendentes do IndexedDB
    const pendingTasks = await getPendingTasks();

    console.log("[SW] Syncing", pendingTasks.length, "pending tasks");

    for (const task of pendingTasks) {
      try {
        // Enviar para servidor
        const response = await fetch("/api/tasks", {
          method: task.method || "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task.data),
        });

        if (response.ok) {
          // Remover da fila
          await removePendingTask(task.id);
          console.log("[SW] Task synced:", task.id);
        }
      } catch (error) {
        console.error("[SW] Failed to sync task:", task.id, error);
      }
    }
  } catch (error) {
    console.error("[SW] Sync failed:", error);
    throw error; // Retry sync
  }
}

// IndexedDB helpers
function getPendingTasks() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TaskMasterDB", 1);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("pendingTasks", "readonly");
      const store = transaction.objectStore("pendingTasks");
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
    };

    request.onerror = () => reject(request.error);
  });
}

function removePendingTask(taskId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TaskMasterDB", 1);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("pendingTasks", "readwrite");
      const store = transaction.objectStore("pendingTasks");
      const deleteRequest = store.delete(taskId);

      deleteRequest.onsuccess = () => {
        resolve();
      };
    };

    request.onerror = () => reject(request.error);
  });
}
