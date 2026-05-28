const CACHE_NAME = "logica-lactea-v3";

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

self.addEventListener("install", event => {

    console.log("SW instalado");

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            return cache.addAll(URLS_TO_CACHE);

        })

    );

});

self.addEventListener("activate", event => {

    console.log("SW activado");

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if(key !== CACHE_NAME){

                        return caches.delete(key);

                    }

                })

            );

        })

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
