// lib/offlineStorage.js
// IndexedDB para armazenar tarefas offline

export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TaskMasterDB", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Object Store para tarefas pendentes
      if (!db.objectStoreNames.contains("pendingTasks")) {
        db.createObjectStore("pendingTasks", { keyPath: "id" });
      }

      // Object Store para cache de tarefas
      if (!db.objectStoreNames.contains("tasks")) {
        const taskStore = db.createObjectStore("tasks", { keyPath: "_id" });
        taskStore.createIndex("userId", "userId", { unique: false });
        taskStore.createIndex("createdAt", "createdAt", { unique: false });
      }
    };
  });
}

// Adicionar tarefa à fila de sync
export async function addPendingTask(task, method = "POST") {
  const db = await initDB();
  const transaction = db.transaction("pendingTasks", "readwrite");
  const store = transaction.objectStore("pendingTasks");

  const pendingTask = {
    id: `${Date.now()}-${Math.random()}`,
    data: task,
    method,
    timestamp: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const request = store.add(pendingTask);
    request.onsuccess = () => {
      console.log("[Offline] Task queued:", pendingTask.id);
      resolve(pendingTask.id);
    };
    request.onerror = () => reject(request.error);
  });
}

// Recuperar tarefas do cache
export async function getCachedTasks(userId) {
  const db = await initDB();
  const transaction = db.transaction("tasks", "readonly");
  const store = transaction.objectStore("tasks");
  const index = store.index("userId");

  return new Promise((resolve, reject) => {
    const request = index.getAll(userId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Salvar tarefas no cache
export async function cacheTasks(userId, tasks) {
  const db = await initDB();
  const transaction = db.transaction("tasks", "readwrite");
  const store = transaction.objectStore("tasks");

  tasks.forEach((task) => {
    store.put({ ...task, userId });
  });

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Registrar para Background Sync
export async function requestBackgroundSync() {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register("sync-tasks");
      console.log("[Sync] Background sync registered");
    } catch (error) {
      console.error("[Sync] Failed to register sync:", error);
    }
  }
}

// Verificar se está online
export function isOnline() {
  return navigator.onLine;
}

// Listen to online/offline events
export function onOnlineStatusChange(callback) {
  window.addEventListener("online", () => callback(true));
  window.addEventListener("offline", () => callback(false));
}
