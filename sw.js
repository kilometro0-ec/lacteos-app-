const CACHE_NAME = "logica-lactea-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./NuevaCompra.html",
  "./ConfirmarRecepcion.html",
  "./ControldeInventario.html",
  "./GestiondeClientes.html",
  "./GestiondeDespachos.html",
  "./Proveedores.html",
  "./RegistrodeVentas.html",
  "./finanzas.html",
  "./estilos-lacteos.css",
  "./api-config.js",
  "./menu-logic.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
