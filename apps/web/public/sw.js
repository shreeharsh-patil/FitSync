const CACHE_NAME = "fitsync-cache-v1";
const STATIC_RESOURCES = [
  "/",
  "/dashboard",
  "/workout",
  "/nutrition",
  "/progress",
  "/settings",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_RESOURCES);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((response) => {
          if (
            response.status === 200 &&
            response.type === "basic" &&
            event.request.url.startsWith(self.location.origin)
          ) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
          return new Response("Offline", { status: 503 });
        });
    })
  );
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || "FitSync";
    const options = {
      body: data.body || "",
      icon: data.icon || "/icon.png",
      badge: data.badge || "/badge.png",
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: data.actions || [],
      tag: data.tag || "default",
      renotify: data.renotify || false,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch {
    const title = "FitSync";
    const options = {
      body: event.data.text(),
      icon: "/icon.png",
      badge: "/badge.png",
    };
    event.waitUntil(self.registration.showNotification(title, options));
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data;
  const urlToOpen = data?.url || "/dashboard";

  const actionHandlers: Record<string, string> = {
    view: urlToOpen,
    dismiss: "",
    workout: "/workout",
    nutrition: "/nutrition",
    progress: "/progress",
  };

  const actionUrl = actionHandlers[event.action] || urlToOpen;

  if (actionUrl) {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((windowClients) => {
          const existing = windowClients.find(
            (client) =>
              client.url === actionUrl && "focus" in client
          );
          if (existing) {
            existing.focus();
            return;
          }
          return clients.openWindow(actionUrl);
        })
    );
  }
});
