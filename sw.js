const CACHE_NAME = "logica-lactea-v18";  // 👈 Incrementa este número cada vez que subas cambios
const urlsToCache = [
    "/lacteos-app-/",
    "/lacteos-app-/index.html",
    "/lacteos-app-/RegistrodeVentas.html",
    "/lacteos-app-/GestiondeDespachos.html",
    "/lacteos-app-/ConfirmarRecepcion.html",
    "/lacteos-app-/ControldeInventario.html",
    "/lacteos-app-/GestiondeClientes.html",
    "/lacteos-app-/Proveedores.html",
    "/lacteos-app-/finanzas.html",
    "/lacteos-app-/NuevaCompra.html",
    "/lacteos-app-/api-config.js",
    "/lacteos-app-/menu-logic.js",
    "/lacteos-app-/estilos-lacteos.css"
];

self.addEventListener("install", event => {
    console.log("SW instalado", CACHE_NAME);
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting(); // Toma control inmediato
});

self.addEventListener("activate", event => {
    console.log("SW activado, limpiando viejas");
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    const url = new URL(event.request.url);
    
    // 🔥 Para peticiones a Google Apps Script (API) → SIEMPRE RED, sin caché
    if (url.hostname.includes("script.google.com") || url.pathname.includes("/exec")) {
        event.respondWith(fetch(event.request, { cache: "no-store" }));
        return;
    }
    
    // 📦 Para archivos estáticos de la app → Network First, fallback a caché
    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
