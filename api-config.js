/**
 * LÓGICA LÁCTEA - CLIENTE API v3.3
 * Conexión centralizada con Google Apps Script
 */

const DAIRY_API_URL = "https://script.google.com/macros/s/AKfycbwJCuYWJWf9W6SsECUzsRSPGeNzOF2NVwtt2Kb_Lt7EIZ_DCreeKebarkbgyv-xUBrLXQ/exec";

const DairyAPI = {
    /**
     * Obtiene datos de cualquier pestaña (Inventario, Ventas, Clientes)
     */
    obtenerDatos: async (pestaña) => {
        try {
            const response = await fetch(`${DAIRY_API_URL}?pestaña=${pestaña}`);
            if (!response.ok) throw new Error("Error en la respuesta del servidor");
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener datos de ${pestaña}:`, error);
            return [];
        }
    },

    /**
     * Envía datos para registrar Ventas, Clientes o actualizar Inventario
     */
    enviarDatos: async (pestaña, datos) => {
        try {
            const payload = { 
                pestaña: pestaña, 
                ...datos 
            };

            const response = await fetch(DAIRY_API_URL, {
                method: 'POST',
                mode: 'no-cors', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            return true; 
        } catch (error) {
            console.error(`Error al enviar datos a ${pestaña}:`, error);
            throw error;
        }
    }
};

// --- ELIMINADO EL ERROR DE LA LÍNEA 54 ---
// Asegúrate de que no haya ninguna palabra "api" suelta aquí abajo.
