// sw.js - Estrategia: Network First para archivos estáticos, Network Only para API
const CACHE_NAME = "logica-lactea-v8";  // Cambia este número cada vez que actualices el SW
const URLS_TO_CACHE = [
    "/lacteos-app-/",
    "/lacteos-app-/index.html",
    "/lacteos-app-/NuevaCompra.html",
    "/lacteos-app-/RegistrodeVentas.html",
    "/lacteos-app-/GestiondeDespachos.html",
    "/lacteos-app-/ConfirmarRecepcion.html",
    "/lacteos-app-/ControldeInventario.html",
    "/lacteos-app-/GestiondeClientes.html",
    "/lacteos-app-/Proveedores.html",
    "/lacteos-app-/finanzas.html",
    "/lacteos-app-/api-config.js",
    "/lacteos-app-/menu-logic.js",
    "/lacteos-app-/estilos-lacteos.css"
];

// Instalación: guarda en caché los archivos básicos
self.addEventListener("install", event => {
    console.log("SW instalado - versión", CACHE_NAME);
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
    );
    self.skipWaiting(); // Fuerza a que el SW nuevo tome control inmediato
});

// Activación: borra cachés antiguas
self.addEventListener("activate", event => {
    console.log("SW activado - limpiando cachés viejas");
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim(); // Toma control de las páginas abiertas sin recargarlas
});

// Fetch: network-first para archivos estáticos, network-only para API de Google
self.addEventListener("fetch", event => {
    const url = new URL(event.request.url);
    
    // Si es una petición a Google Apps Script (API) -> Siempre a la red, sin caché
    if (url.hostname.includes("script.google.com") || url.pathname.includes("/exec")) {
        event.respondWith(fetch(event.request, { cache: "no-store" }));
        return;
    }
    
    // Para archivos estáticos de la app: intenta red primero, si falla usa caché
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Si la red responde OK, clona y guarda en caché para futuros offline
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Si no hay red, sirve desde caché
                return caches.match(event.request);
            })
    );
});
