/**
 * LÓGICA LÁCTEA - Motor de Configuración y Conectividad API
 * Ecosistema de Conexión Unificada con Google Sheets
 */

const DairyConfig = {
    // Reemplazar por el ID de implementación web generado en Google Apps Script
    SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzwnBqdfJf5NaUmAkJiq9Zl_5mek8rYMcj2NDkD61GZIFzgrn--7MNRHcNGt6PeZw6-Rw/exec",
    VERSION: "1.4"
};

const DairyAPI = {
    /**
     * Obtiene todos los registros de una hoja específica de cálculo.
     * @param {string} pestana Nombre exacto de la pestaña (Clientes, Ventas, Proveedores, Compras, Inventario)
     * @returns {Promise<Array>} Array de objetos con las filas de la hoja
     */
    async obtenerDatos(pestana) {
        const url = `${DairyConfig.SCRIPT_URL}?pestana=${encodeURIComponent(pestana)}&accion=leer`;
        try {
            const response = await fetch(url, {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "text/plain" }
            });
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error al leer datos de la pestaña [${pestana}]:`, error);
            throw error;
        }
    },

    /**
     * Envía mutaciones y procesos transaccionales al servidor.
     * @param {string} pestana Nombre exacto de la pestaña objetivo.
     * @param {Object} payload Datos de la operación incluyendo la acción y variables.
     * @returns {Promise<any>} Respuesta del servidor Apps Script
     */
    async guardarDatos(pestana, payload) {
        try {
            // Estructuramos el envío mediante el método POST
            const response = await fetch(DairyConfig.SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) throw new Error(`Error HTTP en servidor: ${response.status}`);
            
            const textoRespuesta = await response.text();
            try {
                return JSON.parse(textoRespuesta);
            } catch (e) {
                // Si el servidor retorna un string plano como "OK"
                return textoRespuesta;
            }
        } catch (error) {
            console.error(`Error al guardar datos en la pestaña [${pestana}]:`, error);
            throw error;
        }
    }
};
