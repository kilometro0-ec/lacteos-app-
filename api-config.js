/**
 * LÓGICA LÁCTEA - CONFIGURACIÓN DE API v2.0
 * Unificación de variables y Caché de alto rendimiento
 */

const DairyAPI = {
    // REEMPLAZA ESTA URL con la que obtengas al "Implementar" en Apps Script
    url_base: "https://script.google.com/macros/s/AKfycbx8WzXYLjDlxtvCcQ6Hp6n0a2HRerGMxLBFtex6a6GGfM7yV1Tl8MNgblXWh_fwiQgKpg/exec",
    
    // Almacén de caché para evitar recargas innecesarias
    cache: {},
    cache_duration: 30000, // 30 segundos de vida para los datos en memoria

    /**
     * Obtiene datos de Google Sheets con lógica de caché
     * @param {string} pestaña - Nombre de la hoja (Ventas, Inventario, Clientes, etc.)
     */
    async obtenerDatos(pestaña) {
        const ahora = Date.now();
        
        // Si los datos están en caché y no han expirado, devolverlos de inmediato
        if (this.cache[pestaña] && (ahora - this.cache[pestaña].timestamp < this.cache_duration)) {
            console.log(`[API] Cargando ${pestaña} desde caché.`);
            return this.cache[pestaña].data;
        }

        try {
            const response = await fetch(`${this.url_base}?pestaña=${pestaña}`);
            if (!response.ok) throw new Error("Error en la red");
            
            const data = await response.json();
            
            // Guardar en caché para la próxima vez
            this.cache[pestaña] = {
                data: data,
                timestamp: ahora
            };
            
            return data;
        } catch (error) {
            console.error(`[API] Error al obtener ${pestaña}:`, error);
            // Si falla la red pero tenemos algo en caché (aunque sea viejo), lo devolvemos
            return this.cache[pestaña] ? this.cache[pestaña].data : null;
        }
    },

    /**
     * Envía datos a Google Sheets
     * @param {Object} payload - Objeto con los datos y la pestaña de destino
     */
    async guardarDatos(payload) {
        try {
            // Limpiamos la caché de la pestaña afectada para forzar recarga tras guardar
            if (payload.pestaña) delete this.cache[payload.pestaña];
            if (payload.pestaña === "Ventas") delete this.cache["Inventario"]; // Las ventas afectan al stock

            const response = await fetch(this.url_base, {
                method: "POST",
                mode: "no-cors", // Para evitar problemas de redirección de Google
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            return { success: true, msg: "Petición enviada correctamente" };
        } catch (error) {
            console.error("[API] Error al guardar:", error);
            return { success: false, msg: error.message };
        }
    }
};
