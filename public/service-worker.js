const CACHE_NAME = "amass-tech-hub-v1"
const STATIC_ASSETS = ["/", "/offline.html", "/icon-192.png", "/styles/offline.css"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip API calls - let them fail gracefully
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ error: "Offline" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        })
      }),
    )
    return
  }

  // Network first strategy for HTML
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cache = caches.open(CACHE_NAME)
            cache.then((c) => c.put(request, response.clone()))
          }
          return response
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return response || caches.match("/offline.html")
          })
        }),
    )
    return
  }

  // Cache first strategy for assets
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request)
    }),
  )
})

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-articles") {
    event.waitUntil(syncArticles())
  }
})

async function syncArticles() {
  try {
    const response = await fetch("/api/sync")
    return response.json()
  } catch (error) {
    console.error("Sync failed:", error)
  }
}

// Push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {}
  const title = data.title || "Amass Tech Hub"
  const options = {
    body: data.body || "New content available",
    icon: "/icon-192.png",
    badge: "/badge-72.png",
    tag: "amass-notification",
    requireInteraction: false,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/")
      }
    }),
  )
})
