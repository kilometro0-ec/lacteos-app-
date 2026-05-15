/**
 * LÓGICA LÁCTEA - Motor de Configuración y Conectividad API
 * Ecosistema de Conexión Unificada con Google Sheets
 */

const DairyConfig = {
    // ID de implementación web activo en Google Apps Script
    SCRIPT_URL: "https://script.google.com/macros/s/AKfycby6eRkef5znc1AAljkb7ZcIwKGLuiopwbYljAgDyRujRuznjIVjcUwNAATuWy1jSS-3/exec",
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
     * Envía mutaciones y procesos transaccionales al servidor (CORREGIDO PARA GOOGLE APPS SCRIPT)
     * @param {string} pestana Nombre exacto de la pestaña objetivo.
     * @param {Object} payload Datos de la operación incluyendo la acción y variables.
     * @returns {Promise<any>} Respuesta del servidor Apps Script
     */
    async guardarDatos(pestana, payload) {
        try {
            // Combinamos los datos asegurando la pestaña dentro del cuerpo
            const cuerpoEnvio = { pestana: pestana, ...payload };
            
            // Forzamos parámetros clave en la URL para evitar pérdidas de lectura en el backend de Google
            const urlDestino = `${DairyConfig.SCRIPT_URL}?pestana=${encodeURIComponent(pestana)}&accion=${encodeURIComponent(payload.accion)}`;

            const response = await fetch(urlDestino, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(cuerpoEnvio) 
            });
            
            if (!response.ok) throw new Error(`Error HTTP en servidor: ${response.status}`);
            
            const textoRespuesta = await response.text();
            try {
                return JSON.parse(textoRespuesta);
            } catch (e) {
                // Retorno alternativo si viene texto plano del servidor
                return textoRespuesta;
            }
        } catch (error) {
            console.error(`Error al guardar datos en la pestaña [${pestana}]:`, error);
            throw error;
        }
    }
};
